import crypto from "crypto";
import {cookies} from "next/headers";
import {prisma} from "@/lib/prisma";
const NAME="gb_session"; const SECRET=process.env.SESSION_SECRET||"development-only-change-me";
function sign(v:string){return crypto.createHmac("sha256",SECRET).update(v).digest("hex")}
export async function setSession(userId:string){const nonce=crypto.randomBytes(16).toString("hex");const value=`${userId}.${nonce}`;const token=`${value}.${sign(value)}`;(await cookies()).set(NAME,token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*24*30})}
export async function getSessionUser(){const token=(await cookies()).get(NAME)?.value;if(!token)return null;const p=token.split(".");if(p.length!==3)return null;const [id,nonce,sig]=p;const expected=sign(`${id}.${nonce}`);try{if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return null}catch{return null}return prisma.user.findUnique({where:{id},include:{organizations:{include:{organization:true}},partner:{include:{capabilities:true}}}})}
