import {NextResponse} from 'next/server';
import {z} from 'zod';
import {prisma} from '@/lib/prisma';
import {issueEmailVerification,clientIp} from '@/lib/email-verification';

const schema=z.object({email:z.string().email()});

export async function POST(req:Request){
  const p=schema.safeParse(await req.json().catch(()=>null));
  if(!p.success)return NextResponse.json({message:'If the account can be verified, a new code will be sent.'});
  const email=p.data.email.toLowerCase();
  const user=await prisma.user.findUnique({where:{email}});
  if(user?.role==='CLIENT'&&!user.emailVerifiedAt){
    try{await issueEmailVerification(user.id,email,clientIp(req));}catch(error){
      const message=error instanceof Error?error.message:'';
      if(message==='COOLDOWN')return NextResponse.json({message:'Please wait before requesting another code.'},{status:429});
      if(message==='RATE_LIMIT')return NextResponse.json({message:'Too many verification requests. Please try again later.'},{status:429});
      return NextResponse.json({message:'We could not send a new code. Please try again later.'},{status:503});
    }
  }
  return NextResponse.json({message:'If the account can be verified, a new code will be sent.'});
}
