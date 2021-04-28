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
      this.setupTotalAbilityScoreViews()
    )

  }

  setupTotalAbilityScoreViews() {

    let scores = [];

    let elem, attribute, view;

    for (let ability of this.abilityScores) {
      
      elem = document.getElementById("ability-score-"+ability+"-span");
      attribute = this.controller.attributeList["total-ability-score-"+ability];
      view = new View(elem, this.controller, attribute);
      scores.push(view);

      elem = document.getElementById("ability-mod-"+ability+"-span");
      attribute = this.controller.attributeList["total-ability-mod-"+ability];
      view = new View(elem, this.controller, attribute, "signed value");
      scores.push(view);

    }

    return(scores);

  }

  updateModel(attribute, data) {
    attribute.setValue(data);
    // attribute.removeInputs();
  }  

}