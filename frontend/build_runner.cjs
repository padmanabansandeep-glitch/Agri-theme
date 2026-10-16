const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Node version:', process.version);
try {
  const viteBin = path.resolve(__dirname, 'node_modules/vite/bin/vite.js');
  console.log('Running vite build at:', viteBin);
  const out = execSync(`"${process.execPath}" "${viteBin}" build`, {
    cwd: __dirname,
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' }
  });
  console.log('Build output:');
  console.log(out.toString());
} catch (e) {
  console.error('Build error:');
  if (e.stdout) console.log('Stdout:', e.stdout.toString());
  if (e.stderr) console.error('Stderr:', e.stderr.toString());
  console.error(e.message);
  process.exit(1);
}
