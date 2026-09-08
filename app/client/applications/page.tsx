import {redirect} from 'next/navigation';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function Applications(){
  const u=await getSessionUser();
  if(!u) redirect('/login');
  const org=u.organizations[0];
  const apps=org?await prisma.application.findMany({where:{organizationId:org.organizationId},orderBy:{createdAt:'desc'}}):[];
  return <main className="dashboard"><div className="pill">Applications</div><h1>Your applications.</h1><p className="muted">Software and digital products managed by Green Basket for your organization.</p><div className="stack">{apps.length?apps.map(a=><div className="card" key={a.id}><div className="row"><div><h3>{a.name}</h3><p className="muted">{a.productName||'Managed application'}</p></div><span className="badge">{a.status}</span></div>{a.url&&<a href={a.url} target="_blank" rel="noreferrer">Open application →</a>}</div>):<div className="card"><h3>No applications yet</h3><p className="muted">When Green Basket provisions an application for you, it will appear here.</p></div>}</div></main>
}