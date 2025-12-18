"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
console.log('Running Prisma migrations...');
try {
    console.log('Generating Prisma Client...');
    (0, child_process_1.execSync)('npx prisma generate', { stdio: 'inherit' });
    console.log('Running database migrations...');
    (0, child_process_1.execSync)('npx prisma migrate dev --name init', { stdio: 'inherit' });
    console.log('Migrations completed successfully!');
}
catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}
//# sourceMappingURL=migration.js.map