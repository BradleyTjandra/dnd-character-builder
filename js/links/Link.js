"use strict";

import Calculation from "./Calculation.js";

export default class Link {

  constructor(attributes, source) {
    this.attributes = attributes;
    this.source = source;
    this.isSetup = false;
    this._attribute = {"valid" : false, "data" : undefined};
    this._effectInfo = {"valid" : false, "data" : undefined};
    this.inputs = [];
    this.name = undefined;
  }

  setDetails(name, attribute, effectInfo, effectType = "fixed") {

    this.name = name;
    this.effectType = effectType; 
    this.attribute = attribute;
    this.effectInfo = effectInfo;
  }

  refreshEffectInfoValidity() {

    if (this.effectType.includes("calculated")) {
      this._effectInfo["valid"] = this.effectInfo.getValidity();
    } else {
      this._effectInfo["valid"] = true;
    }

  }

  get value() {

    if (!this.isSetup) return undefined;
    
    if (this.effectType.includes("fixed")) {
      return this.effectInfo;
    } else if (this.effectType.includes("calculated")) {
      return this.formula.calculate();
    } 

  }

  set effectInfo(newInfo) {

    if (newInfo == undefined) return;

    // update effect info
    let oldInfo = Object.assign({}, this.effectInfo);
    if (oldInfo == newInfo) return;
    this._effectInfo['data'] = newInfo;

    // recreate the supporting information
    if (this.effectType.includes("calculated")) {

      let formulaText;
      if (newInfo[0] == "+" || newInfo[0] == "-")  {
        formulaText = "0" + newInfo;
      } else {
        formulaText = newInfo;
      }
      this.formula = new Calculation(formulaText, this.attributes, this);
      this.inputs = Array.from(this.formula.getInputs());
      this._effectInfo["valid"] = this.formula.getValidity();

    } else {

      this._effectInfo["valid"] = true;

    }

    this.isSetup = (this._effectInfo["valid"] && this._attribute["valid"]);

    if (this.isSetup) {

      this.inputs.forEach((attr) => attr.listeners.push(this));
      this.attribute.calculate();

    }

  }

  get effectInfo() {
    return(this._effectInfo['data']);
  }

  set attribute(newAttribute) {

    if (!newAttribute) return;

    if (typeof newAttribute === "string") {
      
      if (!this.attributes.contains(newAttribute)) {
        this.removeLinks();
        this._attribute["valid"] = false;
        this._attribute["data"] = undefined;
        this.isSetup = false;
        return;
      }

      newAttribute = this.attributes.get(newAttribute);
    }

    this.removeLinks();
    this._attribute["data"] = newAttribute;
    this._attribute["valid"] = true;

    this.isSetup = this._attribute["valid"] && this._effectInfo['valid'];
    if (this._attribute["valid"]) this.attribute.addInput(this);

  }

  get attribute() {
    return(this._attribute['data']);
  }

  removeLinks(attribute) {

    if (!this.isSetup) return;

    if (!attribute) attribute = this.attribute;

    attribute.removeInput(this);
    attribute.removeDependent(this);

  }

  update() {
    this.attribute.calculate();
  }

  getSaveInfo() {

    if (!this.isSetup) return {};

    let toSave = {
      [this.name] : {
         
        "name" : this.name,
        "attribute" : this.attribute.name,
        "effectInfo" : this.effectInfo,
        // "source" : this.source?.name ?? this.source
        "effectType" : this.effectType,
        
      }
    };


    return(toSave);

  }

}