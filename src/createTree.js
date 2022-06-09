import _ from 'lodash';

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

const createTree = (obj1, obj2) => {
  const keys = [...Object.keys(obj1), ...Object.keys(obj2)];
  const sortedKeys = _.uniq(_.sortBy(keys));
  const diff = sortedKeys.reduce((acc, key) => {
    if (isObj(obj1[key]) && isObj(obj2[key])) {
      const subDiff = createTree(obj1[key], obj2[key]);
      return [...acc, [key, [...subDiff]]];
    }
    return [...acc, makePlain(key, obj1[key], obj2[key])];
  }, []);
  return diff;
};

export default createTree;
