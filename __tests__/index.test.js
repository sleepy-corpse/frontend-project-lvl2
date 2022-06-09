import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import genDiff from '../src/index.js';

const makePath = (filename) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, '..', '__fixtures__', filename);
};

const fileExtensions = ['json', 'yml'];
const formats = ['stylish', 'plain', 'json'];

describe.each(fileExtensions)('Comparing %s files', (extension) => {
  test.each(formats)('%s formatting', (format) => {
    const path1 = makePath(`data1.${extension}`);
    const path2 = makePath(`data2.${extension}`);
    const expectedOut = fs.readFileSync(makePath(`expected-${extension}-${format}.txt`), 'utf-8');
    expect(genDiff(path1, path2, format)).toEqual(expectedOut);
  });
});
