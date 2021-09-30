"use strict";

import { addFeature } from "./addFeature.js";
import { addEffect } from ".addEffect.js";
import { addFeatureGroup } from "./addFeatureGroup.js";

export class FeatureViews {
  
  export onClickFeatureList(event) {

    let button = event.target.closest("input[type=button]");
    if (!button) return;

    if (button.dataset.input == "add-feature") addFeature(event, view);
    if (button.dataset.input == "add-effect") addEffect(event);
    if (button.dataset.input == "add-feature-group") addFeatureGroup(event);

  }

}