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

    if (!this._formula) return this.info;

    console.log("this formula is:")
    console.log(this._formula);

    let evaluated = this._formula.map( (calc) => {
      if (typeof calc === "string") return (calc);
      else return (calc.calculate());
      }
    );
    console.log("evaluated is:");
    console.log(evaluated);
    let joined = evaluated.join("");
    console.log("joined is: " + joined);
    return(joined);

  }

  set info(newInfo) {

    if (newInfo == undefined) return;

    // update effect info
    let oldInfo = Object.assign({}, this._info['data']);
    if (oldInfo == newInfo) return;
    this._info['data'] = newInfo;
    this._formula = undefined;
    
    if ("formula" in newInfo) {
      let calc = this.calculationFromFormulaText(newInfo.formula);
      this._formula = calc; 

      this._info["valid"] = calc.reduce( (prev, c) => {
        if (typeof c === "string") return prev;

        console.log(c);
        return (prev && c.getValidity());
      }, true);

      this.inputs = Array.from(
        calc.reduce(getAllInputs, new Set())
      );
      
    } else {
      this._info["valid"] = true;
      this.inputs = [];
    }

    this.isSetup = (this._info["valid"] && this._attribute["valid"]);

    console.log("this formula is:");
    console.log(this._formula);
    console.log(this);

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
    if (/[^\\]\$/.test(text)) {
      let subtexts = text.split("$");
      let calcs = subtexts.map( (txt, i) => {
        if (i % 2 == 0) return txt;
        else return new Calculation(txt);
      });
      // console.log(calcs);
      return(calcs);
    }
    
    let formulaText;
    if (text[0] == "+" || text[0] == "-" || /^\s*$/.test(text))  {
      formulaText = "0" + text;
    } else {
      formulaText = text;
    }
    let calc = new Calculation(formulaText, this.attributes, this);
    return([calc]);
  }
}

function getAllInputs(prev, calc) {
  if (calc.constructor.name == "Calculation") return new Set(prev, calc.getInputs());
  else return prev;
}