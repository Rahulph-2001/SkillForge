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

async function checkCaseSensitivity() {
    const rootDir = path.resolve('./src');
    const files = await getFiles(rootDir);

    // Create a map of lowercased file paths to actual file paths
    const fileMap = new Map();
    for (const file of files) {
        if (file.endsWith('.ts')) {
            fileMap.set(file.toLowerCase(), file);
        }
    }

    const errors = [];

    for (const file of files) {
        if (!file.endsWith('.ts')) continue;

        const content = fs.readFileSync(file, 'utf8');
        const importRegex = /from ['"](.+)['"]/g;
        let match;

        while ((match = importRegex.exec(content)) !== null) {
            let importPath = match[1];

            // Ignore non-relative imports
            if (!importPath.startsWith('.')) continue;

            const resolvedPath = path.resolve(path.dirname(file), importPath);

            // Check for .ts extension first, then index.ts
            let possiblePaths = [
                resolvedPath + '.ts',
                path.join(resolvedPath, 'index.ts')
            ];

            let found = false;
            for (const p of possiblePaths) {
                if (fileMap.has(p.toLowerCase())) {
                    const actualPath = fileMap.get(p.toLowerCase());

                    // Check if casing matches exactly
                    // We need to be careful about matching the relative part only, as absolute paths might differ in drive letter casing on Windows
                    const relativeActual = path.relative(process.cwd(), actualPath);
                    const relativeResolved = path.relative(process.cwd(), p);

                    // Compare the filenames specifically
                    const actualFilename = path.basename(actualPath);
                    const resolvedFilename = path.basename(p);

                    // This is a naive check, a better one would compare the whole path segment by segment.
                    // But since we have the full actual path, we can verify if the import resolves to it.

                    // Actually, let's just check if the lowercased absolute paths match, but the actual strings are different
                    // However, on Windows, even the root might be different. 
                    // Let's rely on the fileMap logic: 
                    // If we found a file in the map (which is populated from disk), does the import path (resolved) match the actual path's casing?

                    // Import: ./foo/Bar
                    // Disk: ./foo/bar.ts
                    // Resolved Import: .../foo/Bar.ts
                    // Actual on Disk: .../foo/bar.ts

                    // If Resolved Import !== Actual on Disk, we have a problem.

                    // Normalize separators
                    const normActual = actualPath.replace(/\\/g, '/');
                    const normResolved = p.replace(/\\/g, '/');

                    // We only care about the part inside /src/
                    const splitToken = '/src/';
                    if (normActual.includes(splitToken) && normResolved.includes(splitToken)) {
                        const actualPart = normActual.split(splitToken)[1];
                        const resolvedPart = normResolved.split(splitToken)[1];

                        if (actualPart !== resolvedPart) {
                            errors.push(`File: ${path.relative(process.cwd(), file)}\n  Import: ${importPath}\n  Actual: ${actualPart}\n  Expected: ${resolvedPart}`);
                        }
                    }
                    found = true;
                    break;
                }
            }
        }
    }

    if (errors.length > 0) {
        console.log('Case sensitivity issues found:');
        errors.forEach(e => console.log(e));
    } else {
        console.log('No case sensitivity issues found.');
    }
}

checkCaseSensitivity().catch(console.error);
