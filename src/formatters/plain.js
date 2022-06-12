import {
  getNodeKey, getNodeChildren, getNodeType, getNodeValues,
} from '../utilsFormatters.js';

const format = (value) => {
  switch (typeof value) {
    case 'string':
      return `'${value}'`;
    case 'object':
      if (value === null) return 'null';
      return '[complex value]';
    default:
      return value;
  }
};

export default (diff) => {
  const iter = (subDiff, previousKey) => {
    const formattedDiff = subDiff.map((node) => {
      const nodeType = getNodeType(node);
      const nodeKey = getNodeKey(node);
      const nodeValues = getNodeValues(node);
      switch (nodeType) {
        case 'nested': {
          const children = getNodeChildren(node);
          return iter(children, `${previousKey}${nodeKey}.`);
        }
        case 'changed': {
          return `Property '${previousKey}${nodeKey}' was updated. From ${format(nodeValues[0])} to ${format(nodeValues[1])}`;
        }
        case 'deleted':
          return `Property '${previousKey}${nodeKey}' was removed`;
        case 'added':
          return `Property '${previousKey}${nodeKey}' was added with value: ${format(nodeValues[0])}`;
        default:
          return '';
      }
    });
    const filteredDiff = formattedDiff.filter((str) => str.length > 0);
    return filteredDiff.join('\n');
  };
  return iter(diff, '');
};
