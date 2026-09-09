import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {z} from 'zod';
import {prisma} from '@/lib/prisma';
import {setSession} from '@/lib/auth';

const schema=z.object({email:z.string().email(),password:z.string().min(8)});

export async function POST(req:Request){
  const p=schema.safeParse(await req.json().catch(()=>null));
  if(!p.success)return NextResponse.json({error:'Invalid credentials.'},{status:400});
  const u=await prisma.user.findUnique({where:{email:p.data.email.toLowerCase()}});
  if(!u||!(await bcrypt.compare(p.data.password,u.passwordHash)))return NextResponse.json({error:'Invalid credentials.'},{status:401});
  if(u.role==='CLIENT'&&!u.emailVerifiedAt)return NextResponse.json({error:'Please verify your email before signing in.',verificationRequired:true},{status:403});
  await setSession(u.id);
  return NextResponse.json({ok:true,role:u.role});
}
