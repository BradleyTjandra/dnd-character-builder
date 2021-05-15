// "use strict";

// class Feature {
  
//   constructor(name, featureType = "fixed", attributes) {
//     this.name = name;
//     this.effects = [];
//     this.attributes = attributes;
//     this.description = {};
//     this.featureType = featureType; // fixed, calculated, list (for spells), etc.
//   }

//   addEffect(attributeInfo, effectInfo) {

//     let attribute = this.attributes.get(attributeInfo);
//     // let effect = new Effect(attribute, effectInfo, this.attributeList, this, attribute.calcType);
//     let effect = new Effect(this.attributeList, this);
//     effect.setDetails("attributeInfo", effectInfo, "calculated");
//     this.effects.push(effect);
//     attribute.addInput(effect);

//   }

// }