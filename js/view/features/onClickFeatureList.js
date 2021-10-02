"use strict";

import { add as addFeature } from "./Feature.js";
import { add as addEffect } from "./Effect.js";
import { add as addFeatureGroup } from "./FeatureGroup.js";
import { add as addInventory } from "./Inventory.js";
 
export function onClickFeatureList(event) {

  let button = event.target.closest("input[type=button]");
  if (!button) return;

  let charComp = event.target.closest("div[data-feature='character-component']");
  if (!charComp) {
    console.log(button);
    console.log(button.parent);
    // console.log(button.parent.parent);
    // console.log(button.parent.parent.parent);
  }
  let featureType = charComp.dataset.featureType;

  if (featureType == "inventory") {

    let elem = event.target.closest("div[data-feature='effect-all']");
    addInventory.call(this, elem);

  } else if (button.dataset.input == "add-effect") {
    
    let elem = event.target.closest("div[data-feature='effect-all']");
    addEffect.call(this, elem);

  } else if (button.dataset.input == "add-feature") {
    
    let elem = event.target.closest("div[data-feature='all-feature']");
    addFeature.call(this, elem);

  } else if (button.dataset.input == "add-feature-group") {
    
    let elem = event.target.closest("div[data-feature='character-component']")
    addFeatureGroup.call(this, elem);

  }

}
