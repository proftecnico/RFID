const axios = require('axios');

const API_URL = 'http://localhost:3000/api/readings';
const CONFIG_URL = 'http://localhost:3000/api/antennas';
const DUMMY_EPCS = [
  'E28011606000020917EE8E8D',
  '300833B2DDD9014000000000',
  'E200001735110190189052DE',
  '455043303030303100000000'
];

async function getAntennaConfig() {
  try {
    const res = await axios.get(CONFIG_URL);
    return res.data;
  } catch {
    return [
      { name: 'Antena 1', port: 'COM3' },
      { name: 'Antena 2', port: 'COM4' }
    ];
  }
}

async function init() {
  console.log('--- RFID Antenna Simulator ---');
  const antennas = await getAntennaConfig();
  console.log(`Will send fake reads to ${API_URL} every 5 seconds.`);
  console.log(`Using antennas:`, antennas.map(a => `${a.name}=${a.port}`).join(', '));

  const activePorts = antennas.filter(a => a.port).map(a => a.port);

  setInterval(async () => {
    const epc = DUMMY_EPCS[Math.floor(Math.random() * DUMMY_EPCS.length)];
    const antennaPort = activePorts[Math.floor(Math.random() * activePorts.length)];
    
    console.log(`[SIMULATE] Reading Tag ${epc} at Port ${antennaPort}`);
    
    try {
      await axios.post(API_URL, {
        epc,
        antennaPort
      });
      console.log(`   -> SENT OK`);
    } catch (err) {
      console.error(`   -> SEND FAILED:`, err.message);
    }
  }, 5000);
}

init();
