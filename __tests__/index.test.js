import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import genDiff from '../src/index.js';

const makePath = (filename) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, '..', '__fixtures__', filename);
};

test('main flow(+ nested objects)', () => {
  const path1 = makePath('data1.json');
  const path2 = makePath('data2.json');
  const expectedOut1 = fs.readFileSync(makePath('expected-output1.txt'), 'utf-8');
  expect(genDiff(path1, path2, 'stylish')).toEqual(expectedOut1);
});

test('empty files', () => {
  const path1 = makePath('data1.json');
  const empty = makePath('empty.json');
  expect(genDiff(empty, empty, 'stylish')).toEqual('{\n}');
  const expectedOut2 = fs.readFileSync(makePath('expected-output2.txt'), 'utf-8');
  expect(genDiff(path1, empty, 'stylish')).toEqual(expectedOut2);
});

test('yaml support', () => {
  const path3 = makePath('data3.yml');
  const path4 = makePath('data4.yaml');
  const expectedOut3 = fs.readFileSync(makePath('expected-output3.txt'), 'utf-8');
  expect(genDiff(path3, path4, 'stylish')).toEqual(expectedOut3);
});

test('plain fromat', () => {
  const path1 = makePath('data1.json');
  const path2 = makePath('data2.json');
  const expectedOut4 = fs.readFileSync(makePath('expected-output4.txt'), 'utf-8');
  expect(genDiff(path1, path2, 'plain')).toEqual(expectedOut4);
});

test('json fromat', () => {
  const path1 = makePath('data1.json');
  const path2 = makePath('data2.json');
  const expectedOut5 = fs.readFileSync(makePath('expected-output5.txt'), 'utf-8');
  expect(genDiff(path1, path2, 'json')).toEqual(expectedOut5);
});
