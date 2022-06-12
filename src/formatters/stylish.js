import _ from 'lodash';
import {
  getNodeKey, getNodeChildren, getNodeType, getNodeValues,
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
    const spaces = ' '.repeat(depth * 4 - 2);
    const closingSpaces = ' '.repeat(depth * 4);
    const formattedDiff = subDiff.map((node) => {
      const nodeType = getNodeType(node);
      const nodeKey = getNodeKey(node);
      const nodeValues = getNodeValues(node);
      switch (nodeType) {
        case 'nested': {
          const children = getNodeChildren(node);
          return `${spaces}  ${nodeKey}: {\n${iterat(depth + 1, children)}${closingSpaces}}\n`;
        }
        case 'changed': {
          const line1 = `${spaces}- ${nodeKey}: ${stringify(nodeValues[0], depth + 1)}`;
          const line2 = `${spaces}+ ${nodeKey}: ${stringify(nodeValues[1], depth + 1)}`;
          return `${line1}${line2}`;
        }
        case 'unchanged':
          return `${spaces}  ${nodeKey}: ${stringify(nodeValues[0], depth + 1)}`;
        case 'deleted':
          return `${spaces}- ${nodeKey}: ${stringify(nodeValues[0], depth + 1)}`;
        case 'added':
          return `${spaces}+ ${nodeKey}: ${stringify(nodeValues[0], depth + 1)}`;
        default:
          return '';
      }
    });
    return formattedDiff.join('');
  };
  return `{\n${iterat(1, diff)}}`;
};

export default stylish;
