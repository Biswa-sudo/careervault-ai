const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const requiredPackageScripts = ['dev', 'start', 'migrate', 'seed', 'verify'];
const requiredPaths = [
  'src/app.js',
  'src/server.js',
  'src/config/env.js',
  'src/db/pool.js',
  'src/middleware',
  'src/modules/auth',
  'src/modules/users',
  'src/utils',
  'scripts/migrate.js',
  'scripts/seed.js',
  '../database/migrations/001_create_users.sql',
  '../database/migrations/002_create_password_reset_tokens.sql'
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function verifyPackageScripts() {
  const packageJson = require(path.join(rootDir, 'package.json'));
  for (const script of requiredPackageScripts) {
    assert(packageJson.scripts?.[script], `Missing package.json script: ${script}`);
  }
}

function verifyFolderStructure() {
  for (const relativePath of requiredPaths) {
    const fullPath = path.resolve(rootDir, relativePath);
    assert(fs.existsSync(fullPath), `Missing required path: ${relativePath}`);
  }
}

function verifyImports() {
  require(path.join(rootDir, 'src/app'));

  const sourceFiles = [];
  collectJsFiles(path.join(rootDir, 'src'), sourceFiles);

  for (const file of sourceFiles) {
    if (file.endsWith(path.join('src', 'server.js'))) {
      continue;
    }
    require(file);
  }
}

function collectJsFiles(directory, files) {
  for (const entry of fs.readdirSync(directory)) {
    const fullPath = path.join(directory, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      collectJsFiles(fullPath, files);
    } else if (entry.endsWith('.js')) {
      files.push(fullPath);
    }
  }
}

function verifyNoCircularLocalDependencies() {
  const sourceFiles = [];
  collectJsFiles(path.join(rootDir, 'src'), sourceFiles);

  const graph = new Map(sourceFiles.map((file) => [file, []]));

  for (const file of sourceFiles) {
    const contents = fs.readFileSync(file, 'utf8');
    const requireMatches = contents.matchAll(/require\(['"](\.{1,2}\/[^'"]+)['"]\)/g);

    for (const match of requireMatches) {
      const requiredPath = resolveRequiredFile(path.dirname(file), match[1]);
      if (requiredPath && graph.has(requiredPath)) {
        graph.get(file).push(requiredPath);
      }
    }
  }

  const visiting = new Set();
  const visited = new Set();

  function visit(file, stack) {
    if (visiting.has(file)) {
      const cycleStart = stack.indexOf(file);
      const cycle = stack.slice(cycleStart).concat(file).map((item) => path.relative(rootDir, item));
      throw new Error(`Circular dependency found: ${cycle.join(' -> ')}`);
    }
    if (visited.has(file)) return;

    visiting.add(file);
    for (const dependency of graph.get(file)) {
      visit(dependency, stack.concat(file));
    }
    visiting.delete(file);
    visited.add(file);
  }

  for (const file of sourceFiles) {
    visit(file, []);
  }
}

function resolveRequiredFile(baseDir, request) {
  const candidate = path.resolve(baseDir, request);
  const candidates = [
    candidate,
    `${candidate}.js`,
    path.join(candidate, 'index.js')
  ];

  return candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile()) || null;
}

function run() {
  verifyPackageScripts();
  verifyFolderStructure();
  verifyImports();
  verifyNoCircularLocalDependencies();
  console.log('Backend verification passed');
}

run();
