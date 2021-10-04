"use strict";

import Attribute from "./Attribute.js";
import { AttributeTypes } from "./Attributes.js";
import mergeObjs from "../helpers/mergeObjs.js";

export default class FeaturesAttribute extends Attribute {

  constructor(name) {
    super(name, AttributeTypes.FEATURES);
    this.reset();
  }

  calculate() {
    this.reset();
    this.inputs.sort(orderInputs).forEach(this.processInput.bind(this));
    this.triggerListeners();
  }

  processInput(input) {

    let inputValue = input.value;
    if (!inputValue) return;
  
    if (inputValue.featureSource == "self") {
  
      let rowId = input.name;
      this.value["name"][rowId] = inputValue.name;
      this.value["description"][rowId] = inputValue.description;
      this.value["rowId"].add(rowId);
  
    } else {
  
      let rowId = inputValue.featureSource;
      let counter = inputValue.counter;
      if (!this.value["counterTotal"].hasOwnProperty(rowId)) {
        this.value["counterTotal"][rowId] = {};
        this.value["counterCurrent"][rowId] = {};
        this.value["counterName"][rowId] = {};
      }
      this.value["counterTotal"][rowId][counter] = input.formula.calculate();

      let oldCurr = this.oldCounterCurrent?.[rowId]?.[counter];
      this.value["counterCurrent"][rowId][counter] = oldCurr ?? 0;

      this.value["counterName"][rowId][counter] = inputValue.counterName;
  
    } 
  }

  setValue(value) {
    if ("rowId" in value) {
      value.rowId = new Set(Object.keys(value.rowId));
    }
    this.oldCounterCurrent = (value?.counterCurrent) ?? {};
    super.setValue(value);
  }

  reset() {

    this.oldCounterCurrent = mergeObjs(
      this.value?.counterCurrent,
      this.oldCounterCurrent,
    );
    this.value = {
      "rowId" : new Set(),
      "name" : {},
      "description" : {},
      "counterTotal" : {},
      "counterCurrent" : {},
      "counterName" : {},
    }
  }
}

function orderInputs(a, b) {

  // we only care about ordering the counters in the correct order;
  let aSource = a.info?.featureSource;
  if (!aSource) return 0;
  if (a.info.featureSource == "self") return 0;
  
  let bSource = b.info?.featureSource;
  if (!bSource) return 0;
  if (b.info.featureSource == "self") return 0;
  
  let aCounterId = a.info.counter.match(/^counter(\d+)(:.*)?$/i)?.[1];
  let bCounterId = b.info.counter.match(/^counter(\d+)(:.*)?$/i)?.[1];

  return(parseInt(aCounterId) - parseInt(bCounterId));
}
