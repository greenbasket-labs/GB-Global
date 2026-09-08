import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function CompanyControl(){
  const u=await getSessionUser();
  if(!u||u.role!=='COMPANY_ADMIN') redirect('/login');
  const [users,orgs,services,partners,tickets,auditLogs]=await Promise.all([
    prisma.user.count(),prisma.organization.count(),prisma.service.count({where:{active:true}}),prisma.partnerProfile.count({where:{status:'APPROVED'}}),prisma.supportTicket.count({where:{status:{in:['OPEN','IN_PROGRESS']}}}),prisma.auditLog.count()
  ]);
  return <main className="dashboard"><div className="pill">Company Control</div><h1>System Control</h1><p className="muted">High-level visibility into the Green Basket platform.</p><div className="dashnav"><Link href="/company">Overview</Link><Link href="/company/clients">Clients</Link><Link href="/company/partners">Partners</Link><Link href="/company/billing">Billing</Link><Link href="/company/operations">Operations</Link><Link href="/company/control">Control</Link></div><div className="stats"><div className="stat">Users<strong>{users}</strong></div><div className="stat">Organizations<strong>{orgs}</strong></div><div className="stat">Active services<strong>{services}</strong></div><div className="stat">Approved partners<strong>{partners}</strong></div></div><div className="grid"><div className="card"><h2>Platform status</h2><p>Database records are accessible and the company control layer is online.</p><p className="muted">Open support items: {tickets} · Audit records: {auditLogs}</p></div><div className="card"><h2>Security principle</h2><p>Company pages require a signed session and company-admin role. Credentials are never stored in source control.</p></div><div className="card"><h2>V1 operating model</h2><p>External hosting, domains and specialist work can be managed manually while Green Basket validates demand. Automation can be added later without changing the client-facing model.</p></div></div></main>;
}
