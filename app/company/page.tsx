import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import LogoutButton from '@/components/logout-button';

export default async function Company(){
  const u=await getSessionUser();
  if(!u||!['COMPANY_ADMIN','COMPANY_STAFF'].includes(u.role))redirect('/login');

  const now=new Date();
  const in30=new Date(now);
  in30.setDate(in30.getDate()+30);

  const [clients,services,partners,apps,tickets,renewals,assetRenewals]=await Promise.all([
    prisma.organization.count(),
    prisma.service.count({where:{active:true}}),
    prisma.partnerProfile.count(),
    prisma.application.count(),
    prisma.supportTicket.count({where:{status:{in:['OPEN','IN_PROGRESS']}}}),
    prisma.clientService.count({where:{status:'ACTIVE',nextBillingDate:{not:null,lte:in30}}}),
    prisma.serviceAsset.count({where:{renewalDate:{not:null,lte:in30}}})
  ]);

  const attention=renewals+assetRenewals;

  return <main className="dashboard">
    <div className="pill">Company Control</div>
    <div className="row">
      <div>
        <h1>Green Basket Control Center</h1>
        <p className="muted">Signed in as {u.role==='COMPANY_ADMIN'?'Company Admin':'Company Staff'}</p>
      </div>
      <LogoutButton/>
    </div>

    <div className="dashnav">
      <Link href="/company">Overview</Link>
      <Link href="/company/clients">Clients</Link>
      <Link href="/company/partners">Partners</Link>
      <Link href="/company/services">Services</Link>
      <Link href="/company/billing">Billing</Link>
      <Link href="/company/operations">Operations</Link>
      <Link href="/company/notifications">Attention</Link>
      <Link href="/company/support">Support</Link>
      <Link href="/company/control">Control</Link>
    </div>

    <div className="stats">
      <div className="stat">Organizations<strong>{clients}</strong></div>
      <div className="stat">Services<strong>{services}</strong></div>
      <div className="stat">Partners<strong>{partners}</strong></div>
      <div className="stat">Applications<strong>{apps}</strong></div>
    </div>

    <div className="grid">
      <div className="card">
        <h3>Support queue</h3>
        <p className="muted">{tickets} open or active tickets.</p>
        <Link href="/company/support">Open support →</Link>
      </div>
      <div className="card">
        <h3>Attention</h3>
        <p className="muted">{attention} renewal or billing items need attention within 30 days.</p>
        <Link href="/company/notifications">Open attention center →</Link>
      </div>
      <div className="card">
        <h3>Operations</h3>
        <p className="muted">Manage clients, services, partners and incoming work from one control center.</p>
        <Link href="/company/operations">Open operations →</Link>
      </div>
    </div>
  </main>;
}
