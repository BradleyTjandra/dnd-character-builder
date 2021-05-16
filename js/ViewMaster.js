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
    this.effectTree.addNode("stem", "race", "feature-grouping");

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

    this.add(
      document.getElementById("languages"),
      this.controller.attributes.get("languages"),
      "join"
    );

    document.getElementById("feature-list").onclick = this.onClickFeatureList.bind(this);

  }

  loadSaveInfo() {

    
    let characterSheetData = JSON.parse(localStorage.getItem("characterSheet"));
    if (!characterSheetData) return;
    let featuresTree = Object.entries(characterSheetData?.featuresTree);
    if (!featuresTree) return;

    this.loadFeatureTreeNode(document, featuresTree[0]);

  }

  loadFeatureTreeNode(elem, node) {

    // alert("alert: " + node);
    let [key, children] = node;
    let [effectName, type] = key.split(",");
    let childrenElem;

    if (type == "stem") {

      childrenElem = elem.getElementById("feature-list");

    } else if (type == "feature-grouping") {

      childrenElem = elem.querySelector("div[data-feature='all-feature']");
      
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

    if (this.isEmptyObj(children)) return;

    Object.entries(children).forEach( child => this.loadFeatureTreeNode(childrenElem, child));
  }

  isEmptyObj(obj) {
    for (let k in obj) return false;
    return true;
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

  addFeatureElem(featureGroupingElem) {

    // Create new feature div
    let featureElem = document.getElementById("hidden-feature").cloneNode(true);
    featureElem.hidden = false;
    featureElem.removeAttribute("id");
    
    // let parentElem = e.target.closest("div[data-feature=all]");
    let featureType = featureGroupingElem.dataset.featureType;
    featureElem.dataset.featureType = featureType;

    let buttonDiv = featureGroupingElem.querySelector("div[data-feature=add-feature");
    buttonDiv.before(featureElem);

    // false so that the button scrolls into view at button
    buttonDiv.scrollIntoView(false); 

    // set up effect 
    // let effectDiv = featureElem.querySelector("div[data-feature='effect']");
    // effectDiv.dataset.featureType = featureType;
    // effectDiv.removeAttribute("id");

    return(featureElem);

  }

  addFeatureEffect(elem) {

    // create an effect for a text description of the feature
    let featureDescriptions = this.controller.attributes.get("all-features-descriptions");
    let featDescEffect = this.controller.effects.add(featureDescriptions, undefined, "user");
    return(featDescEffect);

  }

  addFeatureListeners(featureElem, effect) {

    featureElem.dataset.effectId = effect.name;

    // Listener for feature name changes
    let featureName = featureElem.querySelector("input[data-feature='feature-name']");
    featureName.addEventListener("input", e => {
      let info = effect.effectInfo ?? {};
      info['name'] = e.target.value;
      effect.effectInfo = info;
    });

    // Listener for feature description changes
    let featureDesc = featureElem.querySelector("textarea[data-feature='feature-description']");
    featureDesc.addEventListener("input", e => {
      let info = effect.effectInfo ?? {};
      info['description'] = e.target.value;
      effect.effectInfo = info;
    });

    // Listener for feature being deleted
    let deleteFeature = featureElem.querySelector("input[data-input='del-feature']");
    deleteFeature.addEventListener("click", e => {
      if (featureElem.hidden) return;
      featureElem.remove();
      this.controller.effects.removeEffect(effect);
      this.effectTree.removeNode(effect.name);
    })

  }

  addEffectElem(effectsElem) {

    let effectElem = document.getElementById("hidden-effect").cloneNode(true);
    effectElem.hidden = false;
    effectElem.removeAttribute("id");

    let addEffectDiv = effectsElem.querySelector("input[data-input='add-effect']").parentNode;
    addEffectDiv.before(effectElem);

    effectElem.dataset.featureType = addEffectDiv.closest("[data-feature]").dataset.featureType;

    return(effectElem);

  }

  addFeature(e) {

    let featureGroupingElem = e.target.closest("div[data-feature='all-feature']");
    let elem = this.addFeatureElem(featureGroupingElem);
    let effect = this.addFeatureEffect(elem);
    this.effectTree.addNode(elem.dataset.featureType, effect.name, "feature");
    this.addFeatureListeners(elem, effect);
  
    // let effectDiv = elem.querySelector("div[data-feature='effect']");
    // this.setupEffectListeners(effectDiv);

  }

  addEffect(e) {

    let effectsElem = e.target.closest("div[data-feature='effect-all']");
    let effectElem = this.addEffectElem(effectsElem);
    let effect = this.controller.effects.add(undefined, undefined, "user", "calculated");
    this.setupEffectListeners(effectElem, effect);


  }

  setupEffectListeners(div, effect) {

    if (div.dataset?.feature != "effect") return;
    
    div.dataset.effectId = effect.name;
    let parentEffect = div.parentNode.closest("[data-effect-id]").dataset.effectId;
    this.effectTree.addNode(parentEffect, effect.name, "effect");

    let effectAttr = div.querySelector("input[data-effect='effect-attribute']");
    effectAttr.addEventListener("input", e => effect.attribute = e.target.value);

    let effectCalc = div.querySelector("input[data-effect='effect-calculation']");
    effectCalc.addEventListener("input", e => effect.effectInfo = e.target.value);

    let effectDel = div.querySelector("input[data-input='del-effect']");
    effectDel.addEventListener("click", e => {
      div.remove();
      this.controller.effects.removeEffect(effect);
      this.effectTree.removeNode(effect.name);
    })

  }
  
  updateModel(attribute, data) {
    attribute.setValue(data);
  }  

  refreshViews() {
    Object.values(this.views).forEach(view => view.update());
  }

}