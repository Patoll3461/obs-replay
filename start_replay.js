import { OBSWebSocket } from 'obs-websocket-js';
import fs from 'fs';
import path from 'path';

const obs = new OBSWebSocket();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the path to the settings.conf file relative to the current directory
const configPath = path.join(__dirname, 'settings.conf');

// Read the configuration file synchronously
const configContent = fs.readFileSync(configPath, 'utf-8');

// Split each line and remove empty lines or comments
const lines = configContent.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));

// Parse the lines into key-value pairs
const config = {};
lines.forEach(line => {
  const [key, value] = line.split('=');
  config[key.trim()] = value.trim();
});

// Accessing the values
console.log('Output Directory:', config['output_directory']);
console.log('User Directory:', config['user']);
console.log('OBS WebSocket Password:', config['password']);
console.log('OBS WebSocket Port:', config['port']);

// Example usage
const outputDirectory = config['output_directory'];
const userDirectory = config['user'];
const password = config['password'];
const port = config['port'];

async function startReplayBuffer() {
  try {
    // Connect to OBS WebSocket server
    await obs.connect(`ws://localhost:${port}`, password);  // Make sure the correct port and password  set

    await obs.call('StartReplayBuffer');
    console.log('Replay buffer started.');

  } catch (error) {
    console.error('Error starting replay buffer:', error);
  } finally {
    // Close the connection
    obs.disconnect();
  }
}

// Run the function
startReplayBuffer();