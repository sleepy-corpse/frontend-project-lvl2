import _ from 'lodash';
import {
  hasNestedDiff, getDiffValues, getKey, getChildren,
} from '../utilsFormatters.js';

const stringify = (data, outerDepth) => {
  const iter = (depth, dataIter) => {
    if (!_.isObject(dataIter)) {
      return `${dataIter}\n`;
    }
    const pairs = Object.entries(dataIter);
    const space = ' ';
    const replacer = space.repeat(depth * 4);
    const replacerForClosingBracket = space.repeat((depth - 1) * 4);
    const arrayOfLines = pairs.map(([key, value]) => {
      const strValue = iter(depth + 1, value);
      const str = `${replacer}${key}: ${strValue}`;
      return str;
    });
    return `{\n${arrayOfLines.join('')}${replacerForClosingBracket}}\n`;
  };
  return iter(outerDepth, data);
};

const stylish = (diff) => {
  const iterat = (depth, subDiff) => {
    const formattedDiff = subDiff.map((diffItem) => {
      const name = getKey(diffItem);
      const spaces = ' '.repeat(depth * 4 - 2);
      const closingSpaces = ' '.repeat(depth * 4);
      if (hasNestedDiff(diffItem)) {
        return `${spaces}  ${name}: {\n${iterat(depth + 1, getChildren(diffItem))}${closingSpaces}}\n`;
      }
      const values = getDiffValues(diffItem);
      return Object.keys(values).reduce((acc, key) => {
        switch (key) {
          case 'value1':
            return `${acc}${spaces}- ${name}: ${stringify(values[key], depth + 1)}`;
          case 'value2':
            return `${acc}${spaces}+ ${name}: ${stringify(values[key], depth + 1)}`;
          case 'value':
            return `${spaces}  ${name}: ${stringify(values[key], depth + 1)}`;
          default:
            return acc;
        }
      }, '');
    });
    return formattedDiff.join('');
  };
  return `{\n${iterat(1, diff)}}`;
};

export default stylish;
