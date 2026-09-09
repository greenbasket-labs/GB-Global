import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import {prisma} from '@/lib/prisma';
import {sendEmailVerificationCode} from '@/lib/email';

const OTP_TTL_MS=10*60*1000;
const RESEND_COOLDOWN_MS=60*1000;
const MAX_ATTEMPTS=5;
const MAX_SENDS_PER_HOUR=5;

function code(){return crypto.randomInt(100000,1000000).toString();}

export function clientIp(req:Request){
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||req.headers.get('x-real-ip')||null;
}

export async function issueEmailVerification(userId:string,email:string,requestIp:string|null){
  const now=new Date();
  const hourAgo=new Date(now.getTime()-60*60*1000);
  const latest=await prisma.emailVerificationCode.findFirst({where:{userId,usedAt:null},orderBy:{createdAt:'desc'}});
  if(latest&&now.getTime()-latest.sentAt.getTime()<RESEND_COOLDOWN_MS)throw new Error('COOLDOWN');

  const emailCount=await prisma.emailVerificationCode.count({where:{email,createdAt:{gte:hourAgo}}});
  if(emailCount>=MAX_SENDS_PER_HOUR)throw new Error('RATE_LIMIT');
  if(requestIp){
    const ipCount=await prisma.emailVerificationCode.count({where:{requestIp,createdAt:{gte:hourAgo}}});
    if(ipCount>=MAX_SENDS_PER_HOUR)throw new Error('RATE_LIMIT');
  }

  const value=code();
  const codeHash=await bcrypt.hash(value,10);
  await prisma.emailVerificationCode.updateMany({where:{userId,usedAt:null},data:{usedAt:now}});
  await prisma.emailVerificationCode.create({data:{userId,email,codeHash,expiresAt:new Date(now.getTime()+OTP_TTL_MS),requestIp}});

  try{await sendEmailVerificationCode(email,value);}catch(error){
    await prisma.emailVerificationCode.updateMany({where:{userId,usedAt:null},data:{usedAt:new Date()}});
    throw error;
  }
}

export async function verifyEmailCode(userId:string,rawCode:string){
  const record=await prisma.emailVerificationCode.findFirst({where:{userId,usedAt:null},orderBy:{createdAt:'desc'}});
  if(!record)return 'INVALID';
  if(record.expiresAt.getTime()<Date.now())return 'EXPIRED';
  if(record.attempts>=MAX_ATTEMPTS)return 'LOCKED';
  const match=await bcrypt.compare(rawCode,record.codeHash);
  if(!match){
    await prisma.emailVerificationCode.update({where:{id:record.id},data:{attempts:{increment:1}}});
    return record.attempts+1>=MAX_ATTEMPTS?'LOCKED':'INVALID';
  }
  await prisma.$transaction([
    prisma.emailVerificationCode.update({where:{id:record.id},data:{usedAt:new Date()}}),
    prisma.user.update({where:{id:userId},data:{emailVerifiedAt:new Date()}}),
  ]);
  return 'VERIFIED';
}

export const verificationPolicy={MAX_ATTEMPTS,RESEND_COOLDOWN_SECONDS:60,EXPIRY_MINUTES:10,MAX_SENDS_PER_HOUR};
