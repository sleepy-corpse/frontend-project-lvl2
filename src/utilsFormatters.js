import _ from 'lodash';

const hasNestedDiff = (diffItem) => Array.isArray(diffItem[1]);

const getDiffValues = (diffItem) => _.get(diffItem, ['1']);

const getKey = (diffItem) => diffItem[0];

const getChildren = (diffItem) => diffItem[1];

export {
  hasNestedDiff, getDiffValues, getKey, getChildren,
};
