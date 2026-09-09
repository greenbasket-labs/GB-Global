import {PrismaClient} from '@prisma/client';import bcrypt from 'bcryptjs';
const prisma=new PrismaClient();
const services=[
 ['School Management System','School software and ongoing management support','SOFTWARE',0,3000000,33000000],
 ['Website Development','Business website design and development','SOFTWARE',25000000,0,0],
 ['Domain','Domain registration and management','INFRASTRUCTURE',1500000,200000,2400000],
 ['Hosting','Managed application hosting','INFRASTRUCTURE',0,1500000,18000000],
 ['Backup','Managed backups and operational protection','INFRASTRUCTURE',0,500000,6000000],
 ['Technical Support','Ongoing technical support and maintenance','TECHNICAL',0,1000000,12000000],
 ['Digital Marketing','Marketing and digital growth support','PROFESSIONAL',0,2500000,30000000],
 ['CAC Registration Assistance','Assistance with online CAC business registration and related requirements','PROFESSIONAL',0,0,0],
 ['CAC Company Updates','Assistance with eligible online CAC company changes and updates','PROFESSIONAL',0,0,0],
 ['Tax Registration Assistance','Assistance with online tax ID and registration processes','PROFESSIONAL',0,0,0],
 ['Annual Returns Assistance','Assistance preparing and coordinating annual returns requirements','PROFESSIONAL',0,0,0],
 ['Business Documentation Support','Help preparing and coordinating common business documentation needs','PROFESSIONAL',0,0,0]
] as const;
async function main(){
 for(const [name,description,category,oneTime,monthly,yearly] of services){const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-');await prisma.service.upsert({where:{slug},update:{name,description,category:category as any,oneTimePriceKobo:oneTime,monthlyPriceKobo:monthly,yearlyPriceKobo:yearly,active:true},create:{name,slug,description,category:category as any,oneTimePriceKobo:oneTime,monthlyPriceKobo:monthly,yearlyPriceKobo:yearly}})}
 const email=process.env.ADMIN_EMAIL?.toLowerCase();const password=process.env.ADMIN_PASSWORD;if(email&&password&&password.length>=12){const hash=await bcrypt.hash(password,12);await prisma.user.upsert({where:{email},update:{name:'Green Basket Admin',passwordHash:hash,role:'COMPANY_ADMIN',emailVerifiedAt:new Date()},create:{name:'Green Basket Admin',email,passwordHash:hash,role:'COMPANY_ADMIN',emailVerifiedAt:new Date()}});console.log(`Admin account seeded for ${email}.`)}else console.log('Admin seed skipped. Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters) to create/update the company admin.');
}main().finally(()=>prisma.$disconnect());
