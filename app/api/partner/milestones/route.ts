import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u||u.role!=='PARTNER')return NextResponse.json({error:'Unauthorized'},{status:401});
  const p=await prisma.partnerProfile.findUnique({where:{userId:u.id}});
  if(!p||p.status!=='APPROVED')return NextResponse.json({error:'Approved partner access required.'},{status:403});
  const f=await req.formData();
  const milestoneId=String(f.get('milestoneId')||'');
  const action=String(f.get('action')||'');
  const m=await prisma.milestone.findFirst({where:{id:milestoneId,partnerWork:{partnerId:p.id}}});
  if(!m)return NextResponse.json({error:'Milestone not found.'},{status:404});
  if(action==='start'){
    if(!['AVAILABLE','REJECTED'].includes(m.status))return NextResponse.json({error:'Milestone cannot be started from this status.'},{status:400});
    await prisma.milestone.update({where:{id:m.id},data:{status:'IN_PROGRESS'}});
    await prisma.auditLog.create({data:{actorId:u.id,action:'MILESTONE_STARTED',entity:'Milestone',entityId:m.id,metadata:{status:'IN_PROGRESS'}}});
  }else if(action==='submit'){
    const proofUrl=String(f.get('proofUrl')||'').trim();
    const proofNote=String(f.get('proofNote')||'').trim();
    if(!proofUrl&&!proofNote)return NextResponse.json({error:'Add a proof link or proof note.'},{status:400});
    if(!['IN_PROGRESS','REJECTED'].includes(m.status))return NextResponse.json({error:'Milestone is not ready for proof submission.'},{status:400});
    if(proofUrl){try{const url=new URL(proofUrl);if(!['http:','https:'].includes(url.protocol))throw new Error();}catch{return NextResponse.json({error:'Proof link must be a valid http or https URL.'},{status:400});}}
    await prisma.milestone.update({where:{id:m.id},data:{status:'SUBMITTED',proofUrl:proofUrl||null,proofNote:proofNote||null,submittedAt:new Date(),reviewedAt:null,reviewedById:null}});
    await prisma.auditLog.create({data:{actorId:u.id,action:'MILESTONE_SUBMITTED',entity:'Milestone',entityId:m.id,metadata:{proofUrl:proofUrl||null,proofNote:proofNote||null}}});
  }else return NextResponse.json({error:'Invalid action.'},{status:400});
  return NextResponse.redirect(new URL('/partner/work',req.url));
}
