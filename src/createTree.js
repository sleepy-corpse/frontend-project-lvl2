import _ from 'lodash';

const isObj = (arg) => _.isObject(arg) && !Array.isArray(arg);

const makePlain = (key, value1, value2) => {
  if (_.isUndefined(value1)) {
    return { type: 'added', key, val: value2 };
  }
  if (_.isUndefined(value2)) {
    return { type: 'deleted', key, val: value1 };
  }
  if (value1 === value2) {
    return { type: 'unchanged', key, val: value1 };
  }
  return {
    type: 'changed',
    key,
    val1: value1,
    val2: value2,
  };
};

const createTree = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));
  const sortedKeys = _.sortBy(keys);
  const diff = sortedKeys.reduce((acc, key) => {
    if (isObj(obj1[key]) && isObj(obj2[key])) {
      const subDiff = createTree(obj1[key], obj2[key]);
      return [...acc, { type: 'nested', key, children: subDiff }];
    }
    return [...acc, makePlain(key, obj1[key], obj2[key])];
  }, []);
  return diff;
};

export default createTree;
