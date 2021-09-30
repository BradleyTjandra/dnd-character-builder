"use strict";

import { View } from "./View.js";
import { linkBaseAbilityScores, linkTotalAbilityScores, linkSavingThrows } 
  from "./view-setup/AbilityScores.js";
import { linkSkills } from "./view-setup/Skills.js";
import { linkOtherAttributes } from "./view-setup/OtherAttributes.js";
import { linkHP } from "./view-setup/HP.js";
import { onClickFeatureList } from "./feature-views/FeatureViews.js";
// import { UserInputs } from "./UserInputs.js";
export class Views {

  abilityScores = ["str", "dex", "con", "wis", "cha", "int"];

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

      if (featuresTree != undefined) {
        if (!isEmptyObj(featuresTree["stem,stem"][component+",character-component"])) continue;
      }

      let characterComponentElem = document.querySelector(`div[data-feature='character-component'][data-feature-type='${component}']`);
      let featureGroupElem  = this.addFeatureGroupElem(characterComponentElem);
      let effect = this.addFeatureGroupEffect(featureGroupElem);
      this.setupFeatureGroupListeners(featureGroupElem, effect);

    }
    
    if (featuresTree) this.loadFeatureTreeNode(document, Object.entries(featuresTree)[0]);

    window.scrollTo(0, 0);

  }

  loadFeatureTreeNode(elem, node) {

    let [key, children] = node;
    let [effectName, type] = key.split(",");
    let childrenElem;

    if (type == "stem") {

      childrenElem = elem.getElementById("feature-list");

    } else if (type == "character-component") {

      childrenElem = elem.querySelector(`div[data-feature='character-component'][data-feature-type='${effectName}']`);

    } else if (type == "feature-grouping") {

      let childrenElem = this.addFeatureGroupElem(elem);
      let effect = this.controller.effects.get(effectName);
      this.setupFeatureGroupListeners(childrenElem, effect);
      childrenElem.querySelector("input[data-feature='feature-group-name']").value = effect.effectInfo;
      
    } else if (type == "feature") {

      // make sure this links to a valid effect
      let effect = this.controller.effects.get(effectName);
      if (!effect) return;

      // add feature elements
      childrenElem = this.addFeatureElem(elem);

      // link feature elements to effect
      this.effectTree.addNode(childrenElem.dataset.featureType, effect.name, "feature");
      this.addFeatureListeners(childrenElem, effect);

      // refresh values from effect info
      childrenElem.querySelector("input[data-feature='feature-name']").value = effect.effectInfo.name;
      childrenElem.querySelector("textarea[data-feature='feature-description']").value = effect.effectInfo.description;

    } else if (type == "effect") {

      // make sure this links to a valid effect
      let effect = this.controller.effects.get(effectName);
      if (!effect) return;

      // add effect elements
      let effectsElem = elem.querySelector("div[data-feature='effect-all']");
      let childrenElem = this.addEffectElem(effectsElem);

      // link effect elements to effect
      this.setupEffectListeners(childrenElem, effect);

      // refresh values from effect info
      childrenElem.querySelector("input[data-effect='effect-attribute']").value = effect.attribute.name;
      childrenElem.querySelector("input[data-effect='effect-calculation']").value = effect.effectInfo;

    }

    if (isEmptyObj(children)) return;

    Object.entries(children).forEach( child => this.loadFeatureTreeNode(childrenElem, child) );
    
  }
   
  updateModel(attribute, data) {
    attribute.setValue(data);
  }  

  refreshViews() {
    Object.values(this.views).forEach(view => view.update());
  }

}

function isEmptyObj(obj) {
  for (let k in obj) return false;
  return true;
}