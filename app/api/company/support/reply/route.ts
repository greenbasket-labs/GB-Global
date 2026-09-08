import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

const staff=['COMPANY_ADMIN','COMPANY_STAFF'];

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u||!staff.includes(u.role))return NextResponse.json({error:'Unauthorized'},{status:401});
  const body=await req.json();
  const {ticketId,message,status}=body;
  if(!ticketId||!message?.trim())return NextResponse.json({error:'ticketId and message are required'},{status:400});
  const ticket=await prisma.supportTicket.findUnique({where:{id:ticketId}});
  if(!ticket)return NextResponse.json({error:'Ticket not found'},{status:404});
  const updated=await prisma.supportTicket.update({where:{id:ticket.id},data:{message:`${ticket.message}\n\n[Green Basket reply]\n${message.trim()}`,status:status||'IN_PROGRESS'}});
  await prisma.auditLog.create({data:{actorId:u.id,action:'SUPPORT_REPLIED',entity:'SupportTicket',entityId:ticket.id,metadata:{organizationId:ticket.organizationId,status:updated.status}}});
  return NextResponse.json({ok:true,ticket:updated});
}
