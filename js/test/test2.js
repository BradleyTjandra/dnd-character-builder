"use strict";

export default function externalFunc() {
  return(internalFunc.apply(this));
}

function internalFunc() {
  return(this.name);
}