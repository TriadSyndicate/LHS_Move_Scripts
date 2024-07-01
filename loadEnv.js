import { promises as fs } from 'fs';

async function loadEnv() {
    const envPath = './.env';
    const envData = await fs.readFile(envPath, 'utf8');
  
    const env = {};
    envData.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      env[key.trim()] = value.trim();
    });
  
    return env;
}

export default loadEnv;
