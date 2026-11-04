import { cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(packageRoot, 'src', 'generated');
const target = join(packageRoot, 'dist', 'generated');

if (!existsSync(source)) {
  console.error('Missing Prisma generated client. Run prisma generate first.');
  process.exit(1);
}

cpSync(source, target, { recursive: true });
