import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

const formatter = (diff, format) => {
  switch (format) {
    case 'stylish':
      return stylish(diff);
    case 'plain':
      return plain(diff);
    case 'json':
      return json(diff);
    default:
      throw new Error('Wrong formatter name');
  }
};
export default formatter;
