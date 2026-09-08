import {NextResponse} from 'next/server';
import {z} from 'zod';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';
import {getCurrentOrganization} from '@/lib/organization';

const schema=z.object({subject:z.string().min(2).max(160),message:z.string().min(2).max(5000)});

export async function GET(){
  const u=await getSessionUser();
  if(!u)return NextResponse.json({error:'Login required.'},{status:401});
  if(u.role!=='CLIENT')return NextResponse.json({error:'Client access required.'},{status:403});
  const org=await getCurrentOrganization(u);
  if(!org)return NextResponse.json([]);
  const rows=await prisma.supportTicket.findMany({where:{userId:u.id,organizationId:org.id},orderBy:{createdAt:'desc'}});
  return NextResponse.json(rows);
}

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u)return NextResponse.json({error:'Login required.'},{status:401});
  if(u.role!=='CLIENT')return NextResponse.json({error:'Client access required.'},{status:403});
  const p=schema.safeParse(await req.json().catch(()=>null));
  if(!p.success)return NextResponse.json({error:'Enter a subject and message.'},{status:400});
  const org=await getCurrentOrganization(u);
  if(!org)return NextResponse.json({error:'Organization required.'},{status:400});
  const ticket=await prisma.supportTicket.create({data:{userId:u.id,organizationId:org.id,subject:p.data.subject,message:p.data.message}});
  await prisma.auditLog.create({data:{actorId:u.id,action:'SUPPORT_TICKET_CREATED',entity:'SupportTicket',entityId:ticket.id,metadata:{organizationId:org.id}}});
  return NextResponse.json(ticket,{status:201});
}