const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const BASE_URL = 'https://raw.githubusercontent.com/deliton/eldenring-api/main/api/public/data/';

async function fetchData(endpoint: string) {
  const response = await fetch(`${BASE_URL}${endpoint}.json`);
  return response.json();
}

async function main() {
  const endpoints = [
    'weapons',
    'shields',
    'sorceries',
    'spirits',
    'talismans',
    'incantations',
    'items',
    'ashes',
    'armors'
  ];

  for (const endpoint of endpoints) {
    console.log(`Fetching ${endpoint}...`);
    const data = await fetchData(endpoint);
    fs.writeFileSync(
      path.join(__dirname, '..', 'data', `${endpoint}.json`),
      JSON.stringify(data, null, 2)
    );
    console.log(`Saved ${endpoint}.json`);
  }
}

main().catch(console.error); 