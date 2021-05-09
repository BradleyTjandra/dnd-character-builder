"use strict";

class Attribute {
  
  constructor(name, calcType = "fixed") {
    this.name = name;
    this.value = 0;
    this.listeners = [];
    this.linkedViews = [];
    this.inputs = [];
    this.calcType = calcType; // fixed or calculated
  }

  calculate() {

    // if fixed we don't calculate this, this is set by the user
    if (this.calcType == "calculated") {
      this.value = this.inputs.reduce((sum, current) => sum+current.value, 0);
    } else if (this.calcType == "concat") {
      this.value = this.inputs.map(item => item.value);
    } else if (this.calcType == "boolean_or") {
      this.value = this.inputs.reduce((sum, current) => sum || current.value, false);
    }

    this.triggerListeners();
    return(this.value);

  }

  setValue(value) {
    this.value = value;
    this.triggerListeners();
  }

  // removeInputs() {
  //   this.inputs.forEach(value => value.removeDependent(this));
  //   this.inputs = [];
  // }

  removeDependent(attribute) {
    this.listeners = this.listeners.filter(item => item.name != attribute.name);
  }

  triggerListeners() {
    this.listeners.forEach((value) => value.calculate());
    this.linkedViews.forEach((value) => value.update());
    // alert(JSON.stringify(this.linkedViews.map(item => item.name)));
  }

  addInput(effect) {

    // add to inputs (if not already)
    if (this.inputs.includes(effect)) return;

    this.inputs.push(effect);

    // tell all 'upstream' attributes that this attribute is listening to its value
    effect.inputs.forEach((attr) => attr.listeners.push(this));

    // update value
    this.calculate();

  }

  removeInput(effect) {
    let idx = this.inputs.indexOf(effect);
    if (idx == -1) return;
    this.inputs.splice(idx, 1);
    this.calculate();
  }

}