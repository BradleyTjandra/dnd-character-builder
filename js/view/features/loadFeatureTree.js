"use strict";

import isEmptyObj from "../../helpers/isEmptyObj.js";

export function loadFeatureTree(tree) {

  if (!tree) return;
  let stem = processNode(Object.entries(tree)[0]);

  if (isEmptyObj(stem.children)) return;
  stem.children.forEach(loadCharacterComponent.bind(this));

}

function processNode(node) {
  let [key, children] = node;
  let [effectName, type] = key.split(",");

  return ({
    "children" : Object.entries(children),
    "effectName" : effectName,
    "type" : type,
  })
}

function loadCharacterComponent(child) {
  let node = processNode(child);
  let featureList  = document.getElementById("feature-list");
  let query = `div[data-feature='character-component'][data-feature-type='${node.effectName}']`;
  let elem = featureList.querySelector(query);
  let boundLoader = loadFeatureGrouping.bind(this, elem);
  node.children.forEach(boundLoader);
}

function loadFeatureGrouping(elem, child) {
  let node = processNode(child);
  let childElem = this.addFeatureGroupElem(elem);
  let effect = this.controller.effects.get(node.effectName);
  this.addFeatureGroupListeners(childElem, effect); 
  let featureGroupName = childElem.querySelector(
    "input[data-feature='feature-group-name']"
  );
  featureGroupName.value = effect.effectInfo.name ?? "";
  let boundLoader = loadFeature.bind(this, childElem);
  node.children.forEach(boundLoader);
}

function loadFeature(elem, child) {
  let node = processNode(child);
  
  // make sure this links to a valid effect
  let effect = this.controller.effects.get(node.effectName);
  if (!effect) return;
 
  // add feature elements
  let childElem = this.addFeatureElem(elem);

  // link feature elements to effect
  this.effectTree.addNode(elem.dataset.effectId, effect.name, "feature");
  this.addFeatureListeners(childElem, effect);

  // refresh values from effect info
  childElem.querySelector("input[data-feature='feature-name']").value 
    = effect.effectInfo.name;
  childElem.querySelector("textarea[data-feature='feature-description']").value
    = effect.effectInfo.description;

  let boundLoader = loadEffect.bind(this, childElem);
  node.children.forEach(boundLoader);

}

function loadEffect(elem, child) {
  let node = processNode(child);
  
  // make sure this links to a valid effect
  let effect = this.controller.effects.get(node.effectName);
  if (!effect) return;

  // add effect elements
  let childElem = this.addEffectElem(elem);
  this.addEffectListeners(childElem, effect);

  // refresh values from effect info
  childElem.querySelector("input[data-effect='effect-attribute']").value 
    = effect.effectInfo.name;
  childElem.querySelector("input[data-effect='effect-calculation']").value 
    = effect.effectInfo.calculation;
}
