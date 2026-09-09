import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

const staff=['COMPANY_ADMIN','COMPANY_STAFF'];
const makeNumber=()=>`GB-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u||!staff.includes(u.role))return NextResponse.json({error:'Unauthorized'},{status:401});
  const f=await req.formData();
  if(String(f.get('action')||'')==='status'){
    const invoiceNumber=String(f.get('invoiceNumber')||'');
    const status=String(f.get('status')||'');
    if(!invoiceNumber||!['ISSUED','PAID','VOID','OVERDUE'].includes(status))return NextResponse.json({error:'Invalid invoice update.'},{status:400});
    await prisma.auditLog.create({data:{actorId:u.id,action:'INVOICE_STATUS_CHANGED',entity:'Invoice',entityId:invoiceNumber,metadata:{invoiceNumber,status,changedAt:new Date().toISOString()}}});
    return NextResponse.redirect(new URL('/company/billing',req.url));
  }
  const organizationId=String(f.get('organizationId')||'');
  const clientServiceId=String(f.get('clientServiceId')||'');
  const description=String(f.get('description')||'Service charge').trim();
  const amountKobo=Number(f.get('amountKobo')||0);
  const dueDate=String(f.get('dueDate')||'');
  if(!organizationId||amountKobo<=0||!Number.isInteger(amountKobo)||!dueDate)return NextResponse.json({error:'Organization, positive whole-kobo amount and due date are required.'},{status:400});
  const due=new Date(dueDate);
  if(Number.isNaN(due.getTime()))return NextResponse.json({error:'Invalid due date.'},{status:400});
  const org=await prisma.organization.findUnique({where:{id:organizationId},select:{id:true}});
  if(!org)return NextResponse.json({error:'Organization not found.'},{status:404});
  if(clientServiceId){
    const service=await prisma.clientService.findFirst({where:{id:clientServiceId,organizationId},select:{id:true}});
    if(!service)return NextResponse.json({error:'Selected service does not belong to this organization.'},{status:400});
  }
  const invoice={invoiceNumber:makeNumber(),organizationId,clientServiceId:clientServiceId||null,description:description||'Service charge',amountKobo,status:'ISSUED',dueDate:due.toISOString(),createdAt:new Date().toISOString()};
  await prisma.auditLog.create({data:{actorId:u.id,action:'INVOICE_CREATED',entity:'Invoice',entityId:invoice.invoiceNumber,metadata:invoice}});
  return NextResponse.redirect(new URL('/company/billing',req.url));
}
