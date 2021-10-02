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
    this._info = {"valid" : false, "data" : undefined};
    this.inputs = [];
    this.name = undefined;
  }

  setDetails(name, attribute, info, type = linkType.CALCULATED) {

    this.name = name;
    this.type = type; 
    this.attribute = attribute;
    this.info = info;
  }

  refreshinfoValidity() {

    if (this.type.includes("calculated")) {
      this._info["valid"] = this.info.getValidity();
    } else {
      this._info["valid"] = true;
    }

  }

  get value() {

    if (!this.isSetup) return undefined;
    
    if (this.type.includes(linkType.FIXED)) {
      return this.info;
    } else if (this.type.includes(linkType.CALCULATED)) {
      return this.formula.calculate();
    } 

  }

  set info(newInfo) {

    if (newInfo == undefined) return;

    // update effect info
    let oldInfo = Object.assign({}, this._info['data']);
    if (oldInfo == newInfo) return;
    this._info['data'] = newInfo;
    
    if ("formula" in newInfo) {
      let calc = this.calculationFromFormulaText(newInfo.formula);
      this.formula = calc;
      this._info["valid"] = calc.getValidity();
      this.inputs = Array.from(calc.getInputs());
    } else {
      this._info["valid"] = true;
      this.inputs = [];
    }

    this.isSetup = (this._info["valid"] && this._attribute["valid"]);

    if (this.isSetup) {

      this.inputs.forEach((attr) => attr.listeners.push(this));
      this.attribute.calculate();

    }

  }

  get info() {
    return(this._info['data']);
  }

  // setinfoByKey(key, info) {
  //   this.info = Object.assign(
  //     this.info,
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

    this.isSetup = this._attribute["valid"] && this._info['valid'];
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
        "info" : this.info,
        "type" : this.type,
        
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
