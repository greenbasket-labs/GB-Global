import Link from 'next/link';
import {redirect} from 'next/navigation';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function CompanyNotifications(){
  const u=await getSessionUser();
  if(!u||!['COMPANY_ADMIN','COMPANY_STAFF'].includes(u.role)) redirect('/login');

  const now=new Date();
  const in30=new Date(now);
  in30.setDate(in30.getDate()+30);

  const [assets,services]=await Promise.all([
    prisma.serviceAsset.findMany({where:{renewalDate:{not:null,lte:in30}},include:{organization:true},orderBy:{renewalDate:'asc'}}),
    prisma.clientService.findMany({where:{status:'ACTIVE',nextBillingDate:{not:null,lte:in30}},include:{organization:true,service:true},orderBy:{nextBillingDate:'asc'}})
  ]);

  const expiredAssets=assets.filter(x=>x.renewalDate&&new Date(x.renewalDate)<now);
  const expiringAssets=assets.filter(x=>x.renewalDate&&new Date(x.renewalDate)>=now);
  const overdueServices=services.filter(x=>x.nextBillingDate&&new Date(x.nextBillingDate)<now);
  const upcomingServices=services.filter(x=>x.nextBillingDate&&new Date(x.nextBillingDate)>=now);

  function date(value:Date|null){return value?new Date(value).toLocaleDateString('en-NG'):'—'}

  return <main className="dashboard">
    <div className="pill">Company Control</div>
    <h1>Attention Center</h1>
    <p className="muted">Renewals and billing dates that need Green Basket attention.</p>
    <div className="dashnav">
      <Link href="/company">Overview</Link><Link href="/company/clients">Clients</Link><Link href="/company/partners">Partners</Link><Link href="/company/services">Services</Link><Link href="/company/billing">Billing</Link><Link href="/company/operations">Operations</Link><Link href="/company/notifications">Attention</Link><Link href="/company/support">Support</Link><Link href="/company/control">Control</Link>
    </div>
    <div className="stats">
      <div className="stat">Expired assets<strong>{expiredAssets.length}</strong></div>
      <div className="stat">Asset renewals<strong>{expiringAssets.length}</strong></div>
      <div className="stat">Overdue billing<strong>{overdueServices.length}</strong></div>
      <div className="stat">Upcoming billing<strong>{upcomingServices.length}</strong></div>
    </div>
    <div className="grid">
      <div className="card"><h2>Asset renewals</h2>{assets.length===0?<p className="muted">No asset renewals due within 30 days.</p>:assets.map(x=><div className="list-row" key={x.id}><div><strong>{x.name}</strong><span>{x.organization.name} · {x.type} · {x.provider||'Managed by Green Basket'}</span></div><span className="badge">{x.renewalDate&&new Date(x.renewalDate)<now?'EXPIRED':`DUE ${date(x.renewalDate)}`}</span></div>)}</div>
      <div className="card"><h2>Service billing</h2>{services.length===0?<p className="muted">No billing dates due within 30 days.</p>:services.map(x=><div className="list-row" key={x.id}><div><strong>{x.service.name}</strong><span>{x.organization.name} · {x.billingCycle.replace('_',' ')}</span></div><span className="badge">{x.nextBillingDate&&new Date(x.nextBillingDate)<now?'OVERDUE':`DUE ${date(x.nextBillingDate)}`}</span></div>)}</div>
    </div>
  </main>;
}
