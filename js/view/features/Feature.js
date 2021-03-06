"use strict";

import createFromTemplate from "../../helpers/createFromTemplate.js";

export function add(parent) {

  let elem = addElem.call(this, parent);
  let effect = addEffect.call(this);
  this.effectTree.addNode(parent.dataset.effectId, effect.name, "feature");
  addListeners.call(this, elem, effect);

}

export function addElem(featureGroupingElem) {

  // Create new feature div
  let featureElem = createFromTemplate("template-feature");
  let addFeatureButton = featureGroupingElem.querySelector("input[data-input='add-feature']");
  addFeatureButton.before(featureElem);

  featureElem = addFeatureButton.previousElementSibling;
  
  let featureType = featureGroupingElem.dataset.featureType;
  featureElem.dataset.featureType = featureType;

  // false so that the button scrolls into view at button
  addFeatureButton.scrollIntoView(false); 

  return(featureElem);

}

export function addEffect() {

  // create an effect for a text description of the feature
  let featureDescriptions = this.controller.attributes.get("features-list");
  let effect = this.controller.effects.add(featureDescriptions, undefined, "user");
  effect.info = {'name':'','description':'', featureSource: "self"};
  return(effect);

}

export function addListeners(featureElem, effect) {

  featureElem.dataset.effectId = effect.name;

  // Listener for feature name changes
  let featureName = featureElem.querySelector("input[data-feature='feature-name']");
  featureName.addEventListener("input", e => {
    let info = effect.info ?? {};
    info['name'] = e.target.value;
    effect.info = info;
  });

  // Listener for feature description changes
  let featureDesc = featureElem.querySelector("textarea[data-feature='feature-description']");
  featureDesc.addEventListener("input", e => {
    let info = effect.info ?? {};
    info['description'] = e.target.value;
    effect.info = info;
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