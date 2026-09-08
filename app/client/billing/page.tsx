import {redirect} from 'next/navigation';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

function money(kobo:number|null){return kobo==null?'—':`₦${(kobo/100).toLocaleString('en-NG')}`}
export default async function Billing(){
 const u=await getSessionUser(); if(!u) redirect('/login'); const org=u.organizations[0];
 const items=org?await prisma.clientService.findMany({where:{organizationId:org.organizationId},include:{service:true},orderBy:{nextBillingDate:'asc'}}):[];
 return <main className="dashboard"><div className="pill">Billing</div><h1>Service billing.</h1><p className="muted">See your current service charges and upcoming billing dates.</p><div className="stack">{items.length?items.map(i=><div className="card" key={i.id}><div className="row"><div><h3>{i.service.name}</h3><p className="muted">{i.billingCycle.replace('_',' ')} • {i.status}</p></div><strong>{money(i.priceKobo)}</strong></div><p className="muted">Next billing: {i.nextBillingDate?i.nextBillingDate.toLocaleDateString('en-NG'):'Not scheduled'}</p></div>):<div className="card"><h3>No billing items yet</h3><p className="muted">Requested or active services will appear here.</p></div>}</div></main>
}