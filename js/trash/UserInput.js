"use strict";

import { View } from "./View.js";

export class UserInput extend View {

  constructor(views) {
    this.views = views;
    this.controller = views.controller;
  }

  // add(elem, attribute, viewType) {

  //   let view = new View(elem, attribute, viewType);
  //   this.views[attribute.name] = view;
  //   return(view);

  // }

  // setupViews() {

  //   this.setupTotalAbilityScoreViews();
  //   this.setupSkills();
  //   this.setupSavingThrows();

  //   this.add(
  //       document.getElementById("feature-descriptions"), 
  //       this.controller.attributes.get("all-features-descriptions"),
  //       "features"
  //   );

  //   this.add(
  //     document.getElementById("speed"),
  //     this.controller.attributes.get("speed"),
  //     "value"
  //   );

  //   this.add(
  //     document.getElementById("languages"),
  //     this.controller.attributes.get("languages"),
  //     "join"
  //   );

  //   this.add(
  //     document.getElementById("proficiencies"),
  //     this.controller.attributes.get("proficiencies"),
  //     "join"
  //   );

  //   this.add(
  //     document.getElementById("hp"),
  //     this.controller.attributes.get("hp"),
  //     "resource"
  //   );

  //   this.add(
  //     document.getElementById("prof"),
  //     this.controller.attributes.get("prof"),
  //     "signed value"
  //   );

  //   document.getElementById("feature-list").onclick = this.onClickFeatureList.bind(this);

  // }

  setupSkills() {

    let skillArr = Object.values(this.controller.abilityAndSkills);
    let skills = skillArr.reduce( (a,v) => { a.push(...v); return(a); }, []);
    skills = skills.sort( (a,b) => {
      if (a.symbol > b.symbol) return 1;
      if (a.symbol == b.symbol) return 0;
      if (a.symbol < b.symbol) return -1;
    });
    let skillsElem = document.getElementById("skills");

    let firstSkill = true;

    for (let skill of skills) {

      let span = document.createElement("span");
      span.dataset.skill = skill.symbol;
      span.innerHTML = `${skill.label} `;
      if (firstSkill) {
        firstSkill = false;
      } else {
        span.innerHTML = ", " + span.innerHTML;
      }
      let spanMod = document.createElement("span");
      spanMod.dataset.attribute = skill.symbol;
      span.append(spanMod);
      skillsElem.append(span);

      let attribute = this.controller.attributes.get(skill.symbol+"skill");
      this.add(spanMod, attribute, "signed value");

    };

  }

  setupSavingThrows() {

    let savingThrowsElem = document.getElementById("saving-throws");
    let firstSave = true;

    for (let ability of this.controller.abilityScores) {

      let span = document.createElement("span");
      span.dataset.savingThrow = ability;
      span.innerHTML = ability.toUpperCase()+" ";
      if (firstSave) {
        firstSave = false;
      } else {
        span.innerHTML = ", " + span.innerHTML;
      }
      let spanMod = document.createElement("span");
      spanMod.dataset.attribute = ability+"save";
      span.append(spanMod);
      savingThrowsElem.append(span);

      let attribute = this.controller.attributes.get(ability+"save");
      this.add(spanMod, attribute, "signed value");

    }

  }

  loadSaveInfo() {

    
    let characterSheetData = JSON.parse(localStorage.getItem("characterSheet"));
    if (!characterSheetData) return;
    let featuresTree = characterSheetData?.featuresTree;
    
    // if there was no race or background in the saved info, we load elems for them here
    for (let component of ["race", "background"]) {

      if (featuresTree != undefined) {
        if (!this.isEmptyObj(featuresTree["stem,stem"][component+",character-component"])) continue;
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

    if (this.isEmptyObj(children)) return;

    Object.entries(children).forEach( child => this.loadFeatureTreeNode(childrenElem, child) );
    
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
      if (button.dataset.input == "add-feature-group") this.addFeatureGroup(event);

    }

  }

  addFeatureElem(featureGroupingElem) {

    // Create new feature div
    let featureElem = document.getElementById("hidden-feature").cloneNode(true);
    featureElem.hidden = false;
    featureElem.removeAttribute("id");
    
    let featureType = featureGroupingElem.dataset.featureType;
    featureElem.dataset.featureType = featureType;

    let addFeatureButton = featureGroupingElem.querySelector("input[data-input='add-feature']");
    addFeatureButton.before(featureElem);

    // false so that the button scrolls into view at button
    addFeatureButton.scrollIntoView(false); 

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
  
  }

  addEffect(e) {

    let effectsElem = e.target.closest("div[data-feature='effect-all']");
    let effectElem = this.addEffectElem(effectsElem);
    let effect = this.controller.effects.add(undefined, undefined, "user", "calculated");
    this.setupEffectListeners(effectElem, effect);

  }
  
  addFeatureGroup(e) {
    
    let classGroupingElem = e.target.closest("div[data-feature='character-component']");
    let featureGroup = this.addFeatureGroupElem(classGroupingElem);
    let effect = this.addFeatureGroupEffect(featureGroup);
    this.setupFeatureGroupListeners(featureGroup, effect);
    
  }

  addFeatureGroupEffect(elem) {

    let featureType = elem.dataset.featureType;
    let effect = this.controller.effects.add(featureType+"-name", "", "user", "fixed");
    return(effect);

  }

  addFeatureGroupElem(characterComponentElem) {

    let classElem = document.getElementById("hidden-all-feature").cloneNode(true);
    classElem.hidden = false;
    classElem.removeAttribute("id");

    let parentElem = characterComponentElem.closest("[data-feature-type]");
    classElem.dataset.featureType = parentElem.dataset.featureType;

    let addClassButton = characterComponentElem.querySelector("input[data-input='add-feature-group']");
    if (addClassButton) addClassButton.before(classElem);
    else parentElem.append(classElem);
    
    return(classElem);
    
  }

  setupFeatureGroupListeners(elem, effect) {

    elem.dataset.effectId = effect.name;
    this.effectTree.addNode(elem.dataset.featureType, effect.name, "feature-grouping");
    let featureGroupElem = elem.querySelector("input[data-feature='feature-group-name']");
    featureGroupElem.addEventListener("input", e => effect.effectInfo = e.target.value);


  }

  setupEffectListeners(div, effect) {

    if (div.dataset?.feature != "effect") return;
    
    div.dataset.effectId = effect.name;
    let parentEffect = div.parentNode.closest("[data-effect-id]").dataset.effectId;
    this.effectTree.addNode(parentEffect, effect.name, "effect");

    let effectAttr = div.querySelector("input[data-effect='effect-attribute']");
    effectAttr.addEventListener("input", e => {
      effect.attribute = e.target.value;
      if (e.target.value == "hp") {
        effect.effectType = "calculated resource-total";
      } else {
        effect.effectType = "calculated"
      };
    });

    let effectCalc = div.querySelector("input[data-effect='effect-calculation']");
    effectCalc.addEventListener("input", e => effect.effectInfo = e.target.value);

    let effectDel = div.querySelector("input[data-input='del-effect']");
    effectDel.addEventListener("click", e => {
      div.remove();
      this.controller.effects.removeEffect(effect);
      this.effectTree.removeNode(effect.name);
    })

  }

  setupHP() {
    
    let hpDiv = document.getElementById("hp");
    let hpAttribute = this.controller.attributes.get("hp");    
    
    let hpCurrentInput = hpDiv.querySelector("[data-feature='hp-current']");
    hpCurrentInput.addEventListener("input", e => hpAttribute.value.current = parseFloat(e.target.value));

    let hpIncrement = hpDiv.querySelector("input[value='+']");
    hpIncrement.addEventListener("click", e => {
      hpAttribute.value.current++;
      hpCurrentInput.value = hpAttribute.value.current;
    })
    
    let hpDecrement = hpDiv.querySelector("input[value='-']");
    hpDecrement.addEventListener("click", e => {
      hpAttribute.value.current--;
      hpCurrentInput.value = hpAttribute.value.current;
    })


  }
  
  updateModel(attribute, data) {
    attribute.setValue(data);
  }  

  refreshViews() {
    Object.values(this.views).forEach(view => view.update());
  }

}