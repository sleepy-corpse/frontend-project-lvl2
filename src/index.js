import * as fs from 'node:fs';
import { resolve, extname } from 'node:path';
import _ from 'lodash';
import parse from './parsers.js';

const makeAbsolutePath = (path) => resolve(process.cwd(), path);

const makeObj = (filePath) => {
  const absPath = makeAbsolutePath(filePath);
  const fileContent = fs.readFileSync(absPath, 'utf-8');
  const format = extname(absPath);
  return parse(fileContent, format);
};

const genDiff = (path1, path2) => {
  const [fileObj1, fileObj2] = [makeObj(path1), makeObj(path2)];
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
