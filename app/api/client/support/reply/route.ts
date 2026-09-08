import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u||u.role!=='CLIENT')return NextResponse.json({error:'Unauthorized'},{status:401});
  const body=await req.json();
  const {ticketId,message}=body;
  if(!ticketId||!message?.trim())return NextResponse.json({error:'ticketId and message are required'},{status:400});
  const ticket=await prisma.supportTicket.findFirst({where:{id:ticketId,userId:u.id}});
  if(!ticket)return NextResponse.json({error:'Ticket not found'},{status:404});
  if(ticket.status==='CLOSED')return NextResponse.json({error:'Ticket is closed'},{status:400});
  const updated=await prisma.supportTicket.update({where:{id:ticket.id},data:{message:`${ticket.message}\n\n[Client reply]\n${message.trim()}`,status:'OPEN'}});
  await prisma.auditLog.create({data:{actorId:u.id,action:'SUPPORT_REPLIED',entity:'SupportTicket',entityId:ticket.id,metadata:{organizationId:ticket.organizationId}}});
  return NextResponse.json({ok:true,ticket:updated});
}
