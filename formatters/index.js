import plain from './plain.js';
import stylish from './stylish.js';

const formatter = (string) => {
  switch (string) {
    case 'stylish':
      return stylish;
    case 'plain':
      return plain;
    default:
      return () => 'wrong formatter name';
  }
};
export default formatter;
