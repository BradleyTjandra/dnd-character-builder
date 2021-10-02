"use strict";

import Calculation from "./Calculation.js";

export const linkType = {
  FIXED : 'fixed',
  CALCULATED : 'calculated',
}

export class Link {

  constructor(attributes, source) {
    this.attributes = attributes;
    this.source = source;
    this.isSetup = false;
    this._attribute = {"valid" : false, "data" : undefined};
    this._effectInfo = {"valid" : false, "data" : undefined};
    this.inputs = [];
    this.name = undefined;
  }

  setDetails(name, attribute, effectInfo, effectType = linkType.CALCULATED) {

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
    
    if (this.effectType.includes(linkType.FIXED)) {
      return this.effectInfo;
    } else if (this.effectType.includes(linkType.CALCULATED)) {
      return this.formula.calculate();
    } 

  }

  set effectInfo(newInfo) {

    if (newInfo == undefined) return;

    // update effect info
    let oldInfo = Object.assign({}, this._effectInfo['data']);
    if (oldInfo == newInfo) return;
    this._effectInfo['data'] = newInfo;
    
    if ("formula" in newInfo) {
      let calc = this.calculationFromFormulaText(newInfo.formula);
      this.formula = calc;
      this._effectInfo["valid"] = calc.getValidity();
      this.inputs = Array.from(calc.getInputs());
    } else {
      this._effectInfo["valid"] = true;
      this.inputs = [];
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

  // setEffectInfoByKey(key, info) {
  //   this.effectInfo = Object.assign(
  //     this.effectInfo,
  //     {[key] : info}
  //   );
  // }

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
        "effectType" : this.effectType,
        
      }
    };

    return(toSave);
  }


  calculationFromFormulaText(text) {
    let formulaText;
    if (text[0] == "+" || text[0] == "-" || /^\s*$/.test(text))  {
      formulaText = "0" + text;
    } else {
      formulaText = text;
    }
    return(new Calculation(formulaText, this.attributes, this));
  }
}
