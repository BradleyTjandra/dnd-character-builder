"use strict";

export default function (obj) {
  for (let k in obj) return false;
  return true;
}