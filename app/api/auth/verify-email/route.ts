import {NextResponse} from 'next/server';
import {z} from 'zod';
import {prisma} from '@/lib/prisma';
import {setSession} from '@/lib/auth';
import {verifyEmailCode} from '@/lib/email-verification';

const schema=z.object({email:z.string().email(),code:z.string().regex(/^\d{6}$/)});

export async function POST(req:Request){
  const p=schema.safeParse(await req.json().catch(()=>null));
  if(!p.success)return NextResponse.json({error:'Enter the 6-digit verification code.'},{status:400});
  const email=p.data.email.toLowerCase();
  const user=await prisma.user.findUnique({where:{email}});
  if(!user||user.role!=='CLIENT')return NextResponse.json({error:'The verification code is invalid or expired.'},{status:400});
  if(user.emailVerifiedAt){await setSession(user.id);return NextResponse.json({ok:true});}

  const result=await verifyEmailCode(user.id,p.data.code);
  if(result!=='VERIFIED'){
    const error=result==='EXPIRED'?'The verification code has expired. Please request a new code.':result==='LOCKED'?'Too many incorrect attempts. Please request a new code.':'The verification code is invalid.';
    return NextResponse.json({error},{status:400});
  }

  await setSession(user.id);
  return NextResponse.json({ok:true});
}
