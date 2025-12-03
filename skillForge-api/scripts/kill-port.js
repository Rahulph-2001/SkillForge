const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const PORT = process.env.PORT || 3000;

async function killPort() {
  try {
    console.log(`🔍 Checking for processes on port ${PORT}...`);
    
    // Find process using the port
    const { stdout } = await execPromise(`netstat -ano | findstr :${PORT}`);
    
    if (!stdout) {
      console.log(`✅ Port ${PORT} is free`);
      return;
    }

    // Extract PIDs from netstat output
    const lines = stdout.split('\n').filter(line => line.includes('LISTENING'));
    const pids = new Set();
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid)) {
        pids.add(pid);
      }
    });

    if (pids.size === 0) {
      console.log(`✅ Port ${PORT} is free`);
      return;
    }

    // Kill each process
    for (const pid of pids) {
      try {
        await execPromise(`taskkill /PID ${pid} /F`);
        console.log(`✅ Killed process ${pid} on port ${PORT}`);
      } catch (error) {
        console.log(`⚠️  Could not kill process ${pid} (may already be stopped)`);
      }
    }

    // Wait a moment for port to be released
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`✅ Port ${PORT} is now free`);
    
  } catch (error) {
    // If netstat returns nothing, port is free
    if (error.code === 1) {
      console.log(`✅ Port ${PORT} is free`);
      return;
    }
    console.error('❌ Error checking port:', error.message);
  }
}

killPort();
