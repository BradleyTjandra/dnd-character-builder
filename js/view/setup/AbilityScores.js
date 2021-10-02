"use strict";

let abilityScores = ["str", "dex", "con", "int", "wis", "cha", ];

export function linkBaseAbilityScores(views, attributes) {

  let table = document.getElementById("base-ability-scores");
  table.oninput = (e => {
    
    // get base ability score input text box
    let view = e.target.closest('input');
    if (!view) return;
    if (!table.contains(view)) return;
    if (!view.hasAttribute("data-base-ability-score")) return;

    // get value of base ability score
    let value = parseInt(view.value);
    if (view.value == "") value = 0;
    if (isNaN(value)) return;

    // update the base ability score attribute
    let ability = view.dataset.baseAbilityScore;
    let attribute = attributes.get("base-ability-score-"+ability);
    attribute.setValue(value);

  });

  // link base ability score input text box to the base ability score attribute
  // if the attribute is updated (e.g. it is loaded from a saved character copy)
  // we want to update the text box
  let inputElem, attribute;
  for (let ability of abilityScores) { 
    inputElem = document.querySelector(`input[data-base-ability-score='${ability}']`);
    attribute = attributes.get("base-ability-score-"+ability);
    views.add(inputElem, attribute, "input-text");
  }

}

export function linkTotalAbilityScores(views, attributes) {

  let scores = [];

  let elem, attribute, view;

  for (let ability of abilityScores) {
    
    // link ability score views to attributes
    elem = document.getElementById("ability-score-"+ability+"-span");
    attribute = attributes.get(ability);
    view = views.add(elem, attribute, "value");
    scores.push(view);

    // link ability modifier views to attributes
    elem = document.getElementById("ability-mod-"+ability+"-span");
    attribute = attributes.get(ability+"mod");
    view = views.add(elem, attribute, "signed value");
    scores.push(view);

  }

  return(scores);

}

export function linkSavingThrows(views, attributes) {

  let savingThrowsElem = document.getElementById("saving-throws");
  let firstSave = true;

  for (let ability of abilityScores) {

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

    let attribute = attributes.get(ability+"save");
    views.add(spanMod, attribute, "signed value");

  }

}