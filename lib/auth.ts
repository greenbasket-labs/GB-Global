import crypto from "crypto";
import {cookies} from "next/headers";
import {prisma} from "@/lib/prisma";

const NAME="gb_session";
const SECRET=process.env.SESSION_SECRET;

function sign(value:string){
  if(!SECRET) throw new Error("SESSION_SECRET is required.");
  return crypto.createHmac("sha256",SECRET).update(value).digest("hex");
}

export async function setSession(userId:string){
  const nonce=crypto.randomBytes(16).toString("hex");
  const value=`${userId}.${nonce}`;
  const token=`${value}.${sign(value)}`;
  (await cookies()).set(NAME,token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*24*30});
}

export async function clearSession(){
  (await cookies()).set(NAME,"",{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:0});
}

export async function getSessionUser(){
  const token=(await cookies()).get(NAME)?.value;
  if(!token||!SECRET)return null;
  const parts=token.split(".");
  if(parts.length!==3)return null;
  const [id,nonce,sig]=parts;
  const expected=sign(`${id}.${nonce}`);
  try{
    if(sig.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return null;
  }catch{return null}
  return prisma.user.findUnique({where:{id},include:{organizations:{include:{organization:true}},partner:{include:{capabilities:true}}}});
}
