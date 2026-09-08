import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

const staff=['COMPANY_ADMIN','COMPANY_STAFF'];

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u||!staff.includes(u.role))return NextResponse.json({error:'Unauthorized'},{status:401});
  const body=await req.json();
  const {organizationId,type,name,provider,status,renewalDate,serviceUrl,notes}=body;
  if(!organizationId||!type||!name)return NextResponse.json({error:'organizationId, type and name are required'},{status:400});
  const asset=await prisma.serviceAsset.create({data:{organizationId,type,name,provider:provider||null,status:status||'ACTIVE',renewalDate:renewalDate?new Date(renewalDate):null,serviceUrl:serviceUrl||null,notes:notes||null}});
  await prisma.auditLog.create({data:{actorId:u.id,action:'ASSET_CREATED',entity:'ServiceAsset',entityId:asset.id,metadata:{organizationId,type,name}}});
  return NextResponse.json({ok:true,asset});
}

export async function PATCH(req:Request){
  const u=await getSessionUser();
  if(!u||!staff.includes(u.role))return NextResponse.json({error:'Unauthorized'},{status:401});
  const body=await req.json();
  const {id,type,name,provider,status,renewalDate,serviceUrl,notes}=body;
  if(!id)return NextResponse.json({error:'id is required'},{status:400});
  const asset=await prisma.serviceAsset.update({where:{id},data:{...(type!==undefined&&{type}),...(name!==undefined&&{name}),...(provider!==undefined&&{provider:provider||null}),...(status!==undefined&&{status}),...(renewalDate!==undefined&&{renewalDate:renewalDate?new Date(renewalDate):null}),...(serviceUrl!==undefined&&{serviceUrl:serviceUrl||null}),...(notes!==undefined&&{notes:notes||null})}});
  await prisma.auditLog.create({data:{actorId:u.id,action:'ASSET_UPDATED',entity:'ServiceAsset',entityId:asset.id,metadata:{organizationId:asset.organizationId}}});
  return NextResponse.json({ok:true,asset});
}
