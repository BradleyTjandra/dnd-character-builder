"use strict";

import { View } from "./View.js";
import { linkBaseAbilityScores, linkTotalAbilityScores, linkSavingThrows } 
  from "./setup/AbilityScores.js";
import { linkSkills } from "./setup/Skills.js";
import { linkOtherAttributes } from "./setup/OtherAttributes.js";
import { linkHP } from "./setup/HP.js";
import { onClickFeatureList } from "./features/onClickFeatureList.js";
import { loadFeatureTree } from "./features/loadFeatureTree.js";
import * as featureGroup from "./features/FeatureGroup.js";
import isEmptyObj from "../helpers/isEmptyObj.js";

export class Views {

  constructor(controller) {
    this.controller = controller;
    this.views = {};
  }

  setup() {
    
    linkBaseAbilityScores(this, this.controller.attributes);
    linkTotalAbilityScores(this, this.controller.attributes);
    linkSavingThrows(this, this.controller.attributes);
    linkSkills(this);
    linkOtherAttributes(this);
    linkHP(this);
    this.setupEffectTree();

    document.getElementById("feature-list").onclick = onClickFeatureList.bind(this);
  }

  setupEffectTree() {

    this.effectTree = new EffectTree();
    this.effectTree.addNode("stem", "race", "character-component");
    this.effectTree.addNode("stem", "background", "character-component");
    this.effectTree.addNode("stem", "class", "character-component");

  }

  add(elem, attribute, viewType) {

    let view = new View(elem, attribute, viewType);
    this.views[attribute.name] = view;
    return(view);

  }
  
  loadSaveInfo() {
    
    let characterSheetData = JSON.parse(localStorage.getItem("characterSheet"));
    if (!characterSheetData) return;
    let featuresTree = characterSheetData?.featuresTree;
    
    // if there was no race or background in the saved info, we load elems for them here
    for (let component of ["race", "background"]) {
      if (noCharComponent(featuresTree, component)) {
        let elem = document.querySelector(
          "div[data-feature='character-component']" + 
          `[data-feature-type='${component}']`
        );
        featureGroup.add.call(this, elem);
      }
    }
    
    // load the featuresTree
    if (featuresTree) loadFeatureTree.call(this, featuresTree);

    window.scrollTo(0, 0);

  }
   
  updateModel(attribute, data) {
    attribute.setValue(data);
  }  

  refreshViews() {
    Object.values(this.views).forEach(view => view.update());
  }

}

Views.prototype.addFeatureGroupElem = binder(featureGroup.addElem);
Views.prototype.addFeatureGroupEffect = binder(featureGroup.addEffect);
Views.prototype.addFeatureGroupListeners = binder(featureGroup.addListeners);

function binder(func) {
  return(function(...args) {
    return(func.call(this, ...args))
  })
}

function noCharComponent(tree, component) {
  if (!tree) return true;
  let stem = tree["stem,stem"];
  let charComponent = stem[component+",character-component"];
  return(isEmptyObj(charComponent));
}
