import {cookies} from 'next/headers';
import {prisma} from '@/lib/prisma';

const NAME='gb_org';

export async function getCurrentOrganization(u:any){
  const list=u?.organizations||[];
  if(!list.length)return null;
  const selected=(await cookies()).get(NAME)?.value;
  const match=selected?list.find((m:any)=>m.organizationId===selected):null;
  return (match||list[0])?.organization||null;
}

export async function setCurrentOrganization(id:string){
  (await cookies()).set(NAME,id,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30});
}

export async function createClientOrganization(userId:string,name:string){
  const org=await prisma.organization.create({data:{name,ownerId:userId}});
  await prisma.organizationMember.create({data:{userId,organizationId:org.id,role:'OWNER'}});
  return org;
}