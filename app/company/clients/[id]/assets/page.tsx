import Link from 'next/link';
import {redirect,notFound} from 'next/navigation';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function ClientAssets({params}:{params:Promise<{id:string}>}){
  const u=await getSessionUser();
  if(!u||!['COMPANY_ADMIN','COMPANY_STAFF'].includes(u.role))redirect('/login');
  const {id}=await params;
  const org=await prisma.organization.findUnique({where:{id},include:{assets:{orderBy:{renewalDate:'asc'}}}});
  if(!org)notFound();
  const today=new Date();
  const in30=new Date(); in30.setDate(in30.getDate()+30);
  return <main className="dashboard"><div className="pill">Company • Assets</div><div className="row"><div><h1>{org.name}</h1><p className="muted">Managed domains, hosting and infrastructure.</p></div><Link className="btn" href={`/company/clients/${org.id}`}>Back to client</Link></div><div className="stats"><div className="stat">Assets<strong>{org.assets.length}</strong></div><div className="stat">Active<strong>{org.assets.filter(x=>x.status==='ACTIVE').length}</strong></div><div className="stat">Expiring soon<strong>{org.assets.filter(x=>x.renewalDate&&x.renewalDate>=today&&x.renewalDate<=in30).length}</strong></div><div className="stat">Expired<strong>{org.assets.filter(x=>x.status==='EXPIRED').length}</strong></div></div><div className="card"><h2>Add managed asset</h2><form method="post" action="/api/company/assets" className="form-grid"><input type="hidden" name="organizationId" value={org.id}/><label>Type<select name="type" defaultValue="DOMAIN"><option value="DOMAIN">Domain</option><option value="HOSTING">Hosting</option><option value="SERVER">Server</option><option value="BACKUP">Backup</option><option value="OTHER">Other</option></select></label><label>Name<input name="name" required placeholder="example.com or Main Hosting"/></label><label>Provider<input name="provider" placeholder="Provider name"/></label><label>Renewal date<input name="renewalDate" type="date"/></label><label>Service URL<input name="serviceUrl" placeholder="https://..."/></label><label>Notes<textarea name="notes" placeholder="Internal notes"/></label><div><button className="btn" type="submit">Add asset</button></div></form></div><div className="card"><h2>Managed assets</h2>{org.assets.length===0?<p className="muted">No assets recorded yet.</p>:<div className="table-wrap"><table><thead><tr><th>Type</th><th>Name</th><th>Provider</th><th>Status</th><th>Renewal</th><th>URL</th></tr></thead><tbody>{org.assets.map(x=><tr key={x.id}><td>{x.type}</td><td><strong>{x.name}</strong></td><td>{x.provider||'—'}</td><td>{x.status}</td><td>{x.renewalDate?x.renewalDate.toLocaleDateString():'—'}</td><td>{x.serviceUrl?<a href={x.serviceUrl} target="_blank">Open</a>:'—'}</td></tr>)}</tbody></table></div>}</div></main>;
}
