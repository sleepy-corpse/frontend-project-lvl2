import * as fs from 'node:fs';
import { resolve, extname } from 'node:path';
import _ from 'lodash';
import parse from './parsers.js';
import formatter from '../formatters/index.js';

const makeAbsolutePath = (path) => resolve(process.cwd(), path);

const makeObj = (filePath) => {
  const absPath = makeAbsolutePath(filePath);
  const fileContent = fs.readFileSync(absPath, 'utf-8');
  const format = extname(absPath);
  return parse(fileContent, format);
};

const isObj = (arg) => _.isObject(arg) && !Array.isArray(arg);

const makePlain = (name, value1, value2) => {
  if (_.isUndefined(value1)) {
    return [name, { value2 }];
  }
  if (_.isUndefined(value2)) {
    return [name, { value1 }];
  }
  if (value1 === value2) {
    return [name, { value: value1 }];
  }
  return [name, { value1, value2 }];
};

const genDiff = (path1, path2, format = 'stylish') => {
  const [fileObj1, fileObj2] = [makeObj(path1), makeObj(path2)];
  const iter = (obj1, obj2) => {
    const keys = [...Object.keys(obj1), ...Object.keys(obj2)];
    const sortedKeys = _.uniq(_.sortBy(keys));
    const diff = sortedKeys.reduce((acc, key) => {
      if (isObj(obj1[key]) && isObj(obj2[key])) {
        const subDiff = iter(obj1[key], obj2[key]);
        return [...acc, [key, [...subDiff]]];
      }
      return [...acc, makePlain(key, obj1[key], obj2[key])];
    }, []);
    return diff;
  };
  const formattingFunction = formatter(format);
  return formattingFunction(iter(fileObj1, fileObj2));
};

export default genDiff;
