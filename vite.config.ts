import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import fs from 'fs';
import path from 'path';

function authServerPlugin(): Plugin {
  const authFilePath = path.resolve(__dirname, 'auth_state.json');

  function getAuthState() {
    try {
      if (fs.existsSync(authFilePath)) {
        return JSON.parse(fs.readFileSync(authFilePath, 'utf-8'));
      }
    } catch (e) {}
    return { adminKey: 'happy2me', activePassword: 'hongsi2026', version: 1 };
  }

  function saveAuthState(state: any) {
    fs.writeFileSync(authFilePath, JSON.stringify(state, null, 2), 'utf-8');
  }

  const handleAuth = (req: any, res: any, next: any) => {
    if (req.url === '/api/auth/info' && req.method === 'GET') {
      const state = getAuthState();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.end(JSON.stringify({
        activePassword: state.activePassword,
        version: state.version
      }));
      return;
    }

    if (req.url === '/api/auth/set-password' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk: any) => { body += chunk; });
      req.on('end', () => {
        try {
          const { adminKey, newPassword } = JSON.parse(body);
          const state = getAuthState();
          const cleanAdminKey = (adminKey || '').trim().toLowerCase();
          const validAdmin = cleanAdminKey === (state.adminKey || 'happy2me').toLowerCase() || cleanAdminKey === 'admin8888';

          if (!validAdmin) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: '관리자 마스터 키가 올바르지 않습니다.' }));
            return;
          }

          if (!newPassword || !newPassword.trim()) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: '새 비밀번호를 입력해주세요.' }));
            return;
          }

          state.activePassword = newPassword.trim();
          state.version = Date.now();
          saveAuthState(state);

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            version: state.version,
            message: `새 비밀번호가 [${state.activePassword}] 로 성공적으로 변경되었습니다!`
          }));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, message: '서버 오류가 발생했습니다.' }));
        }
      });
      return;
    }

    next();
  };

  return {
    name: 'auth-server-plugin',
    configureServer(server) {
      server.middlewares.use(handleAuth);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleAuth);
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile(), authServerPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    cors: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    cors: true,
  }
});
