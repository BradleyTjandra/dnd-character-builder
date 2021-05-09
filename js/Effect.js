"use strict";

class Effect {

  constructor(attributeList, source) {
    this.attributeList = attributeList;
    this.source = source;
    this.isSetup = false;
    this._attribute = {"valid" : false, "data" : undefined};
    this._effectInfo = {"valid" : false, "data" : undefined};
    this.inputs = [];
  }

  setDetails(attribute, effectInfo, effectType = "fixed") {

    this.effectType = effectType; 
    this.attribute = attribute;
    this.effectInfo = effectInfo;
    
    // fixed, calculated, list (for spells), etc.

    // this.setup();
    // this.refreshEffectInfoValidity();
  }

  refreshEffectInfoValidity() {

    if (this.effectType == "calculated") {
      this._effectInfo["valid"] = this.effectInfo.getValidity();
    } else {
      this._effectInfo["valid"] = true;
    }

  }
  
  // constructor(attribute, effectInfo, attributeList, source, effectType = "fixed") {
  //   // this.name = name;
  //   this.attribute = attribute;
  //   this._effectInfo = {
  //     "valid" : undefined,
  //     "info" : effectInfo
  //   }
  //   this.attributeList = attributeList;
  //   this.source = source;
  //   this.effectType = effectType; // fixed, calculated, list (for spells), etc.
  //   this.inputs = [];
  //   this.setup();
  // }

  get value() {

    if (!this.isSetup) return undefined;
    
    if (this.effectType == "fixed") {
      return this.effectInfo;
    } else if (this.effectType == "calculated") {
      return this.formula.calculate();
    }

  }

  set effectInfo(newInfo) {

    let oldInfo = Object.assign({}, this.effectInfo);

    if (oldInfo == newInfo) return;

    this._effectInfo['data'] = newInfo;

    if (this.effectType == "calculated") {
      this.formula = new Calculation(newInfo, this.attributeList, this);
      this.inputs = Array.from(this.formula.getInputs());
      this._effectInfo["valid"] = this.formula.getValidity();
    } else {
      this._effectInfo["valid"] = true;
    }

    this.isSetup = (this._effectInfo["valid"] && this._attribute["valid"]);
    if (this.isSetup) {
      this.inputs.forEach((attr) => attr.listeners.push(this.attribute));
      this.attribute.calculate();
    }

  }

  get effectInfo() {
    return(this._effectInfo['data']);
  }

  set attribute(newAttribute) {

    if (typeof newAttribute === "string") {
      
      if (!(newAttribute in this.attributeList)) {
        this.removeListeningAttributes();
        this._attribute["valid"] = false;
        this._attribute["data"] = undefined;
        return;
      }

      newAttribute = this.attributeList[newAttribute];
    }


    // if (newAttribute.name == this.attribute?.name) return;

    this.removeListeningAttributes();
    this._attribute["data"] = newAttribute;
    this._attribute["valid"] = true;

    this.isSetup = this._attribute["valid"] && this._effectInfo['valid'];
    if (this._attribute["valid"]) this.attribute.addInput(this);

  }

  get attribute() {
    return(this._attribute['data']);
  }

  removeListeningAttributes() {
    if (!this.isSetup) return;
    this.attribute.removeInput(this);
  }

}