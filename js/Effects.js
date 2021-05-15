"use strict";

class Effects {

  constructor(attributes) {

    this.attributes = attributes;
    this.effectsList = {};

  }

  get(name) {

    return this.effectsList[name];

  }

  add(attribute, effectInfo, source, effectType = "fixed") {

    let name = this.generateUniqueID();

    let effect = new Effect(this.attributes, source);
    effect.setDetails(name, attribute, effectInfo, effectType);
    this.effectsList[name] = effect;

    return(effect);

  }

  removeEffect(effect) {


    effect.removeLinks();
    delete this.effectsList[effect.name];

  }

  generateUniqueID() {
    let S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4());
    // return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }  

  getSaveInfo() {

    let listOfEffects = Object.values(this.effectsList);

    let saveInfo = listOfEffects.reduce( 
      (o, effect) => Object.assign(o, effect.getSaveInfo() ), {} 
    );

    return(saveInfo);
    
  }

}