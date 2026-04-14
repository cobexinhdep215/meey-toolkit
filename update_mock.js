const fs = require('fs');

let mockTs = fs.readFileSync('src/data/mock.ts', 'utf8');

// 1. Update interface RealEstate
mockTs = mockTs.replace(
  /export interface RealEstate \{[\s\S]*?\n\}/,
  \`export interface RealEstate {
  id: string;
  name: string;
  address: string;
  price: number;
  installments: Installment[];
  area: number;
  investor: string;
}\`
);

const investors = ['Vingroup', 'Masterise Homes', 'Ecopark Group', 'Khang Điền', 'Novaland', 'Nam Long', 'Sun Group', 'BIM Group'];
const areas = [55, 68, 75, 82, 90, 105, 120, 150];

// 2. We use regex to inject area and investor to each element in mockRealEstates
let count = 0;
mockTs = mockTs.replace(/installments: generateInstallments\([^)]+\) \}/g, (match) => {
  const investor = investors[count % investors.length];
  const area = areas[count % areas.length];
  count++;
  return match.replace(' }', \`, area: \${area}, investor: "\${investor}" }\`);
});

fs.writeFileSync('src/data/mock.ts', mockTs);
