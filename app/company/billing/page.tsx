import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function CompanyBilling(){
  const u=await getSessionUser();
  if(!u||!['COMPANY_ADMIN','COMPANY_STAFF'].includes(u.role)) redirect('/login');

  const records=await prisma.clientService.findMany({
    include:{organization:true,service:true},
    orderBy:{nextBillingDate:'asc'}
  });

  const active=records.filter(x=>x.status==='ACTIVE');
  const recurring=active.filter(x=>x.billingCycle!=='ONE_TIME');
  const monthly=recurring.filter(x=>x.billingCycle==='MONTHLY').reduce((s,x)=>s+x.priceKobo,0);
  const yearly=recurring.filter(x=>x.billingCycle==='YEARLY').reduce((s,x)=>s+x.priceKobo,0);
  const annualized=monthly*12+yearly;
  const oneTime=active.filter(x=>x.billingCycle==='ONE_TIME').reduce((s,x)=>s+x.priceKobo,0);

  const now=new Date();
  const in30=new Date(now);
  in30.setDate(in30.getDate()+30);
  const upcoming=active.filter(x=>x.nextBillingDate&&new Date(x.nextBillingDate)>=now&&new Date(x.nextBillingDate)<=in30);

  return <main className="dashboard">
    <div className="pill">Company Control</div>
    <h1>Billing</h1>
    <p className="muted">See what clients are paying, recurring revenue and renewals at a glance.</p>

    <div className="dashnav">
      <Link href="/company">Overview</Link><Link href="/company/clients">Clients</Link><Link href="/company/services">Services</Link><Link href="/company/billing">Billing</Link><Link href="/company/operations">Operations</Link><Link href="/company/support">Support</Link><Link href="/company/control">Control</Link>
    </div>

    <div className="stats">
      <div className="stat">Active services<strong>{active.length}</strong></div>
      <div className="stat">Monthly recurring<strong>₦{(monthly/100).toLocaleString()}</strong></div>
      <div className="stat">Annual recurring<strong>₦{(annualized/100).toLocaleString()}</strong></div>
      <div className="stat">One-time value<strong>₦{(oneTime/100).toLocaleString()}</strong></div>
    </div>

    <div className="card">
      <h2>Upcoming renewals</h2>
      <p className="muted">Recurring services due within the next 30 days.</p>
      {upcoming.length===0?<p className="muted">No renewals due in the next 30 days.</p>:<div className="table-wrap"><table><thead><tr><th>Client</th><th>Service</th><th>Cycle</th><th>Amount</th><th>Renewal</th></tr></thead><tbody>{upcoming.map(x=><tr key={x.id}><td>{x.organization.name}</td><td>{x.service.name}</td><td>{x.billingCycle.replace('_',' ')}</td><td>₦{(x.priceKobo/100).toLocaleString()}</td><td>{new Date(x.nextBillingDate!).toLocaleDateString()}</td></tr>)}</tbody></table></div>}
    </div>

    <div className="card">
      <h2>All service billing</h2>
      <div className="table-wrap"><table><thead><tr><th>Client</th><th>Service</th><th>Cycle</th><th>Amount</th><th>Status</th><th>Next billing</th></tr></thead><tbody>{records.map(x=><tr key={x.id}><td>{x.organization.name}</td><td>{x.service.name}</td><td>{x.billingCycle.replace('_',' ')}</td><td>₦{(x.priceKobo/100).toLocaleString()}</td><td>{x.status}</td><td>{x.nextBillingDate?new Date(x.nextBillingDate).toLocaleDateString():'—'}</td></tr>)}</tbody></table></div></div>
  </main>;
}
