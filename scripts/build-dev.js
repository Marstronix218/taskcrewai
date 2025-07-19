#!/usr/bin/env node

// Workaround script for build:dev command
// This runs the Next.js build process

const { spawn } = require('child_process');

console.log('Running Next.js build...');

const build = spawn('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true
});

build.on('close', (code) => {
  process.exit(code);
});

build.on('error', (err) => {
  console.error('Build failed:', err);
  process.exit(1);
});