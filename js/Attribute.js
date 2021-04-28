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
    
      this.value = 0;

      for (let effect of this.inputs) {
        this.value += effect.value;
      }
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
  }

  addInput(effect) {

    this.inputs.push(effect);
    try {
      effect.inputs.forEach((value) => value.listeners.push(this));
    } catch (e) {
      // alert(this.name);
      // alert(effect.inputs.length);
      // alert(Array.from(effect.inputs));
      // alert(Array.from(effect.inputs)[0]);
      throw e;
    }

    this.calculate();

  }

}