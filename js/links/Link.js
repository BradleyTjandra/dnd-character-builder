"use strict";

import isEmptyObj from "../helpers/isEmptyObj.js";
import Calculation from "./Calculation.js";

export const linkType = {
  FIXED : 'fixed',
  CALCULATED : 'calculated',
}

export class Link {

  constructor(attributes, source) {
    this._attributes = attributes;
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
    this._info["valid"] = true;
  }

  get value() {

    if (!this.isSetup) return undefined;

    if (!this._formula) return this.info;

    let formulaToValues = (calc) => {
      if (calc.constructor.name == "Calculation") return (calc.calculate());
      return (calc);
    };

    let evaluated = {};
    for (let [key, formulae] of Object.entries(this._formula)) {
      if (formulae.constructor.name == "String") evaluated[key] = formulae;
      else evaluated[key] = formulae.map(formulaToValues).join("");
    }

    return(evaluated);
  }

  set info(newInfo) {

    if (newInfo == undefined) return;

    // update effect info
    let oldInfo = Object.assign({}, this._info['data']);
    if (oldInfo == newInfo) return;
    this._info['data'] = newInfo;
    this._formula = {};

    for (let [key, value] of Object.entries(newInfo)) {

      let calc = this.calculationFromFormulaText(value);
      this._formula[key] = calc; 
      this._info["valid"] = true;
      this.inputs = Array.from(
        calc.reduce(getAllInputs, new Set())
      );
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

  set attribute(newAttribute) {

    if (!newAttribute) return;

    if (typeof newAttribute === "string") {
      
      if (!this._attributes.contains(newAttribute)) {
        this.removeLinks();
        this._attribute["valid"] = false;
        this._attribute["data"] = undefined;
        this.isSetup = false;
        return;
      }

      newAttribute = this._attributes.get(newAttribute);
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

    let splitTexts;
    if (/[^\\]\$/.test(text)) {
      splitTexts = text.split(/(?<!\\)\$/);
    } else {
      splitTexts = ["", text];
    }

    let calcs = splitTexts.map( (text, i) => {
      if (/^\s*$/.test(text)) return text;
      if (i % 2 == 0) return text;
      if (text[0] == "+" || text[0] == "-")  {
        text = "0" + text;
      } 
      let calc =  new Calculation(text, this._attributes, this);
      if (calc.getValidity()) return calc;
      return text;
    });
    if (!calcs) return([]);
    return(calcs);
  }
}

function getAllInputs(prev, calc) {
  if (calc.constructor.name == "Calculation") return new Set([...prev, ...calc.getInputs()]);
  else return prev;
}