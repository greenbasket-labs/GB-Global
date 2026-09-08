import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function CompanyBilling(){
  const u=await getSessionUser();
  if(!u||u.role!=='COMPANY_ADMIN') redirect('/login');
  const records=await prisma.clientService.findMany({
    include:{organization:true,service:true},
    orderBy:{nextBillingDate:'asc'}
  });
  const recurring=records.filter(x=>x.billingCycle!=='ONE_TIME');
  const active=recurring.filter(x=>x.status==='ACTIVE');
  const monthly=active.filter(x=>x.billingCycle==='MONTHLY').reduce((s,x)=>s+x.priceKobo,0);
  const yearly=active.filter(x=>x.billingCycle==='YEARLY').reduce((s,x)=>s+x.priceKobo,0);
  return <main className="dashboard"><div className="pill">Company Control</div><h1>Billing</h1><p className="muted">Track client services, recurring charges and upcoming renewals.</p><div className="dashnav"><Link href="/company">Overview</Link><Link href="/company/clients">Clients</Link><Link href="/company/services">Services</Link><Link href="/company/billing">Billing</Link><Link href="/company/operations">Operations</Link><Link href="/company/support">Support</Link></div><div className="stats"><div className="stat">Recurring services<strong>{recurring.length}</strong></div><div className="stat">Active<strong>{active.length}</strong></div><div className="stat">Monthly value<strong>₦{(monthly/100).toLocaleString()}</strong></div><div className="stat">Yearly value<strong>₦{(yearly/100).toLocaleString()}</strong></div></div><div className="card"><h2>Service billing</h2><div className="table-wrap"><table><thead><tr><th>Client</th><th>Service</th><th>Cycle</th><th>Amount</th><th>Status</th><th>Next billing</th></tr></thead><tbody>{records.map(x=><tr key={x.id}><td>{x.organization.name}</td><td>{x.service.name}</td><td>{x.billingCycle.replace('_',' ')}</td><td>₦{(x.priceKobo/100).toLocaleString()}</td><td>{x.status}</td><td>{x.nextBillingDate?new Date(x.nextBillingDate).toLocaleDateString():'—'}</td></tr>)}</tbody></table></div></div></main>;
}
