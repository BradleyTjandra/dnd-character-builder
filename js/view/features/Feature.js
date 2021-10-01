"use strict";

export function addFeature(e, views) {

  let parent = e.target.closest("div[data-feature='all-feature']");
  let elem = addFeatureElem(parent);
  let effect = addFeatureEffect(views);
  views.effectTree.addNode(elem.dataset.featureType, effect.name, "feature");
  addFeatureListeners(elem, effect, views);

}

function addFeatureElem(featureGroupingElem) {

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

function addFeatureEffect(views) {

  // create an effect for a text description of the feature
  let featureDescriptions = views.controller.attributes.get("all-features-descriptions");
  let effect = views.controller.effects.add(featureDescriptions, undefined, "user");
  effect.effectInfo = {'name':'','description':''};
  return(effect);

}

function addFeatureListeners(featureElem, effect) {

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
    views.controller.effects.removeEffect(effect);
    views.effectTree.removeNode(effect.name);
  })

}