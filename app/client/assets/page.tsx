import {redirect} from 'next/navigation';
import Link from 'next/link';
import {getSessionUser} from '@/lib/auth';
import {getCurrentOrganization} from '@/lib/organization';
import {prisma} from '@/lib/prisma';

const typeLabel=(x:string)=>x.replace('_',' ');

export default async function ClientAssets(){
  const u=await getSessionUser();
  if(!u) redirect('/login');
  if(u.role!=='CLIENT') redirect(u.role==='PARTNER'?'/partner':'/company');
  const org=await getCurrentOrganization(u);
  const assets=org?await prisma.serviceAsset.findMany({where:{organizationId:org.id},orderBy:{renewalDate:'asc'}}):[];
  return <main className="dashboard">
    <div className="pill">Client Portal</div>
    <h1>Domains & infrastructure</h1>
    <p className="muted">Manage the domains, hosting and infrastructure Green Basket manages for {org?.name||'your organization'}.</p>
    <div className="dashnav"><Link href="/client">Overview</Link><Link href="/client/account">Account</Link><Link href="/client/services">Services</Link><Link href="/client/assets">Assets</Link><Link href="/client/applications">Applications</Link><Link href="/client/billing">Billing</Link><Link href="/client/support">Support</Link></div>
    {assets.length===0?<div className="card"><h2>No managed assets yet</h2><p className="muted">When Green Basket sets up a domain, hosting, backup or other infrastructure for this organization, it will appear here.</p></div>:<div className="card"><h2>Managed assets</h2><div className="table-wrap"><table><thead><tr><th>Asset</th><th>Type</th><th>Provider</th><th>Status</th><th>Renewal</th></tr></thead><tbody>{assets.map(x=><tr key={x.id}><td><strong>{x.name}</strong>{x.serviceUrl?<div className="muted">{x.serviceUrl}</div>:null}</td><td>{typeLabel(x.type)}</td><td>{x.provider||'Green Basket'}</td><td>{x.status}</td><td>{x.renewalDate?new Date(x.renewalDate).toLocaleDateString():'—'}</td></tr>)}</tbody></table></div></div>}
  </main>;
}
