import _ from 'lodash';

const getNodeType = (diffItem) => diffItem.type;

const getNodeValues = (diffItem) => {
  if (_.has(diffItem, 'val2')) {
    return [diffItem.val1, diffItem.val2];
  }
  return [diffItem.val];
};

const getNodeKey = (diffItem) => diffItem.key;

const getNodeChildren = (diffItem) => diffItem.children;

export {
  getNodeValues, getNodeKey, getNodeChildren, getNodeType,
};
