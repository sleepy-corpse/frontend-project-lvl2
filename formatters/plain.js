import {
  getKey, hasNestedDiff, getDiffValues, getChildren,
} from '../src/diff-functions.js';

const formatValue = (value) => {
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
    const formattedDiff = subDiff.map((diffItem) => {
      const key = getKey(diffItem);
      if (hasNestedDiff(diffItem)) {
        return iter(getChildren(diffItem), `${previousKey}${key}.`);
      }
      const values = getDiffValues(diffItem);
      const keys = Object.keys(values);
      if (keys.includes('value1') && keys.includes('value2')) {
        const val1 = formatValue(values.value1);
        const val2 = formatValue(values.value2);
        return `Property '${previousKey}${key}' was updated. From ${val1} to ${val2}\n`;
      }
      if (!keys.includes('value1') && !keys.includes('value')) {
        const val2 = formatValue(values.value2);
        return `Property '${previousKey}${key}' was added with value: ${val2}\n`;
      }
      if (keys.includes('value1') && !keys.includes('value2')) {
        return `Property '${previousKey}${key}' was removed\n`;
      }
      return '';
    });
    return formattedDiff.join('');
  };
  return iter(diff, '');
};
