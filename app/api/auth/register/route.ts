import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {z} from 'zod';
import {prisma} from '@/lib/prisma';
import {setSession} from '@/lib/auth';

const schema=z.object({
  name:z.string().min(2).max(120),
  email:z.string().email().max(254),
  phone:z.string().min(7).max(30),
  password:z.string().min(8).max(128),
});

export async function POST(req:Request){
  const p=schema.safeParse(await req.json().catch(()=>null));
  if(!p.success)return NextResponse.json({error:'Please provide valid information.'},{status:400});
  const email=p.data.email.toLowerCase();
  const existing=await prisma.user.findUnique({where:{email}});

  if(existing)return NextResponse.json({error:'An account with this email already exists. Please sign in.'},{status:409});

  const user=await prisma.user.create({
    data:{
      name:p.data.name,
      email,
      phone:p.data.phone,
      passwordHash:await bcrypt.hash(p.data.password,12),
      role:'CLIENT',
    },
  });

  await setSession(user.id);
  return NextResponse.json({ok:true,role:user.role});
}
