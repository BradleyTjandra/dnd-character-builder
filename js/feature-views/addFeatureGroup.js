"use strict";

export function addFeatureGroup(e) {
  
  let classGroupingElem = e.target.closest("div[data-feature='character-component']");
  let featureGroup = this.addFeatureGroupElem(classGroupingElem);
  let effect = this.addFeatureGroupEffect(featureGroup);
  this.setupFeatureGroupListeners(featureGroup, effect);
  
}

function addFeatureGroupEffect(elem) {

  let featureType = elem.dataset.featureType;
  let effect = this.controller.effects.add(featureType+"-name", "", "user", "fixed");
  return(effect);

}

function addFeatureGroupElem(characterComponentElem) {

  let classElem = document.getElementById("hidden-all-feature").cloneNode(true);
  classElem.hidden = false;
  classElem.removeAttribute("id");

  let parentElem = characterComponentElem.closest("[data-feature-type]");
  classElem.dataset.featureType = parentElem.dataset.featureType;

  let addClassButton = characterComponentElem.querySelector("input[data-input='add-feature-group']");
  if (addClassButton) addClassButton.before(classElem);
  else parentElem.append(classElem);
  
  return(classElem);
  
}

function setupFeatureGroupListeners(elem, effect) {

  elem.dataset.effectId = effect.name;
  this.effectTree.addNode(elem.dataset.featureType, effect.name, "feature-grouping");
  let featureGroupElem = elem.querySelector("input[data-feature='feature-group-name']");
  featureGroupElem.addEventListener("input", e => effect.effectInfo = e.target.value);


}