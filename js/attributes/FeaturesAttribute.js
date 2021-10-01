"use strict";

import Attribute from "./Attribute";

export default class FeaturesAttribute extends Attribute {

  constructor(name, calcType = "fixed") {

    super(name, calcType);

    this.value = {
      "rowId" : {},
      "name" : {},
      "description" : {},
      "counterTotal" : {},
      "counterCurrent" : {},
    }
    
  }

  calculate() {

    for (let input in this.inputs) {
      processInput(this.value, this.inputs);
    }
    
  }

}

function processInput(info, input) {

  let value = input.effectInfo;
  if (!value) return;

  if (value.featureSource == "self") {

    let rowId = input.name;
    info["name"][rowId] = value.name;
    info["description"][rowId] = value.description;
    info["rowId"].push(rowId);

  } else {

    let rowId = value.featureSource;
    let counterId = value.counterId;
    if (!info["counterTotal"].hasOwnProperty(rowId)) {
      info["counterTotal"][rowId] = {};
      info["counterCurrent"][rowId] = {};
    }
    info["counterTotal"][rowId][counterId] = value.formula.calculate();
    info["counterCurrent"][rowId][counterId] = 0;

  }

  this.triggerListeners();
  return(this.value);

}


// setCalcType(calcType) {
//   if (this.calcType == "resource") this.value = { total: 0, current: 0};
//   else this.value = 0;
// }

// setValue(value) {
//   this.value = value;
//   this.triggerListeners();
// }

// removeDependent(effect) {
//   this.listeners = this.listeners.filter(item => item.name != effect.name);
// }

// triggerListeners() {
//   this.listeners.forEach((value) => value.update());
//   this.linkedViews.forEach((value) => value.update());
// }

// addInput(effect) {

//   // add to inputs (if not already)
//   if (this.inputs.includes(effect)) return;
//   this.inputs.push(effect);

//   // update value
//   this.calculate();

// }

// removeInput(effect) {
//   let idx = this.inputs.indexOf(effect);
//   if (idx == -1) return;
//   this.inputs.splice(idx, 1);
//   this.calculate();
// }

// getSaveInfo() {
  
//   return ( {
//     [this.name] : {
//       "name" : this.name,
//       "value" : this.value,
//       "calcType" : this.calcType,
//     }
//   });