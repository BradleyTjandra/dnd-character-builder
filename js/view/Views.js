"use strict";

// import { Display } from "./displays/Display.js";
import { linkBaseAbilityScores, linkTotalAbilityScores, linkSavingThrows } 
  from "./setup/AbilityScores.js";
import { linkSkills } from "./setup/Skills.js";
import linkCharacterInfo from "./setup/linkCharacterInfo.js";
import { linkOtherAttributes } from "./setup/OtherAttributes.js";
import { linkHP } from "./setup/HP.js";
import { onClickFeatureList } from "./features/onClickFeatureList.js";
import { loadFeatureTree } from "./features/loadFeatureTree.js";
import * as featureGroup from "./features/FeatureGroup.js";
import * as feature from "./features/Feature.js";
import * as effect from "./features/Effect.js";
import isEmptyObj from "../helpers/isEmptyObj.js";
import FeatureTree from "./features/FeatureTree.js";
import newDisplay from "./displays/newDisplay.js";

export default class Views {

  constructor(controller) {
    this.controller = controller;
    this.views = {};
  }

  setup() {
    
    linkCharacterInfo.call(this);
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

    this.effectTree = new FeatureTree();
    this.effectTree.addNode("stem", "race", "character-component");
    this.effectTree.addNode("stem", "background", "character-component");
    this.effectTree.addNode("stem", "class", "character-component");

  }

  // add(elem, attribute, viewType) {

  //   let view = new Display(elem, attribute, viewType);
  //   this.views[attribute.name] = view;
  //   return(view);

  // }
  
  loadSaveInfo() {
    
    let characterSheetData = JSON.parse(localStorage.getItem("characterSheet"));
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

Views.prototype.addFeatureElem = binder(feature.addElem);
Views.prototype.addFeatureEffect = binder(feature.addEffect);
Views.prototype.addFeatureListeners = binder(feature.addListeners);

Views.prototype.addEffectElem = binder(effect.addElem);
Views.prototype.addEffectEffect = binder(effect.addEffect);
Views.prototype.addEffectListeners = binder(effect.addListeners);

Views.prototype.add = binder(newDisplay);

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
