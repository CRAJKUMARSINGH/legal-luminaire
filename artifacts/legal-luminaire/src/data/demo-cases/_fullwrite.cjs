const fs = require('fs');
const target = 'E:/Rajkumar/legal-luminaire/artifacts/legal-luminaire/src/data/demo-cases/infra-arb-claim-data.ts';

const STHINDI_V = '\u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924';
const STHINDI_S = '\u0926\u094d\u0935\u093f\u0924\u0940\u092f\u0915';
const STHINDI_P = '\u0932\u0902\u092c\u093f\u0924';

const content = fs.readFileSync(target, 'utf8').replace('HINDI_V', STHINDI_V).replace('HINDI_S', STHINDI_S).replace('HINDI_P', STHINDI_P);
fs.writeFileSync(target, content, 'utf8');
console.log('Hindi labels replaced, size:', fs.statSync(target).size);