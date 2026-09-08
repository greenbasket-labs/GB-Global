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
  const description=String(f.get('description')||'Service charge');
  const amountKobo=Number(f.get('amountKobo')||0);
  const dueDate=String(f.get('dueDate')||'');
  if(!organizationId||amountKobo<=0||!dueDate)return NextResponse.json({error:'Organization, positive amount and due date are required.'},{status:400});
  const invoice={invoiceNumber:makeNumber(),organizationId,clientServiceId:clientServiceId||null,description,amountKobo,status:'ISSUED',dueDate,createdAt:new Date().toISOString()};
  await prisma.auditLog.create({data:{actorId:u.id,action:'INVOICE_CREATED',entity:'Invoice',entityId:invoice.invoiceNumber,metadata:invoice}});
  return NextResponse.redirect(new URL('/company/billing',req.url));
}
