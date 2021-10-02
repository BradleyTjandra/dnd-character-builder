"use strict";

import createFromTemplate from "../../helpers/createFromTemplate.js";
import * as Feature from "./Feature.js";

export function add(parent) {

  let elem = addElem.call(this, parent);
  let effect = addEffect.call(this);
  this.effectTree.addNode(parent.dataset.effectId, effect.name, "feature");
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
  let attribute = this.controller.attributes.get("features-list");
  let effect = this.controller.effects.add(attribute, undefined, "user");
  effect.effectInfo = {'name':'','description':'', featureSource: "self"};
  return(effect);

}

export function addListeners(featureElem, effect) {

  featureElem.dataset.effectId = effect.name;

  // Listener for feature name changes
  let featureName = featureElem.querySelector("input[data-feature='feature-name']");
  featureName.addEventListener("input", e => {
    let info = effect.effectInfo ?? {};
    info['name'] = e.target.value;
    effect.effectInfo = info;
  });

  // Listener for feature description changes
  let featureDesc = featureElem.querySelector("textarea[data-feature='feature-description']");
  featureDesc.addEventListener("input", e => {
    let info = effect.effectInfo ?? {};
    info['description'] = e.target.value;
    effect.effectInfo = info;
  });

  // Listener for feature being deleted
  let deleteFeature = featureElem.querySelector("input[data-input='del-feature']");
  deleteFeature.addEventListener("click", e => {
    if (featureElem.hidden) return;
    featureElem.remove();
    this.controller.effects.removeEffect(effect);
    this.effectTree.removeNode(effect.name);
  })

}