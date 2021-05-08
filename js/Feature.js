"use strict";

class Feature {
  
  constructor(name, featureType = "fixed", attributeList) {
    this.name = name;
    this.effects = [];
    this.attributeList = attributeList;
    this.description = {};
    this.featureType = featureType; // fixed, calculated, list (for spells), etc.
  }

  addEffect(attributeInfo, effectInfo) {

    let attribute = this.attributeList[attributeInfo];
    let effect = new Effect(attribute, effectInfo, this.attributeList, this, attribute.calcType);
    this.effects.push(effect);
    attribute.addInput(effect);

  }

}