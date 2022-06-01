import * as fs from 'node:fs';
import { resolve } from 'node:path';
import _ from 'lodash';

const makeAbsolutePath = (path) => resolve(process.cwd(), path);

const genDiff = (path1, path2) => {
  const absPath1 = fs.existsSync(path1) ? path1 : makeAbsolutePath(path1);
  const absPath2 = fs.existsSync(path2) ? path2 : makeAbsolutePath(path2);
  const file1 = fs.openSync(absPath1);
  const file2 = fs.openSync(absPath2);
  const fileObj1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
  const fileObj2 = JSON.parse(fs.readFileSync(file2, 'utf8'));
  fs.closeSync(file1);
  fs.closeSync(file2);
  const keys = [...Object.keys(fileObj1), ...Object.keys(fileObj2)];
  const sortedKeys = _.sortBy(keys);
  const result = sortedKeys.reduce((acc, key, index) => {
    if (sortedKeys[index] === sortedKeys[index - 1]) {
      return acc;
    }
    if (key !== sortedKeys[index + 1]) {
      const fileSign = Object.hasOwn(fileObj1, key) ? '-' : '+';
      const value = fileSign === '-' ? fileObj1[key] : fileObj2[key];
      return [...acc, `  ${fileSign} ${key}: ${value}\n`];
    }
    const value1 = fileObj1[key];
    const value2 = fileObj2[key];
    if (value1 === value2) {
      return [...acc, `    ${key}: ${value1}\n`];
    }
    return [...acc, `  - ${key}: ${value1}\n  + ${key}: ${value2}\n`];
  }, []);
  return `{\n${result.join('')}}`;
};

export default genDiff;
