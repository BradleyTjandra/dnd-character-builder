"use strict";

import isEmptyObj from "./isEmptyObj.js";

export default function mergeObjs(objA, objB) {

  if (!objA || isEmptyObj(objA)) return objB;
  if (!objB || isEmptyObj(objB)) return objA;

  let mergedObj = Object.assign({}, objA);
  for (let key in objB) {

    if (typeof objB[key] !== "object") {
      if (!(key in objA)) mergedObj[key] = objB[key];
    } else {
      if (!(key in objA)) mergedObj[key] = Object.assign({},objB[key]);
      else mergedObj[key] = mergeObjs(objA[key], objB[key]);
    }
  }

  return(mergedObj);

}
