import Link from 'next/link';
import {redirect} from 'next/navigation';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

function money(kobo:number){return `₦${(kobo/100).toLocaleString('en-NG')}`}

export default async function Services(){
  const u=await getSessionUser();
  if(!u)redirect('/login');
  if(u.role!=='CLIENT')redirect(u.role==='PARTNER'?'/partner':'/company');
  const o=u.organizations[0]?.organization;
  if(!o)redirect('/');
  const [catalog,services]=await Promise.all([
    prisma.service.findMany({where:{active:true},orderBy:{category:'asc'}}),
    prisma.clientService.findMany({where:{organizationId:o.id},include:{service:true},orderBy:{createdAt:'desc'}})
  ]);
  const owned=new Set(services.map(x=>x.serviceId));
  return <main className="dashboard">
    <div className="pill">Services</div>
    <h1>Your Green Basket services.</h1>
    <p className="muted">Manage what Green Basket is providing for {o.name}.</p>
    <div className="dashnav"><Link href="/client">Overview</Link><Link href="/client/services">Services</Link><Link href="/client/applications">Applications</Link><Link href="/client/billing">Billing</Link><Link href="/client/support">Support</Link></div>
    <section className="section"><h2>Your services</h2><div className="stack">{services.length?services.map(x=><div className="card" key={x.id}><div className="row"><div><div className="pill">{x.status}</div><h3>{x.service.name}</h3><p className="muted">{x.service.description}</p></div><strong>{money(x.priceKobo)}</strong></div><p className="muted">Billing: {x.billingCycle.replace('_',' ')} · {x.status==='ACTIVE'&&x.nextBillingDate?`Next billing ${x.nextBillingDate.toLocaleDateString('en-NG')}`:'Awaiting activation'}</p></div>):<div className="card"><h3>No services yet</h3><p className="muted">Choose a service below and Green Basket will review your request.</p></div>}</div></section>
    <section className="section"><h2>Available services</h2><div className="grid">{catalog.map(x=><div className="card" key={x.id}><div className="pill">{x.category}</div><h3>{x.name}</h3><p className="muted">{x.description}</p>{x.monthlyPriceKobo>0?<p><b>{money(x.monthlyPriceKobo)}/month</b>{x.yearlyPriceKobo>0&&<span className="muted"> · {money(x.yearlyPriceKobo)}/year</span>}</p>:x.oneTimePriceKobo>0?<p><b>{money(x.oneTimePriceKobo)} one-time</b></p>:null}{owned.has(x.id)?<span className="muted">Already requested</span>:<form action="/api/client/services/request" method="post"><input type="hidden" name="serviceId" value={x.id}/><button className="btn">Request service</button></form>}</div>)}</div></section>
  </main>
}