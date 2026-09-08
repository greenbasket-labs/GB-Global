import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

function money(kobo:number){return `₦${(kobo/100).toLocaleString('en-NG')}`}

type Invoice= {invoiceNumber:string;organizationId:string;clientServiceId:string|null;description:string;amountKobo:number;status:string;dueDate:string;createdAt:string;organizationName?:string};

export default async function CompanyInvoices(){
  const u=await getSessionUser();
  if(!u||!['COMPANY_ADMIN','COMPANY_STAFF'].includes(u.role))redirect('/login');
  const [created,changes,orgs,services]=await Promise.all([
    prisma.auditLog.findMany({where:{entity:'Invoice',action:'INVOICE_CREATED'},orderBy:{createdAt:'desc'},take:100}),
    prisma.auditLog.findMany({where:{entity:'Invoice',action:'INVOICE_STATUS_CHANGED'},orderBy:{createdAt:'asc'},take:500}),
    prisma.organization.findMany({orderBy:{name:'asc'}}),
    prisma.clientService.findMany({where:{status:'ACTIVE'},include:{organization:true,service:true},orderBy:{organization:{name:'asc'}}})
  ]);
  const statusMap=new Map<string,string>();
  for(const x of changes){const m=(x.metadata||{}) as Record<string,unknown>;if(typeof m.invoiceNumber==='string'&&typeof m.status==='string')statusMap.set(m.invoiceNumber,m.status)}
  const invoices:Invoice[]=created.map(x=>{const m=(x.metadata||{}) as Record<string,unknown>;const invoiceNumber=String(m.invoiceNumber||x.entityId||'');const org=orgs.find(o=>o.id===m.organizationId);return {invoiceNumber,organizationId:String(m.organizationId||''),clientServiceId:typeof m.clientServiceId==='string'?m.clientServiceId:null,description:String(m.description||''),amountKobo:Number(m.amountKobo||0),status:statusMap.get(invoiceNumber)||String(m.status||'ISSUED'),dueDate:String(m.dueDate||''),createdAt:String(m.createdAt||x.createdAt.toISOString()),organizationName:org?.name||'Unknown organization'}});
  const outstanding=invoices.filter(x=>x.status==='ISSUED'||x.status==='OVERDUE').reduce((s,x)=>s+x.amountKobo,0);
  const paid=invoices.filter(x=>x.status==='PAID').reduce((s,x)=>s+x.amountKobo,0);
  return <main className="dashboard">
    <div className="pill">Company Control</div><div className="row"><div><h1>Invoices</h1><p className="muted">Create invoices, track what is due and record payments manually.</p></div><Link className="btn" href="/company/billing">Back to billing</Link></div>
    <div className="dashnav"><Link href="/company">Overview</Link><Link href="/company/clients">Clients</Link><Link href="/company/partners">Partners</Link><Link href="/company/services">Services</Link><Link href="/company/billing">Billing</Link><Link href="/company/invoices">Invoices</Link><Link href="/company/operations">Operations</Link><Link href="/company/support">Support</Link><Link href="/company/control">Control</Link></div>
    <div className="stats"><div className="stat">Invoices<strong>{invoices.length}</strong></div><div className="stat">Outstanding<strong>{money(outstanding)}</strong></div><div className="stat">Recorded paid<strong>{money(paid)}</strong></div><div className="stat">Active services<strong>{services.length}</strong></div></div>
    <div className="card"><h2>Create invoice</h2><form action="/api/company/invoices" method="post" className="stack"><label>Client<select name="organizationId" required><option value="">Select client</option>{orgs.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label><label>Service (optional)<select name="clientServiceId"><option value="">Manual / other</option>{services.map(s=><option key={s.id} value={s.id}>{s.organization.name} — {s.service.name}</option>)}</select></label><label>Description<input name="description" required defaultValue="Service charge"/></label><label>Amount (kobo)<input name="amountKobo" type="number" min="1" required placeholder="3000000"/></label><label>Due date<input name="dueDate" type="date" required/></label><button className="btn" type="submit">Issue invoice</button></form></div>
    <div className="card"><h2>Invoice ledger</h2>{invoices.length===0?<p className="muted">No invoices have been issued yet.</p>:<div className="table-wrap"><table><thead><tr><th>Invoice</th><th>Client</th><th>Description</th><th>Amount</th><th>Due</th><th>Status</th><th>Action</th></tr></thead><tbody>{invoices.map(i=><tr key={i.invoiceNumber}><td>{i.invoiceNumber}</td><td>{i.organizationName}</td><td>{i.description}</td><td>{money(i.amountKobo)}</td><td>{i.dueDate?new Date(i.dueDate).toLocaleDateString('en-NG'):'—'}</td><td>{i.status}</td><td>{i.status!=='PAID'&&i.status!=='VOID'?<form action="/api/company/invoices" method="post"><input type="hidden" name="action" value="status"/><input type="hidden" name="invoiceNumber" value={i.invoiceNumber}/><input type="hidden" name="status" value="PAID"/><button className="btn" type="submit">Mark paid</button></form>:null}</td></tr>)}</tbody></table></div>}</div>
  </main>;
}
