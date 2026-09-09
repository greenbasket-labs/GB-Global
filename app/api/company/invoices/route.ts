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
    if(!invoiceNumber||!['ISSUED','PAID','VOID','OVERDUE','SCHEDULED'].includes(status))return NextResponse.json({error:'Invalid invoice update.'},{status:400});
    const created=await prisma.auditLog.findFirst({where:{entity:'Invoice',action:'INVOICE_CREATED',entityId:invoiceNumber},orderBy:{createdAt:'desc'}});
    await prisma.auditLog.create({data:{actorId:u.id,action:'INVOICE_STATUS_CHANGED',entity:'Invoice',entityId:invoiceNumber,metadata:{invoiceNumber,status,changedAt:new Date().toISOString()}}});
    if(status==='PAID'&&created){
      const m=(created.metadata||{}) as Record<string,unknown>;
      const projectId=typeof m.projectId==='string'?m.projectId:'';
      const installmentIndex=Number(m.installmentIndex||0);
      const installmentCount=Number(m.installmentCount||0);
      if(projectId&&installmentIndex>0&&installmentIndex<installmentCount){
        const next=await prisma.auditLog.findFirst({where:{entity:'Invoice',action:'INVOICE_CREATED',metadata:{path:['projectId'],equals:projectId}},orderBy:{createdAt:'asc'},skip:installmentIndex,take:1});
        if(next){
          const nm=(next.metadata||{}) as Record<string,unknown>;
          const nextNumber=String(nm.invoiceNumber||'');
          if(nextNumber)await prisma.auditLog.create({data:{actorId:u.id,action:'INVOICE_STATUS_CHANGED',entity:'Invoice',entityId:nextNumber,metadata:{invoiceNumber:nextNumber,status:'ISSUED',changedAt:new Date().toISOString()}}});
        }
      }
    }
    return NextResponse.redirect(new URL('/company/billing',req.url));
  }
  const organizationId=String(f.get('organizationId')||'');
  const clientServiceId=String(f.get('clientServiceId')||'');
  const description=String(f.get('description')||'Service charge').trim();
  const amountKobo=Number(f.get('amountKobo')||0);
  const dueDate=String(f.get('dueDate')||'');
  const installmentCount=Number(f.get('installmentCount')||1);
  if(!organizationId||amountKobo<=0||!Number.isInteger(amountKobo)||!dueDate)return NextResponse.json({error:'Organization, positive whole-kobo amount and due date are required.'},{status:400});
  if(![1,2,3].includes(installmentCount))return NextResponse.json({error:'Payment plan must be 1, 2 or 3 installments.'},{status:400});
  const due=new Date(dueDate);
  if(Number.isNaN(due.getTime()))return NextResponse.json({error:'Invalid due date.'},{status:400});
  const org=await prisma.organization.findUnique({where:{id:organizationId},select:{id:true}});
  if(!org)return NextResponse.json({error:'Organization not found.'},{status:404});
  if(clientServiceId){
    const service=await prisma.clientService.findFirst({where:{id:clientServiceId,organizationId},select:{id:true,billingCycle:true}});
    if(!service)return NextResponse.json({error:'Selected service does not belong to this organization.'},{status:400});
    if(installmentCount>1&&service.billingCycle!=='ONE_TIME')return NextResponse.json({error:'Installment plans are available only for one-time services.'},{status:400});
  }
  const projectId=installmentCount>1?`project-${makeNumber()}`:null;
  const base=Math.floor(amountKobo/installmentCount);
  const remainder=amountKobo-(base*installmentCount);
  const now=new Date();
  for(let i=1;i<=installmentCount;i++){
    const installmentAmount=base+(i===installmentCount?remainder:0);
    const number=makeNumber();
    const invoice={invoiceNumber:number,organizationId,clientServiceId:clientServiceId||null,description:installmentCount>1?`${description} — Milestone ${i} of ${installmentCount}`:description,amountKobo:installmentAmount,status:i===1?'ISSUED':'SCHEDULED',dueDate:new Date(due.getTime()+((i-1)*30*24*60*60*1000)).toISOString(),createdAt:now.toISOString(),projectId,installmentIndex:i,installmentCount};
    await prisma.auditLog.create({data:{actorId:u.id,action:'INVOICE_CREATED',entity:'Invoice',entityId:number,metadata:invoice}});
  }
  return NextResponse.redirect(new URL('/company/billing',req.url));
}
