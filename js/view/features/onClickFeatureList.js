"use strict";

import { add as addFeature } from "./Feature.js";
import { add as addEffect } from "./Effect.js";
import { add as addFeatureGroup } from "./FeatureGroup.js";
import { add as addInventory } from "./Inventory.js";
 
export function onClickFeatureList(event) {

  let button = event.target.closest("input[type=button]");
  if (!button) return;

  let featureType = event.target.closest("[data-feature-type]")
    .dataset.featureType;

  if (featureType == "inventory") {

    let elem = event.target.closest("div[data-feature='feature-group']");
    addInventory.call(this, elem);

  } else if (button.dataset.input == "add-effect") {
    
    let elem = event.target.closest("div[data-feature='feature']");
    addEffect.call(this, elem);

  } else if (button.dataset.input == "add-feature") {
    
    let elem = event.target.closest("div[data-feature='feature-group']");
    addFeature.call(this, elem);

  } else if (button.dataset.input == "add-feature-group") {
    
    let elem = event.target.closest("div[data-feature='character-component']")
    addFeatureGroup.call(this, elem);

  }

}
