import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const certPath = path.resolve(__dirname, 'ssl/localhost.pem');
const keyPath = path.resolve(__dirname, 'ssl/localhost-key.pem');

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },
    port: 5173, 
  },
});
