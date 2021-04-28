"use strict";

class Effect {
  
  constructor(name, attribute, effectInfo, attributeList, source, effectType = "fixed") {
    this.name = name;
    this.attribute = attribute;
    this.effectInfo = effectInfo;
    this.attributeList = attributeList;
    this.source = source;
    this.effectType = effectType; // fixed, calculated, list (for spells), etc.
    this.setup();
  }

  setup() {
    
    if (this.effectType == "calculated") {
      this.formula = new Calculation(this.effectInfo, this.attribute, this);
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