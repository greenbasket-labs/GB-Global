import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u)return NextResponse.redirect(new URL('/login',req.url));
  if(!['COMPANY_ADMIN','COMPANY_STAFF'].includes(u.role))return NextResponse.json({error:'Company access required.'},{status:403});

  const f=await req.formData();
  const id=String(f.get('clientServiceId')||'');
  if(!id)return NextResponse.json({error:'Service request is required.'},{status:400});

  const cs=await prisma.clientService.findUnique({where:{id},include:{service:true,organization:true}});
  if(!cs)return NextResponse.json({error:'Service request not found.'},{status:404});
  if(cs.status!=='REQUESTED')return NextResponse.json({error:'Only requested services can be activated.'},{status:409});

  const startDate=new Date();
  const nextBillingDate=cs.billingCycle==='MONTHLY'?new Date(startDate.getFullYear(),startDate.getMonth()+1,startDate.getDate()):cs.billingCycle==='YEARLY'?new Date(startDate.getFullYear()+1,startDate.getMonth(),startDate.getDate()):null;

  const updated=await prisma.clientService.update({
    where:{id},
    data:{status:'ACTIVE',startDate,nextBillingDate}
  });

  await prisma.auditLog.create({
    data:{actorId:u.id,action:'SERVICE_ACTIVATED',entity:'ClientService',entityId:updated.id,metadata:{organizationId:cs.organizationId,serviceId:cs.serviceId,serviceName:cs.service.name,billingCycle:cs.billingCycle,priceKobo:cs.priceKobo}}
  });

  return NextResponse.redirect(new URL('/company/operations',req.url));
}
