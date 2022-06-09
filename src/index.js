import * as fs from 'fs';
import { resolve, extname } from 'path';
import parse from './parsers.js';
import formatter from './formatters/index.js';
import createTree from './createTree.js';

const makeAbsolutePath = (path) => resolve(process.cwd(), path);

const makeObj = (filePath) => {
  const absPath = makeAbsolutePath(filePath);
  const fileContent = fs.readFileSync(absPath, 'utf-8');
  const format = extname(absPath);
  return parse(fileContent, format);
};

const genDiff = (path1, path2, format = 'stylish') => {
  const [fileObj1, fileObj2] = [makeObj(path1), makeObj(path2)];
  const tree = createTree(fileObj1, fileObj2);
  return formatter(tree, format);
};

export default genDiff;
