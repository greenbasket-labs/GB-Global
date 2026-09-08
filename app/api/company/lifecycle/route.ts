import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

const serviceStatuses=['REQUESTED','ACTIVE','PAUSED','COMPLETED','CANCELLED'] as const;
const applicationStatuses=['REQUESTED','BUILDING','ACTIVE','DEGRADED','DOWN','SUSPENDED','COMPLETED'] as const;

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u)return NextResponse.redirect(new URL('/login',req.url));
  if(!['COMPANY_ADMIN','COMPANY_STAFF'].includes(u.role))return NextResponse.json({error:'Company access required.'},{status:403});
  const f=await req.formData();
  const kind=String(f.get('kind')||'');
  const id=String(f.get('id')||'');
  const status=String(f.get('status')||'');
  if(!id||!['service','application'].includes(kind)||!status)return NextResponse.json({error:'Lifecycle update is incomplete.'},{status:400});

  if(kind==='service'){
    if(!serviceStatuses.includes(status as typeof serviceStatuses[number]))return NextResponse.json({error:'Invalid service status.'},{status:400});
    const current=await prisma.clientService.findUnique({where:{id},include:{service:true,organization:true}});
    if(!current)return NextResponse.json({error:'Service not found.'},{status:404});
    const updated=await prisma.clientService.update({where:{id},data:{status:status as typeof serviceStatuses[number],startDate:status==='ACTIVE'&&!current.startDate?new Date():current.startDate}});
    await prisma.auditLog.create({data:{actorId:u.id,action:'SERVICE_STATUS_CHANGED',entity:'ClientService',entityId:id,metadata:{organizationId:current.organizationId,serviceId:current.serviceId,serviceName:current.service.name,from:current.status,to:status}}});
  }else{
    if(!applicationStatuses.includes(status as typeof applicationStatuses[number]))return NextResponse.json({error:'Invalid application status.'},{status:400});
    const current=await prisma.application.findUnique({where:{id},include:{organization:true}});
    if(!current)return NextResponse.json({error:'Application not found.'},{status:404});
    await prisma.application.update({where:{id},data:{status:status as typeof applicationStatuses[number]}});
    await prisma.auditLog.create({data:{actorId:u.id,action:'APPLICATION_STATUS_CHANGED',entity:'Application',entityId:id,metadata:{organizationId:current.organizationId,applicationName:current.name,from:current.status,to:status}}});
  }
  return NextResponse.redirect(new URL('/company/operations',req.url));
}
