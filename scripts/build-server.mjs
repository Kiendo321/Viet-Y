import { build } from 'esbuild';

// Keep the server at the project root so public/ and dist/ retain their paths.
// Bundle local TypeScript modules; runtime npm dependencies stay external.
await build({
  entryPoints: ['server.ts'],
  outfile: 'server.js',
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  packages: 'external',
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'info',
});
