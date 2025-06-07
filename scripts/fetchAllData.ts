const fs = require('fs');
const path = require('path');
const nodeFetch = require('node-fetch');

const BASE_URL = 'https://raw.githubusercontent.com/deliton/eldenring-api/main/api/public/data';
const DATA_TYPES = [
  'weapons', 'shields', 'sorceries', 'spirits', 
  'talismans', 'incantations', 'items', 'ashes'
];

async function fetchAndSaveData() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    for (const type of DATA_TYPES) {
      console.log(`Fetching ${type}...`);
      const response = await nodeFetch(`${BASE_URL}/${type}.json`);
      const data = await response.json();
      
      fs.writeFileSync(
        path.join(dataDir, `${type}.json`),
        JSON.stringify(data, null, 2)
      );
      console.log(`Saved ${type}.json`);
    }

    console.log('All data fetched and saved successfully!');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchAndSaveData(); 