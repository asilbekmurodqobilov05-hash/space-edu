import { learningData } from './src/data/learningData.js';
import fs from 'fs';

fs.writeFileSync('learningData.json', JSON.stringify(learningData, null, 2));
