const fs = require('fs');
const path = require('path');
const target = 'E:/Rajkumar/legal-luminaire/artifacts/legal-luminaire/src/data/demo-cases/infra-arb-claim-data.ts';
// Content will be appended from multiple calls
console.log('size:', fs.statSync(target).size);