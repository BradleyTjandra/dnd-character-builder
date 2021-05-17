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

  loadFromJSON(jsonData) {

    this.name = jsonData.name;
    this.value = jsonData.value;
    this.calcType = jsonData.calcType;

  }

  calculate() {

    // if fixed we don't calculate this, this is set by the user
    if (this.calcType == "calculated") {
      this.value = this.inputs.reduce((sum, current) => parseFloat(sum)+parseFloat(current.value ?? 0), 0);
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

  removeDependent(effect) {
    this.listeners = this.listeners.filter(item => item.name != effect.name);
  }

  triggerListeners() {
    this.listeners.forEach((value) => value.update());
    this.linkedViews.forEach((value) => value.update());
  }

  addInput(effect) {

    // add to inputs (if not already)
    if (this.inputs.includes(effect)) return;
    this.inputs.push(effect);

    // update value
    this.calculate();

  }

  removeInput(effect) {
    let idx = this.inputs.indexOf(effect);
    if (idx == -1) return;
    this.inputs.splice(idx, 1);
    this.calculate();
  }

  getSaveInfo() {
    
    return ( {
      [this.name] : {
        "name" : this.name,
        "value" : this.value,
        "calcType" : this.calcType,
      }
    });

  }

}