const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

const API_URL = 'http://localhost:3000/api/readings';
const CONFIG_URL = 'http://localhost:3000/api/antennas';
const BAUD_RATE = 57600;

console.log('--- RFID serial-to-web Bridge ---');

async function getAntennaConfig() {
  try {
    const res = await axios.get(CONFIG_URL);
    return res.data;
  } catch (err) {
    console.log('[WARN] Could not fetch antenna config, using defaults');
    return [
      { name: 'Antena 1', port: 'COM3', isActive: true },
      { name: 'Antena 2', port: 'COM4', isActive: true }
    ];
  }
}

async function sendReading(epc, antennaPort) {
  try {
    await axios.post(API_URL, {
      epc,
      antennaPort
    });
    console.log(`[OK] Sent ${epc} from Port ${antennaPort}`);
  } catch (error) {
    console.error(`[ERR] Failed to send ${epc} from Port ${antennaPort}:`, error.message);
  }
}

function setupAntenna(portName, antennaName) {
  const port = new SerialPort({
    path: portName,
    baudRate: BAUD_RATE,
    autoOpen: false,
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  port.open((err) => {
    if (err) {
      console.error(`[WARN] Could not open port ${portName}:`, err.message, '- ensure the antenna is connected');
      return;
    }
    console.log(`[INFO] Connected to ${antennaName} on ${portName}`);
  });

  parser.on('data', (data) => {
    const rawData = data.toString().trim();
    if (!rawData) return;
    const epc = rawData.replace(/[^a-zA-Z0-9]/g, '');
    console.log(`[READ] ${antennaName} -> EPC: ${epc}`);
    sendReading(epc, portName);
  });
  
  port.on('error', (err) => {
    console.error(`[ERR] Port ${portName} Error:`, err.message);
  });
}

async function init() {
  const args = process.argv.slice(2);
  let antennas = [];

  if (args.length > 0) {
    console.log('[INFO] Using COM ports from command line arguments...');
    if (args[0] && args[0].trim() !== '') antennas.push({ name: 'Antena 1', port: args[0].toUpperCase(), isActive: true });
    if (args[1] && args[1].trim() !== '') antennas.push({ name: 'Antena 2', port: args[1].toUpperCase(), isActive: true });
  } else {
    console.log('[INFO] Loading antenna configuration from API...');
    antennas = await getAntennaConfig();
  }
  
  if (antennas.length === 0) {
    console.log('[WARN] No valid antennas configured.');
    return;
  }

  for (const ant of antennas) {
    if (ant.isActive && ant.port) {
      setupAntenna(ant.port, ant.name);
    }
  }
}

init();
