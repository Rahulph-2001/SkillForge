const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir);
        return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

async function checkDependencies() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = new Set(Object.keys(packageJson.dependencies || {}));
    const devDependencies = new Set(Object.keys(packageJson.devDependencies || {}));

    const rootDir = path.resolve('./src');
    const files = await getFiles(rootDir);

    const usedPackages = new Set();

    for (const file of files) {
        if (!file.endsWith('.ts') && !file.endsWith('.tsx') && !file.endsWith('.js')) continue;

        const content = fs.readFileSync(file, 'utf8');
        // Regex for import from 'package' and require('package')
        const importRegex = /from ['"]([^.\/][^'"]*)['"]/g;
        const requireRegex = /require\(['"]([^.\/][^'"]*)['"]\)/g;

        let match;
        while ((match = importRegex.exec(content)) !== null) {
            let pkg = match[1];
            if (pkg.startsWith('@')) {
                // Handle scoped packages like @prisma/client
                const parts = pkg.split('/');
                if (parts.length > 1) pkg = `${parts[0]}/${parts[1]}`;
            } else {
                pkg = pkg.split('/')[0];
            }
            usedPackages.add(pkg);
        }

        while ((match = requireRegex.exec(content)) !== null) {
            let pkg = match[1];
            if (pkg.startsWith('@')) {
                const parts = pkg.split('/');
                if (parts.length > 1) pkg = `${parts[0]}/${parts[1]}`;
            } else {
                pkg = pkg.split('/')[0];
            }
            usedPackages.add(pkg);
        }
    }

    const missing = [];
    const devOnly = [];

    const builtInModules = ['fs', 'path', 'util', 'os', 'http', 'https', 'crypto', 'events', 'stream', 'buffer', 'url', 'zlib', 'child_process', 'cluster', 'dgram', 'dns', 'net', 'readline', 'repl', 'tls', 'tty', 'vm', 'worker_threads'];

    for (const pkg of usedPackages) {
        if (builtInModules.includes(pkg)) continue;

        if (!dependencies.has(pkg)) {
            if (devDependencies.has(pkg)) {
                devOnly.push(pkg);
            } else {
                missing.push(pkg);
            }
        }
    }

    if (missing.length > 0) {
        console.log('Missing dependencies (not in package.json at all):');
        missing.forEach(p => console.log(p));
    }

    if (devOnly.length > 0) {
        console.log('Dependencies found only in devDependencies (might crash in production if NODE_ENV=production prunes them):');
        devOnly.forEach(p => console.log(p));
    }

    if (missing.length === 0 && devOnly.length === 0) {
        console.log('Dependencies look good.');
    }
}

checkDependencies().catch(console.error);
