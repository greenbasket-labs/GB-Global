import bcrypt from 'bcryptjs';
import {PrismaClient, UserRole} from '@prisma/client';

const prisma=new PrismaClient();

function required(name:string){
  const value=process.env[name]?.trim();
  if(!value) throw new Error(`${name} is required.`);
  return value;
}

async function main(){
  const email=required('ADMIN_EMAIL').toLowerCase();
  const name=required('ADMIN_NAME');
  const password=required('ADMIN_PASSWORD');
  if(password.length<12) throw new Error('ADMIN_PASSWORD must be at least 12 characters.');

  const passwordHash=await bcrypt.hash(password,12);
  const user=await prisma.user.upsert({
    where:{email},
    update:{name,passwordHash,role:UserRole.COMPANY_ADMIN},
    create:{name,email,passwordHash,role:UserRole.COMPANY_ADMIN}
  });
  console.log(`Company admin ready: ${user.email}`);
}

main().catch(error=>{console.error(error instanceof Error?error.message:error);process.exit(1)}).finally(()=>prisma.$disconnect());
