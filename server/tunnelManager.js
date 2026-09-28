import { spawn } from 'child_process';

/**
 * Persistent Tunnel Supervisor
 * Keeps an active public tunnel running continuously with auto-restart.
 */
function startTunnel() {
  console.log('🔄 Launching persistent public tunnel...');
  
  const child = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=15',
    '-o', 'ServerAliveCountMax=3',
    '-R', '80:127.0.0.1:5173',
    'serveo.net'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  child.stdout.on('data', (data) => {
    const text = data.toString();
    console.log('[Tunnel Output]:', text.trim());
  });

  child.stderr.on('data', (data) => {
    const text = data.toString();
    if (text.includes('Forwarding') || text.includes('https://')) {
      console.log('[Tunnel URL]:', text.trim());
    }
  });

  child.on('close', (code) => {
    console.warn(`⚠️ Tunnel disconnected with code ${code}. Auto-reconnecting in 3s...`);
    setTimeout(startTunnel, 3000);
  });
}

startTunnel();
