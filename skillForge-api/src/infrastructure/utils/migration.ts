import { execSync } from 'child_process';

console.log('Running Prisma migrations...');
try {
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Running database migrations...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log('Migrations completed successfully!');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}