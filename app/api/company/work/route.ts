import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

const staff=['COMPANY_ADMIN','COMPANY_STAFF'];

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u||!staff.includes(u.role))return NextResponse.json({error:'Unauthorized'},{status:401});
  const body=await req.json();
  const {partnerId,title,description}=body;
  if(!partnerId||!title)return NextResponse.json({error:'partnerId and title are required'},{status:400});
  const partner=await prisma.partnerProfile.findUnique({where:{id:partnerId}});
  if(!partner||partner.status!=='APPROVED')return NextResponse.json({error:'Partner must be approved'},{status:400});
  const work=await prisma.partnerWork.create({data:{partnerId,title,description:description||null}});
  await prisma.auditLog.create({data:{actorId:u.id,action:'PARTNER_WORK_ASSIGNED',entity:'PartnerWork',entityId:work.id,metadata:{partnerId,title}}});
  return NextResponse.json({ok:true,work});
}

export async function PATCH(req:Request){
  const u=await getSessionUser();
  if(!u||!staff.includes(u.role))return NextResponse.json({error:'Unauthorized'},{status:401});
  const body=await req.json();
  const {id,status,description}=body;
  if(!id)return NextResponse.json({error:'id is required'},{status:400});
  const work=await prisma.partnerWork.update({where:{id},data:{...(status!==undefined&&{status}),...(description!==undefined&&{description:description||null})}});
  await prisma.auditLog.create({data:{actorId:u.id,action:'PARTNER_WORK_UPDATED',entity:'PartnerWork',entityId:work.id,metadata:{status:work.status}}});
  return NextResponse.json({ok:true,work});
}
