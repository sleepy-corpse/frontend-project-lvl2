import _ from 'lodash';

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

const isUndefined = (value) => value === undefined;

const stylish = (diff) => {
  const iterat = (depth, subDiff) => {
    const formattedDiff = subDiff.map((diffItem) => {
      const name = diffItem[0];
      const spaces = ' '.repeat(depth * 4 - 2);
      const closingSpaces = ' '.repeat(depth * 4);
      if (Array.isArray(diffItem[1])) {
        return `${spaces}  ${name}: {\n${iterat(depth + 1, diffItem[1])}${closingSpaces}}\n`;
      }
      const val1 = diffItem[1].value1;
      const val2 = diffItem[1].value2;
      const str1 = !isUndefined(val1) ? `${spaces}- ${name}: ${stringify(val1, depth + 1)}` : '';
      const str2 = !isUndefined(val2) ? `${spaces}+ ${name}: ${stringify(val2, depth + 1)}` : '';
      if (val1 === val2) {
        return `${spaces}  ${name}: ${stringify(val1, depth + 1)}`;
      }
      return `${str1}${str2}`;
    });
    return formattedDiff.join('');
  };
  return `{\n${iterat(1, diff)}}`;
};

const formatter = (string) => {
  switch (string) {
    case 'stylish':
      return stylish;
    default:
      return () => 'wrong formatter name';
  }
};
export default formatter;
