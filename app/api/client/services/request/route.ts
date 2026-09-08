import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u)return NextResponse.redirect(new URL('/login',req.url));
  if(u.role!=='CLIENT')return NextResponse.json({error:'Client access required.'},{status:403});

  const o=u.organizations[0]?.organization;
  if(!o)return NextResponse.json({error:'Organization required.'},{status:400});

  const f=await req.formData();
  const id=String(f.get('serviceId')||'');
  if(!id)return NextResponse.json({error:'Service is required.'},{status:400});

  const s=await prisma.service.findFirst({where:{id,active:true}});
  if(!s)return NextResponse.json({error:'Service is unavailable.'},{status:404});

  const billingCycle=s.monthlyPriceKobo>0?'MONTHLY':s.yearlyPriceKobo>0?'YEARLY':'ONE_TIME';
  const priceKobo=billingCycle==='MONTHLY'?s.monthlyPriceKobo:billingCycle==='YEARLY'?s.yearlyPriceKobo:s.oneTimePriceKobo;

  const existing=await prisma.clientService.findUnique({where:{organizationId_serviceId:{organizationId:o.id,serviceId:id}}});
  const cs=await prisma.clientService.upsert({
    where:{organizationId_serviceId:{organizationId:o.id,serviceId:id}},
    update:{status:existing?.status==='ACTIVE'?'ACTIVE':'REQUESTED',billingCycle,priceKobo},
    create:{organizationId:o.id,serviceId:id,status:'REQUESTED',billingCycle,priceKobo}
  });

  await prisma.auditLog.create({
    data:{actorId:u.id,action:'SERVICE_REQUESTED',entity:'ClientService',entityId:cs.id,metadata:{organizationId:o.id,serviceId:id,serviceName:s.name}}
  });

  return NextResponse.redirect(new URL('/client/services',req.url));
}
