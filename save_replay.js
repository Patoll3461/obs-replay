import { OBSWebSocket } from 'obs-websocket-js';
import { exec } from 'child_process';
import { Console } from 'console';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const obs = new OBSWebSocket();

// Create __dirname equivalent
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


async function getLatestClip() {
  const files = fs.readdirSync(outputDirectory);
  console.log("Files in directory:", files); // Log the files in the output directory for diagnosis
  
  // Filter files based on the naming scheme "Replay YYYY-MM-DD HH-MM-SS.mkv"
  const clips = files.filter(file => /^Replay \d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2}\.mkv$/.test(file));

  if (clips.length === 0) return null;

  // Get the most recent clip
  const latestClip = clips.reduce((prev, curr) => {
    return fs.statSync(path.join(outputDirectory, curr)).mtime > fs.statSync(path.join(outputDirectory, prev)).mtime ? curr : prev;
  });

  console.log(latestClip);

  return latestClip;
}

async function saveReplayBuffer() {
  try {
    // Connect to OBS WebSocket server
    await obs.connect(`ws://localhost:${port}`, password);  // Make sure the correct port is set

    // Send the request to save the replay buffer
    const response = await obs.call('SaveReplayBuffer');

    console.log('Replay buffer saved:', response);

    await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust time if necessary

    // Get the latest clip
    const clipName = await getLatestClip();

    if (!clipName) {
      throw new Error('No clips found in the output directory.');
    }

    const fullClipPath = path.join(outputDirectory, clipName);

    console.log(fullClipPath);

    // Send success notification
    exec(`sh "${userDirectory}"/notify_succes.sh "${fullClipPath}"`, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error sending notification: ${error.message}`);
          return;
      }
      console.log('Notification sent: Successfully saved Clip');
    });

  } catch (error) {
    console.error('Error saving replay buffer:', error);

    console.log(error.message)

    // Send failure notification with sanitized error message
    console.log("error: ", error);
    exec(`sh "${userDirectory}"/notify_failed.sh "${error.name}"`, (execError, stdout, stderr) => {
      if (execError) {
          console.error(`Error sending notification: ${execError.message}`);
          return;
      }
      console.log('Notification sent: Failed to save Clip');
    });
  } finally {
    // Close the connection
    obs.disconnect();
  }
}

// Run the function
saveReplayBuffer();
