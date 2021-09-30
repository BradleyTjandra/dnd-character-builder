"use strict";


function addEffect(e) {

  let effectsElem = e.target.closest("div[data-feature='effect-all']");
  let effectElem = this.addEffectElem(effectsElem);
  let effect = this.controller.effects.add(undefined, undefined, "user", "calculated");
  this.setupEffectListeners(effectElem, effect);

}


function setupEffectListeners(div, effect) {

  if (div.dataset?.feature != "effect") return;
  
  div.dataset.effectId = effect.name;
  let parentEffect = div.parentNode.closest("[data-effect-id]").dataset.effectId;
  this.effectTree.addNode(parentEffect, effect.name, "effect");

  let effectAttr = div.querySelector("input[data-effect='effect-attribute']");
  effectAttr.addEventListener("input", e => {
    effect.attribute = e.target.value;
    if (e.target.value == "hp") {
      effect.effectType = "calculated resource-total";
    } else {
      effect.effectType = "calculated"
    };
  });

  let effectCalc = div.querySelector("input[data-effect='effect-calculation']");
  effectCalc.addEventListener("input", e => effect.effectInfo = e.target.value);

  let effectDel = div.querySelector("input[data-input='del-effect']");
  effectDel.addEventListener("click", e => {
    div.remove();
    this.controller.effects.removeEffect(effect);
    this.effectTree.removeNode(effect.name);
  })

}

function addEffectElem(effectsElem) {

  let effectElem = document.getElementById("hidden-effect").cloneNode(true);
  effectElem.hidden = false;
  effectElem.removeAttribute("id");

  let addEffectDiv = effectsElem.querySelector("input[data-input='add-effect']").parentNode;
  addEffectDiv.before(effectElem);

  effectElem.dataset.featureType = addEffectDiv.closest("[data-feature]").dataset.featureType;

  return(effectElem);

}
