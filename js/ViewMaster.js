"use strict";

class ViewMaster {

  abilityScores = ["str", "dex", "con", "wis", "cha", "int"];

  constructor(controller) {

    this.controller = controller;
    this.ViewList = [];

    this.setupViews();
    this.setupBaseAbilityScores();

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
      let attribute = this.controller.attributeList["base-ability-score-"+ability];
      attribute.setValue(value);

    });

  }

  setupViews() {

    this.ViewList = Object.assign(
      this.setupTotalAbilityScoreViews(),
      new View(
        document.getElementById("feature-descriptions"), 
        this.controller, 
        this.controller.attributeList["all-features-descriptions"],
        "features")
    )

    document.getElementById("feature-list").onclick = this.onClickFeatureList.bind(this);

  }

  setupTotalAbilityScoreViews() {

    let scores = [];

    let elem, attribute, view;

    for (let ability of this.abilityScores) {
      
      elem = document.getElementById("ability-score-"+ability+"-span");
      attribute = this.controller.attributeList[ability];
      view = new View(elem, this.controller, attribute);
      scores.push(view);

      elem = document.getElementById("ability-mod-"+ability+"-span");
      attribute = this.controller.attributeList[ability+"mod"];
      view = new View(elem, this.controller, attribute, "signed value");
      scores.push(view);

    }

    return(scores);

  }
  
  onClickFeatureList(event) {

    let button = event.target.closest("input[type=button]");
    
    if (button) {

      if (button.dataset.input == "add-feature") this.addFeature(event);
      // if (button.dataset.input == "del-feature") this.deleteFeature(event);

    }

  }

  addFeature(e) {

    // Create new feature div
    let featureElem = document.getElementById("hidden-feature").cloneNode(true);
    featureElem.hidden = false;
    featureElem.removeAttribute("id");
    
    let parentElem = e.target.closest("div[data-feature=all]");
    featureElem.dataset.featureType = parentElem.dataset.featureType;

    let buttonDiv = e.target.closest("div[data-feature=add-feature");
    buttonDiv.before(featureElem);

    // false so that the button scrolls into view at button
    buttonDiv.scrollIntoView(false); 

    // create an effect for a text description of the feature
    let featureDescriptions = this.controller.attributeList["all-features-descriptions"];    
    let featDescEffect = new Effect(this.controller.attributeList, featureElem);
    // let featDescEffect = new Effect(featureDescriptions, blankInfo, this.controller.attributeList, featureElem);
    featDescEffect.setDetails(featureDescriptions, undefined)
    // featureDescriptions.addInput(featDescEffect); 

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
      featDescEffect.removeListeningAttributes();
    })

    let effectDiv = featureElem.querySelector("div[data-feature='effect']")
    this.setupEffectListeners(effectDiv);


  }

  setupEffectListeners(div) {

    if (div.data?.feature != "effect") return;
    
    let effect = new Effect(this.controller.attributeList, div);
    // let effect = 

    let effectAttr = div.querySelector("input[data-effect='effect-attribute']");
    effectAttr.addEventListener("change", e => {
      
      let attributeName = e.target.value;
      
      if (!(attributeName in this.controller.attributeList)) return;

      if (effect.isSetup & effect.attribute.name == attributeName) return;

      effect.removeListeningAttributes();

      effect.attribute = this.controller.attributeList[e.target.value];
      // effect.effectInfo = 

    });

  }
  
  updateModel(attribute, data) {
    attribute.setValue(data);
  }  

}