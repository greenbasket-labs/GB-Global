import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {createClientOrganization,setCurrentOrganization} from '@/lib/organization';
import {prisma} from '@/lib/prisma';
import {encryptCacNumber,hashCacNumber,normalizeCacNumber} from '@/lib/cac-identity';

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u||u.role!=='CLIENT')return NextResponse.redirect(new URL('/login',req.url));
  const f=await req.formData();
  const action=String(f.get('action')||'');
  if(action==='switch'){
    const id=String(f.get('organizationId')||'');
    const member=u.organizations.find((m:any)=>m.organizationId===id);
    if(member)await setCurrentOrganization(id);
  }
  if(action==='create'){
    const name=String(f.get('name')||'').trim();
    const cacNumber=normalizeCacNumber(String(f.get('cacNumber')||''));
    if(name.length>=2&&cacNumber.length>=2){
      const cacHash=hashCacNumber(cacNumber);
      if(u.cacNumberHash&&u.cacNumberHash!==cacHash)return NextResponse.redirect(new URL('/client/account?error=cac-mismatch',req.url));
      const existing=await prisma.user.findUnique({where:{cacNumberHash:cacHash},select:{id:true}});
      if(existing&&existing.id!==u.id)return NextResponse.redirect(new URL('/client/account?error=cac-used',req.url));
      const org=await createClientOrganization(u.id,name);
      await prisma.user.update({where:{id:u.id},data:{cacNumberHash:cacHash,cacNumberEncrypted:u.cacNumberEncrypted||encryptCacNumber(cacNumber)}});
      await setCurrentOrganization(org.id);
      await prisma.auditLog.create({data:{actorId:u.id,action:'ORGANIZATION_CREATED',entity:'Organization',entityId:org.id,metadata:{name}}});
    }
  }
  return NextResponse.redirect(new URL('/client/account',req.url));
}