"use strict";

import isEmptyObj from "../../helpers/isEmptyObj.js";

export function loadFeatureTree(tree) {

  if (!tree) return;
  let stem = processNode(Object.entries(tree)[0]);

  if (isEmptyObj(stem.children)) return;
  stem.children.forEach(loadStemChildren.bind(this));

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

function loadStemChildren(child) {
  let node = processNode(child);
  if (isEmptyObj(node)) return;
  node.children.forEach(loadCharacterComponent.bind(this));
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
  this.setupFeatureGroupListeners(childElem, effect); 
  let featureGroupName = childElem.querySelector(
    "input[data-feature='feature-group-name']"
  );
  featureGroupName.value = effect.effectInfo;
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
  this.effectTree.addNode(childElem.dataset.featureType, effect.name, "feature");
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
  let effectsElem = elem.querySelector("div[data-feature='effect-all']");
  let childElem = this.addEffectElem(effectsElem);

  // link effect elements to effect
  this.setupEffectListeners(childElem, effect);

  // refresh values from effect info
  childElem.querySelector("input[data-effect='effect-attribute']").value 
    = effect.attribute.name;
  childElem.querySelector("input[data-effect='effect-calculation']").value 
    = effect.effectInfo;
}

// loadFeatureTreeNode(elem, node) {

//   let [key, children] = node;
//   let [effectName, type] = key.split(",");
//   let childrenElem;

//   if (type == "stem") {

//     childrenElem = elem.getElementById("feature-list");

//   } else if (type == "character-component") {

//     childrenElem = elem.querySelector(`div[data-feature='character-component'][data-feature-type='${effectName}']`);

//   } else if (type == "feature-grouping") {

//     let childrenElem = this.addFeatureGroupElem(elem);
//     let effect = this.controller.effects.get(effectName);
//     this.setupFeatureGroupListeners(childrenElem, effect);
//     childrenElem.querySelector("input[data-feature='feature-group-name']").value = effect.effectInfo;
    
//   } else if (type == "feature") {

//     // make sure this links to a valid effect
//     let effect = this.controller.effects.get(effectName);
//     if (!effect) return;

//     // add feature elements
//     childrenElem = this.addFeatureElem(elem);

//     // link feature elements to effect
//     this.effectTree.addNode(childrenElem.dataset.featureType, effect.name, "feature");
//     this.addFeatureListeners(childrenElem, effect);

//     // refresh values from effect info
//     childrenElem.querySelector("input[data-feature='feature-name']").value = effect.effectInfo.name;
//     childrenElem.querySelector("textarea[data-feature='feature-description']").value = effect.effectInfo.description;

//   } else if (type == "effect") {

//     // make sure this links to a valid effect
//     let effect = this.controller.effects.get(effectName);
//     if (!effect) return;

//     // add effect elements
//     let effectsElem = elem.querySelector("div[data-feature='effect-all']");
//     let childrenElem = this.addEffectElem(effectsElem);

//     // link effect elements to effect
//     this.setupEffectListeners(childrenElem, effect);

//     // refresh values from effect info
//     childrenElem.querySelector("input[data-effect='effect-attribute']").value = effect.attribute.name;
//     childrenElem.querySelector("input[data-effect='effect-calculation']").value = effect.effectInfo;

//   }

//   if (isEmptyObj(children)) return;

//   Object.entries(children).forEach( child => this.loadFeatureTreeNode(childrenElem, child) );
  
// }