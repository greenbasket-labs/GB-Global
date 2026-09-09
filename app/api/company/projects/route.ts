import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export async function POST(req:Request){
  const u=await getSessionUser();
  if(!u||!['COMPANY_ADMIN','COMPANY_STAFF'].includes(u.role)) return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const body=await req.json();
    const action=String(body.action||'');
    const milestoneId=String(body.milestoneId||'');
    if(!milestoneId) return NextResponse.json({error:'Milestone is required'},{status:400});

    if(action==='assign'){
      const partnerId=String(body.partnerId||'');
      if(!partnerId) return NextResponse.json({error:'Partner is required'},{status:400});
      const milestone=await prisma.milestone.findUnique({where:{id:milestoneId},include:{project:true}});
      if(!milestone) return NextResponse.json({error:'Milestone not found'},{status:404});
      const partner=await prisma.partnerProfile.findFirst({where:{id:partnerId,status:'APPROVED'},include:{user:true}});
      if(!partner) return NextResponse.json({error:'Partner is not approved'},{status:400});
      const work=await prisma.partnerWork.create({data:{partnerId,title:milestone.title,description:milestone.description,status:'ASSIGNED'}});
      await prisma.milestone.update({where:{id:milestoneId},data:{partnerWorkId:work.id}});
      return NextResponse.json({ok:true});
    }

    if(action==='review'){
      const decision=String(body.decision||'');
      const milestone=await prisma.milestone.findUnique({where:{id:milestoneId},include:{project:true}});
      if(!milestone) return NextResponse.json({error:'Milestone not found'},{status:404});
      if(milestone.status!=='SUBMITTED') return NextResponse.json({error:'Only submitted proof can be reviewed'},{status:400});
      if(decision==='reject'){
        await prisma.milestone.update({where:{id:milestoneId},data:{status:'REJECTED',reviewedAt:new Date(),reviewedById:u.id}});
        return NextResponse.json({ok:true});
      }
      if(decision==='approve'){
        await prisma.milestone.update({where:{id:milestoneId},data:{status:'APPROVED',reviewedAt:new Date(),reviewedById:u.id}});
        const paid=await prisma.auditLog.findFirst({where:{action:'INVOICE_STATUS_CHANGED',entity:'Invoice',metadata:{contains:milestone.sequence.toString()}}});
        void paid;
        return NextResponse.json({ok:true});
      }
      return NextResponse.json({error:'Invalid decision'},{status:400});
    }
    return NextResponse.json({error:'Invalid action'},{status:400});
  }catch(e){
    console.error(e);
    return NextResponse.json({error:'Request failed'},{status:500});
  }
}
