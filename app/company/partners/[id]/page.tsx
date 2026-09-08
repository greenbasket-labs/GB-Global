import Link from 'next/link';
import {redirect,notFound} from 'next/navigation';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function PartnerDetail({params}:{params:Promise<{id:string}>}){
  const u=await getSessionUser();
  if(!u||!['COMPANY_ADMIN','COMPANY_STAFF'].includes(u.role))redirect('/login');
  const {id}=await params;
  const p=await prisma.partnerProfile.findUnique({where:{id},include:{user:true,capabilities:true,clients:{include:{organization:true}},work:{orderBy:{createdAt:'desc'}}});
  if(!p)notFound();
  return <main className="dashboard"><div className="pill">Company • Partner</div><div className="row"><div><h1>{p.user.name}</h1><p className="muted">{p.user.email} · {p.status}</p></div><Link className="btn" href="/company/partners">Back to partners</Link></div><div className="stats"><div className="stat">Status<strong>{p.status}</strong></div><div className="stat">Capabilities<strong>{p.capabilities.length}</strong></div><div className="stat">Clients<strong>{p.clients.length}</strong></div><div className="stat">Work items<strong>{p.work.length}</strong></div></div><div className="grid"><div className="card"><h2>Capabilities</h2>{p.capabilities.map(c=><div className="list-row" key={c.id}><strong>{c.name}</strong></div>)}</div><div className="card"><h2>Clients</h2>{p.clients.length?p.clients.map(c=><div className="list-row" key={c.id}><strong>{c.organization.name}</strong></div>):<p className="muted">No clients assigned.</p>}</div><div className="card"><h2>Assign work</h2><form method="post" action="/api/company/work" className="stack"><input type="hidden" name="partnerId" value={p.id}/><input name="title" required placeholder="Work title"/><textarea name="description" placeholder="Work description"/><button className="btn" type="submit">Assign work</button></form></div><div className="card"><h2>Work</h2>{p.work.length?p.work.map(w=><div className="list-row" key={w.id}><div><strong>{w.title}</strong><p className="muted">{w.description||'No description.'}</p></div><span className="badge">{w.status}</span></div>):<p className="muted">No work assigned.</p>}</div></div></main>;
}
