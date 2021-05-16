"use strict";

class ViewMaster {

  abilityScores = ["str", "dex", "con", "wis", "cha", "int"];

  constructor(controller) {

    this.controller = controller;
    this.views = {};

  }

  setup() {

    this.setupViews();
    this.setupBaseAbilityScores();
    this.setupEffectTree();

  }

  setupEffectTree() {

    this.effectTree = new EffectTree();
    this.effectTree.addNode("stem", "race");

  }

  setupBaseAbilityScores() {

    let table = document.getElementById("base-ability-scores");
    table.oninput = (e => {
      
      let view = e.target.closest('input');
      if (!view) return;
      if (!table.contains(view)) return;
      if (!view.hasAttribute("data-base-ability-score")) return;

      let value = parseInt(view.value);
      if (view.value == "") value = 0;
      if (isNaN(value)) return;

      let ability = view.dataset.baseAbilityScore;
      let attribute = this.controller.attributes.get("base-ability-score-"+ability);
      attribute.setValue(value);

    });

    let inputElem, attribute;
    for (let ability of this.controller.abilityScores) { 
      inputElem = document.querySelector(`input[data-base-ability-score='${ability}']`);
      attribute = this.controller.attributes.get("base-ability-score-"+ability);
      this.add(inputElem, attribute, "input-text");
    }

  }

  add(elem, attribute, viewType) {

    let view = new View(elem, attribute, viewType);
    this.views[attribute.name] = view;
    return(view);

  }

  setupViews() {

    this.setupTotalAbilityScoreViews();

    this.add(
        document.getElementById("feature-descriptions"), 
        this.controller.attributes.get("all-features-descriptions"),
        "features");

    this.add(
      document.getElementById("speed"),
      this.controller.attributes.get("speed"),
      "value"
    );

    document.getElementById("feature-list").onclick = this.onClickFeatureList.bind(this);

  }

  setupTotalAbilityScoreViews() {

    let scores = [];

    let elem, attribute, view;

    for (let ability of this.abilityScores) {
      
      elem = document.getElementById("ability-score-"+ability+"-span");
      attribute = this.controller.attributes.get(ability);
      view = this.add(elem, attribute, "value");
      scores.push(view);

      elem = document.getElementById("ability-mod-"+ability+"-span");
      attribute = this.controller.attributes.get(ability+"mod");
      view = this.add(elem, attribute, "signed value");
      scores.push(view);

    }

    return(scores);

  }
  
  onClickFeatureList(event) {

    let button = event.target.closest("input[type=button]");
    
    if (button) {
      
      if (button.dataset.input == "add-feature") this.addFeature(event);
      if (button.dataset.input == "add-effect") this.addEffect(event);

    }

  }

  addFeature(e) {

    // Create new feature div
    let featureElem = document.getElementById("hidden-feature").cloneNode(true);
    featureElem.hidden = false;
    featureElem.removeAttribute("id");
    
    let parentElem = e.target.closest("div[data-feature=all]");
    let featureType = parentElem.dataset.featureType;
    featureElem.dataset.featureType = featureType;

    let buttonDiv = e.target.closest("div[data-feature=add-feature");
    buttonDiv.before(featureElem);

    // false so that the button scrolls into view at button
    buttonDiv.scrollIntoView(false); 

    // create an effect for a text description of the feature
    let featureDescriptions = this.controller.attributes.get("all-features-descriptions");
    let featDescEffect = this.controller.effects.add(featureDescriptions, undefined, featureElem);
    featureElem.dataset.effectId = featDescEffect.name;
    this.effectTree.addNode(featureType, featDescEffect.name);

    // Listener for feature name changes
    let featureName = featureElem.querySelector("input[data-feature='feature-name']");
    featureName.addEventListener("input", e => {
      let info = featDescEffect.effectInfo ?? {};
      info['name'] = e.target.value;
      featDescEffect.effectInfo = info;
    });

    // Listener for feature description changes
    let featureDesc = featureElem.querySelector("textarea[data-feature='feature-description']");
    featureDesc.addEventListener("input", e => {
      let info = featDescEffect.effectInfo ?? {};
      info['description'] = e.target.value;
      featDescEffect.effectInfo = info;
    });

    // Listener for feature being deleted
    let deleteFeature = featureElem.querySelector("input[data-input='del-feature']");
    deleteFeature.addEventListener("click", e => {
      if (featureElem.hidden) return;
      featureElem.remove();
      this.controller.effects.removeEffect(featDescEffect);
      this.effectTree.removeNode(featDescEffect.name);
    })

    let effectDiv = featureElem.querySelector("div[data-feature='effect']");
    effectDiv.dataset.featureType = featureType;
    effectDiv.removeAttribute("id");
    this.setupEffectListeners(effectDiv);


  }

  addEffect(e) {

    let effectElem = document.getElementById("hidden-effect").cloneNode(true);
    effectElem.hidden = false;
    effectElem.removeAttribute("id");

    let addEffectDiv = e.target.closest("input[data-input='add-effect']").parentNode;
    addEffectDiv.before(effectElem);

    effectElem.dataset.featureType = addEffectDiv.closest("[data-feature]").dataset.featureType;

    this.setupEffectListeners(effectElem);


  }

  setupEffectListeners(div) {

    if (div.dataset?.feature != "effect") return;
    
    let effect = this.controller.effects.add(undefined, undefined, div, "calculated");
    div.dataset.effectId = effect.name;
    let parentEffect = div.closest("[data-effect-id]").dataset.effectId;
    this.effectTree.addNode(parentEffect, effect.name);

    let effectAttr = div.querySelector("input[data-effect='effect-attribute']");
    effectAttr.addEventListener("input", e => effect.attribute = e.target.value);

    let effectCalc = div.querySelector("input[data-effect='effect-calculation']");
    effectCalc.addEventListener("input", e => effect.effectInfo = e.target.value);

    let effectDel = div.querySelector("input[data-input='del-effect']");
    effectDel.addEventListener("click", e => {
      div.remove();
      this.controller.effects.removeEffect(effect);
    })

  }
  
  updateModel(attribute, data) {
    attribute.setValue(data);
  }  

  refreshViews() {

    Object.values(this.views).forEach(view => view.update());

  }

  // getSaveInfo() {

  //   let saveInfo = {};


  //   let featureList = document.getElementById("feature-list");
  //   saveInfo = this.getChildren(featureList);

  //   return(saveInfo);

  // }

  // getChildren(elem) {

  //   let children = elem.querySelectorAll("[data-feature]");
  //   let results = [];
    
  //   for (let child in children) {

  //     results.push({
  //       "inputType" : child.dataset.dataFeature,
  //       "featureType" : child.dataset.featureType,
  //       "effect" : child.dataset?.effectId,
  //       "children" : this.getChildren(child),
  //     });

  //   }

  //   return(results);

  // }

}