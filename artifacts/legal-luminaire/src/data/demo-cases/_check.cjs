const fs = require('fs');
const target = 'E:/Rajkumar/legal-luminaire/artifacts/legal-luminaire/src/data/demo-cases/infra-arb-claim-data.ts';
console.log('current size:', fs.statSync(target).size);