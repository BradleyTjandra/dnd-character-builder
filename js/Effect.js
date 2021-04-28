"use strict";

class Effect {
  
  constructor(attribute, effectInfo, attributeList, source, effectType = "fixed") {
    // this.name = name;
    this.attribute = attribute;
    this.effectInfo = effectInfo;
    this.attributeList = attributeList;
    this.source = source;
    this.effectType = effectType; // fixed, calculated, list (for spells), etc.
    this.inputs = [];
    this.setup();
  }

  setup() {
    
    if (this.effectType == "calculated") {
      this.formula = new Calculation(this.effectInfo, this.attributeList, this);
      this.inputs = Array.from(this.formula.getInputs());
    }
  }

  get value() {
    
    if (this.effectType == "fixed") {
      return this.effectInfo;
    } else if (this.effectType == "calculated") {
      return this.formula.calculate();
    }

  }

}