"use strict";


export function add(elem) {

  let featureGroup = addElem.call(this,elem);
  let effect = addEffect.call(this,featureGroup);
  addListeners.call(this,featureGroup, effect);

}

export function addElem(elem) {

  let classElem = document.getElementById("hidden-all-feature").cloneNode(true);
  classElem.hidden = false;
  classElem.removeAttribute("id");

  let parentElem = elem.closest("[data-feature-type]");
  classElem.dataset.featureType = parentElem.dataset.featureType;

  let addClassButton = elem.querySelector("input[data-input='add-feature-group']");
  if (addClassButton) addClassButton.before(classElem);
  else parentElem.append(classElem);
  
  return(classElem);
  
}

export function addEffect(elem) {

  let featureType = elem.dataset.featureType;
  let effect = this.controller.effects.add(featureType+"-name", "", "user", "fixed");
  return(effect);

}

export function addListeners(elem, effect) {

  elem.dataset.effectId = effect.name;
  this.effectTree.addNode(elem.dataset.featureType, effect.name, "feature-grouping");
  let featureGroupElem = elem.querySelector("input[data-feature='feature-group-name']");
  featureGroupElem.addEventListener("input", e => effect.effectInfo = e.target.value);

}