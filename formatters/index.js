import plain from './plain.js';
import stylish from './stylish.js';
import json from './json.js';

const formatter = (diff, string) => {
  switch (string) {
    case 'stylish':
      return stylish(diff, string);
    case 'plain':
      return plain(diff, string);
    case 'json':
      return json(diff, string);
    default:
      return 'wrong formatter name';
  }
};
export default formatter;
