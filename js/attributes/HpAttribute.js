"use strict";

import Attribute from "./Attribute.js";
import sumOver from "../helpers/sumOver.js";
import { AttributeTypes } from "./Attributes.js";

export default class HpAttribute extends Attribute {

  constructor(name) {
    super(name, AttributeTypes.RESOURCE);
    this.value = {"current" : 0, "total": 0};
  }

  calculate() {
    let filtered = this.inputs.filter(x => x.isSetup);
    let calculated = filtered.map(input => input.formula.calculate());
    this.value.total = calculated.reduce(sumOver, 0);
    this.triggerListeners();
  }
  
}
