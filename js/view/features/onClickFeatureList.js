"use strict";

import { addFeature } from "./Feature.js";
import { add as addEffect } from "./Effect.js";
import { add as addFeatureGroup } from "./FeatureGroup.js";
 
export function onClickFeatureList(event) {

  let button = event.target.closest("input[type=button]");
  if (!button) return;

  if (button.dataset.input == "add-feature") addFeature(event, this);
  else if (button.dataset.input == "add-effect") {
    
    let elem = event.target.closest("div[data-feature='effect-all']");
    addEffect.call(this, elem);

  } else if (button.dataset.input == "add-feature-group") {
    
    let elem = event.target.closest("div[data-feature='character-component']")
    addFeatureGroup(elem);

  }

}