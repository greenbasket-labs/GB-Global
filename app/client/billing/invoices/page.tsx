import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getSessionUser} from '@/lib/auth';
import {getCurrentOrganization} from '@/lib/organization';
import {prisma} from '@/lib/prisma';

function money(kobo:number){return `₦${(kobo/100).toLocaleString('en-NG')}`}

export default async function ClientInvoices(){
  const u=await getSessionUser();
  if(!u)redirect('/login');
  if(u.role!=='CLIENT')redirect(u.role==='PARTNER'?'/partner':'/company');
  const org=await getCurrentOrganization(u);
  if(!org)redirect('/client/account');
  const [created,changes]=await Promise.all([
    prisma.auditLog.findMany({where:{entity:'Invoice',action:'INVOICE_CREATED'},orderBy:{createdAt:'desc'},take:100}),
    prisma.auditLog.findMany({where:{entity:'Invoice',action:'INVOICE_STATUS_CHANGED'},orderBy:{createdAt:'asc'},take:500})
  ]);
  const statusMap=new Map<string,string>();
  for(const x of changes){const m=(x.metadata||{}) as Record<string,unknown>;if(typeof m.invoiceNumber==='string'&&typeof m.status==='string')statusMap.set(m.invoiceNumber,m.status)}
  const invoices=created.map(x=>(x.metadata||{}) as Record<string,unknown>).filter(m=>m.organizationId===org.id).map(m=>{const number=String(m.invoiceNumber||'');return {number,description:String(m.description||''),amount:Number(m.amountKobo||0),due:String(m.dueDate||''),status:statusMap.get(number)||String(m.status||'ISSUED')}});
  const outstanding=invoices.filter(x=>x.status==='ISSUED'||x.status==='OVERDUE').reduce((s,x)=>s+x.amount,0);
  return <main className="dashboard"><div className="pill">Billing</div><div className="row"><div><h1>Invoices.</h1><p className="muted">Your Green Basket invoices for {org.name}.</p></div><Link className="btn" href="/client/billing">Back to billing</Link></div><div className="dashnav"><Link href="/client">Overview</Link><Link href="/client/services">Services</Link><Link href="/client/applications">Applications</Link><Link href="/client/billing">Billing</Link><Link href="/client/billing/invoices">Invoices</Link><Link href="/client/support">Support</Link><Link href="/client/account">Account</Link></div><div className="stats"><div className="stat">Invoices<strong>{invoices.length}</strong></div><div className="stat">Outstanding<strong>{money(outstanding)}</strong></div></div><div className="card"><h2>Invoice history</h2>{invoices.length===0?<p className="muted">No invoices have been issued to this organization.</p>:<div className="table-wrap"><table><thead><tr><th>Invoice</th><th>Description</th><th>Amount</th><th>Due</th><th>Status</th></tr></thead><tbody>{invoices.map(i=><tr key={i.number}><td>{i.number}</td><td>{i.description}</td><td>{money(i.amount)}</td><td>{i.due?new Date(i.due).toLocaleDateString('en-NG'):'—'}</td><td>{i.status}</td></tr>)}</tbody></table></div>}</div></main>;
}
