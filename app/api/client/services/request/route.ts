import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u)return NextResponse.redirect(new URL('/login',req.url));
  if(u.role!=='CLIENT')return NextResponse.json({error:'Client access required.'},{status:403});
  const o=u.organizations[0]?.organization;
  const f=await req.formData();
  const id=String(f.get('serviceId')||'');
  const s=await prisma.service.findUnique({where:{id}});
  if(o&&s)await prisma.clientService.upsert({
    where:{organizationId_serviceId:{organizationId:o.id,serviceId:id}},
    update:{status:'REQUESTED'},
    create:{organizationId:o.id,serviceId:id,status:'REQUESTED',billingCycle:s.monthlyPriceKobo?'MONTHLY':'ONE_TIME',priceKobo:s.monthlyPriceKobo}
  });
  return NextResponse.redirect(new URL('/client/services',req.url));
}
