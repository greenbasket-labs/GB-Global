import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {getCurrentOrganization} from '@/lib/organization';
import {prisma} from '@/lib/prisma';

export async function GET(){
  const u=await getSessionUser();
  if(!u||u.role!=='CLIENT') return NextResponse.json({error:'Unauthorized'},{status:401});
  const org=await getCurrentOrganization(u);
  if(!org) return NextResponse.json({assets:[]});
  const assets=await prisma.serviceAsset.findMany({where:{organizationId:org.id},orderBy:{renewalDate:'asc'}});
  return NextResponse.json({assets});
}
