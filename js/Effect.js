"use strict";

class Effect {
  
  constructor(attribute, effectInfo, attributeList, source, effectType = "fixed") {
    // this.name = name;
    this.attribute = attribute;
    this._effectInfo = effectInfo;
    this.attributeList = attributeList;
    this.source = source;
    this.effectType = effectType; // fixed, calculated, list (for spells), etc.
    this.inputs = [];
    this.setup();
  }

  setup() {
    
    if (this.effectType == "calculated") {
      this.formula = new Calculation(this._effectInfo, this.attributeList, this);
      this.inputs = Array.from(this.formula.getInputs());
    }

  }

  get value() {
    
    if (this.effectType == "fixed") {
      return this._effectInfo;
    } else if (this.effectType == "calculated") {
      return this.formula.calculate();
    }

  }

  set effectInfo(info) {

    this._effectInfo = info;
    this.attribute.calculate();    

  }

  get effectInfo() {
    return(this._effectInfo);
  }

  remove() {
    this.attribute.removeInput(this);
  }

}