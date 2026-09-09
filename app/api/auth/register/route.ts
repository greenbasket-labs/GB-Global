import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {z} from 'zod';
import {prisma} from '@/lib/prisma';
import {issueEmailVerification,clientIp} from '@/lib/email-verification';

const schema=z.object({
  name:z.string().min(2).max(120),
  email:z.string().email().max(254),
  phone:z.string().min(7).max(30),
  password:z.string().min(8).max(128),
});

const generic={message:'If the registration can be completed, we will send a verification code to the email address provided.'};

export async function POST(req:Request){
  const p=schema.safeParse(await req.json().catch(()=>null));
  if(!p.success)return NextResponse.json({error:'Please provide valid information.'},{status:400});
  const email=p.data.email.toLowerCase();
  const existing=await prisma.user.findUnique({where:{email}});

  if(existing){
    if(existing.role==='CLIENT'&&!existing.emailVerifiedAt){
      try{await issueEmailVerification(existing.id,email,clientIp(req));}catch(error){
        const message=error instanceof Error?error.message:'';
        if(message==='COOLDOWN'||message==='RATE_LIMIT')return NextResponse.json(generic);
        return NextResponse.json({error:'We could not send the verification email. Please try again later.'},{status:503});
      }
    }
    return NextResponse.json(generic);
  }

  const user=await prisma.user.create({data:{name:p.data.name,email,phone:p.data.phone,passwordHash:await bcrypt.hash(p.data.password,12),role:'CLIENT'}});
  try{
    await issueEmailVerification(user.id,email,clientIp(req));
  }catch{
    await prisma.user.delete({where:{id:user.id}});
    return NextResponse.json({error:'We could not send the verification email. Please try again later.'},{status:503});
  }

  return NextResponse.json({ok:true,message:generic.message});
}
