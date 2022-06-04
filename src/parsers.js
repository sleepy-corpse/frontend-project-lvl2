import yaml from 'js-yaml';

export default (str, format) => {
  switch (format) {
    case '.json':
      return JSON.parse(str);
    case '.yml':
    case '.yaml':
      return yaml.load(str);
    default:
      console.log('!!!format is not supported, empty object returned');
      return {};
  }
};
