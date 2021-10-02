"use strict";

import createFromTemplate from "../../helpers/createFromTemplate.js";
import * as Feature from "./Feature.js";

export function add(parent) {

  let elem = addElem.call(this, parent);
  let effect = addEffect.call(this);
  this.effectTree.addNode("inventory-feature-group", effect.name, "feature");
  addListeners.call(this, elem, effect);

}

export function addElem(parent) {
  let newElem = Feature.addElem.call(this, parent);

  newElem.querySelector("[name-title]").innerHTML = "Item Name:";
  newElem.querySelector("[desc-title]").innerHTML = "Item Description:";

  return(newElem);
}

export function addEffect() {
  // create an effect for a text description of the feature
  let attribute = this.controller.attributes.get("inventory");
  let effect = this.controller.effects.add(attribute, undefined, "user");
  effect.info = {'name':'','description':'', featureSource: "self"};
  return(effect);
}

export function addListeners(featureElem, effect) {
  Feature.addListeners.call(this, featureElem, effect);
}