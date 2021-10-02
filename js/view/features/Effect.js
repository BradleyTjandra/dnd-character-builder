"use strict";

import { linkType } from "../../links/Link.js";

export function add(parent) {
  let effectElem = addElem.call(this,parent);
  let effect = this.controller.effects.add(undefined, undefined, "user", "calculated");
  addListeners.call(this,effectElem, effect);
}

export function addListeners(div, effect) {

  if (div.dataset?.feature != "effect") return;
  
  div.dataset.effectId = effect.name;
  let parentEffect = div.parentNode.closest("[data-effect-id]").dataset.effectId;
  this.effectTree.addNode(parentEffect, effect.name, "effect");

  let effectAttr = div.querySelector("input[data-effect='effect-attribute']");
  effectAttr.addEventListener("input", e => {

    if (isCounterEffect(div)) setAsCounterEffect(effect, div);
    else if (isHpEffect(div)) setAsHpEffect(effect, div);
    else setAsOtherEffect(effect, div);

  });

  let effectCalc = div.querySelector("input[data-effect='effect-calculation']");
  effectCalc.addEventListener("input", e => {
    
    if (isCounterEffect(div)) setAsCounterEffect(effect, div);
    else if (isHpEffect(div)) setAsHpEffect(effect, div);
    else setAsOtherEffect(effect, div);

  } );

  let effectDel = div.querySelector("input[data-input='del-effect']");
  effectDel.addEventListener("click", e => {
    div.remove();
    this.controller.effects.removeEffect(effect);
    this.effectTree.removeNode(effect.name);
  })

}

export function addElem(effectsElem) {

  let effectElem = document.getElementById("hidden-effect").cloneNode(true);
  effectElem.hidden = false;
  effectElem.removeAttribute("id");

  let addEffectDiv = effectsElem
    .querySelector("input[data-input='add-effect']")
    .parentNode;
  addEffectDiv.before(effectElem);

  effectElem.dataset.featureType = addEffectDiv
    .closest("[data-feature]")
    .dataset
    .featureType;
  return(effectElem);

}

function isCounterEffect(elem) {
  let nameElem = elem.querySelector("input[data-effect='effect-attribute']");
  if (!nameElem) return false;
  // console.log(nameElem.value);
  // console.log(/^counter\d+[:.*]?$/.test(nameElem.value));
  return(/^counter\d+(:.*)?$/.test(nameElem.value));
}

function isHpEffect(elem) {
  let nameElem = elem.querySelector("input[data-effect='effect-attribute']");
  if (!nameElem) return false;
  return(nameElem.value=="hp");
}

function setAsCounterEffect(effect, elem) {

  let nameElem = elem.querySelector("input[data-effect='effect-attribute']");
  let calcElem = elem.querySelector("input[data-effect='effect-calculation']");
  let featureElem = elem.closest("[data-feature='feature-all']");
  let nameVal = nameElem.value;

  if (effect.name != nameVal) {
    effect.attribute = "all-features-descriptions";
  }

  let colonIdx = nameVal.search(":");
  let counterId = colonIdx > -1 ? nameVal.slice(0,colonIdx+1) : nameVal;
  let counterName = colonIdx > -1 ? nameVal.slice(colonIdx+1) : nameVal;
  counterName = counterName.trim();

  effect.effectType = linkType.CALCULATED;
  effect.effectInfo = {
    "name" : nameElem.value,
    "calculation" : calcElem.value,
    "counter" : counterId,
    "counterName" : counterName,
    "formula" : calcElem.value,
    "featureSource" : featureElem.dataset.effectId,
  };

}

function setAsHpEffect(effect, elem) {

  let nameElem = elem.querySelector("input[data-effect='effect-attribute']");
  let calcElem = elem.querySelector("input[data-effect='effect-calculation']");

  effect.attribute = nameElem.value;
  effect.effectType = "total";
  effect.effectInfo = { 
    "formula" : calcElem.value,
    "name" : nameElem.value,
    "calculation" : calcElem.value,
  };

}

function setAsOtherEffect(effect, elem) {

  let nameElem = elem.querySelector("input[data-effect='effect-attribute']");
  let calcElem = elem.querySelector("input[data-effect='effect-calculation']");

  effect.attribute = nameElem.value;
  effect.effectType = linkType.CALCULATED;
  effect.effectInfo = { 
    "formula" : calcElem.value,
    "name" : nameElem.value,
    "calculation" : calcElem.value,
  };

}