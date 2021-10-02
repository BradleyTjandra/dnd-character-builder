"use strict";

import createFromTemplate from "../../helpers/createFromTemplate.js";
import { linkType } from "../../links/Link.js";

export function add(parent) {
  let effectElem = addElem(parent);
  let effect = this.controller.effects.add(undefined, undefined, "user", "calculated");
  addListeners.call(this, effectElem, effect);
}

export function addElem(parent) {

  let effectElem = createFromTemplate("template-effect");

  let addEffectElem = parent
    .querySelector("input[data-input='add-effect']")
    .parentNode;
    addEffectElem.before(effectElem);

  effectElem = addEffectElem.previousElementSibling;

  effectElem.dataset.featureType = addEffectElem
    .closest("[data-feature-type]")
    .dataset
    .featureType;
  return(effectElem);

}

export function addListeners(div, effect) {

  if (div.dataset?.feature != "effect") return;
  
  div.dataset.effectId = effect.name;
  let parentEffect = div.parentNode.closest("[data-effect-id]").dataset.effectId;
  this.effectTree.addNode(parentEffect, effect.name, "effect");

  let effectAttr = div.querySelector("input[data-effect='effect-attribute']");
  let boundHandleInput = () => handleInput(div, effect);
  effectAttr.addEventListener("input", boundHandleInput);

  let effectCalc = div.querySelector("input[data-effect='effect-calculation']");
  effectCalc.addEventListener("input", boundHandleInput);

  let effectDel = div.querySelector("input[data-input='del-effect']");
  effectDel.addEventListener("click", e => {
    div.remove();
    this.controller.effects.removeEffect(effect);
    this.effectTree.removeNode(effect.name);
  })

}

function handleInput(div, effect) {
  if (isCounterEffect(div)) setAsCounterEffect(effect, div);
  else if (isHpEffect(div)) setAsHpEffect(effect, div);
  else setAsOtherEffect(effect, div);
}

function isCounterEffect(elem) {
  let nameElem = elem.querySelector("input[data-effect='effect-attribute']");
  if (!nameElem) return false;
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
  let featureElem = elem.closest("[data-feature='feature']");
  let nameVal = nameElem.value;

  if (effect.name != nameVal) {
    let featType = elem.closest("[data-feature-type]").dataset.featureType;
    if (featType == "inventory") effect.attribute = "inventory";
    else effect.attribute = "features-list";
  }

  let colonIdx = nameVal.search(":");
  let counterId = colonIdx > -1 ? nameVal.slice(0,colonIdx+1) : nameVal;
  let counterName = colonIdx > -1 ? nameVal.slice(colonIdx+1) : nameVal;
  counterName = counterName.trim();

  effect.type = linkType.CALCULATED;
  effect.info = {
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

  effect.attribute = "hp";
  effect.type = "total";
  effect.info = { 
    "formula" : calcElem.value,
    "name" : nameElem.value,
    "calculation" : calcElem.value,
  };

}

function setAsOtherEffect(effect, elem) {

  let nameElem = elem.querySelector("input[data-effect='effect-attribute']");
  let calcElem = elem.querySelector("input[data-effect='effect-calculation']");

  effect.attribute = nameElem.value;
  effect.type = linkType.CALCULATED;
  effect.info = { 
    "formula" : calcElem.value,
    "name" : nameElem.value,
    "calculation" : calcElem.value,
  };

}