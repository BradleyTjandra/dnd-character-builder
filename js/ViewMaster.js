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
      this.updateModel(attribute, value);

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
    let blankInfo = {
      "name" : "",
      "description" : ""
    }
    let featDescEffect = new Effect(featureDescriptions, blankInfo, this.controller.attributeList, featureElem);
    featureDescriptions.addInput(featDescEffect); 

    // Listener for feature name changes
    let featureName = featureElem.querySelector("input[data-feature='feature-name']");
    featureName.addEventListener("input", e => {
      let info = featDescEffect.effectInfo;
      info['name'] = e.target.value;
      featDescEffect.effectInfo = info;
    });

    // Listener for feature description changes
    let featureDesc = featureElem.querySelector("textarea[data-feature='feature-description']");
    featureDesc.addEventListener("input", e => {
      let info = featDescEffect.effectInfo;
      info['description'] = e.target.value;
      featDescEffect.effectInfo = info;
    });

    // Listener for feature being deleted
    let deleteFeature = featureElem.querySelector("input[data-input='del-feature']");
    deleteFeature.addEventListener("click", e => {
      if (featureElem.hidden) return;
      featureElem.remove();
      featDescEffect.remove();
    })


  }
  
  // deleteFeature(e) {

  //   let featureElem = e.target.closest("div[data-feature=feature-all]");
  //   let featureNum = featureElem.dataset.featureNumber;
  //   let featureType = featureElem.dataset.featureType;

  //   if (featureElem.hidden) return;
  //   featureElem.remove();      

  //   this.controller.delete(featureType, featureNum);

  // }

  updateModel(attribute, data) {
    attribute.setValue(data);
  }  

}