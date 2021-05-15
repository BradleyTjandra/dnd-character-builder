"use strict";

class Attributes {
  
  abilityScores = ["str", "dex", "con", "wis", "cha", "int"];

  constructor() {

    this.attributeList = [];

  }

  loadAttributes(attributes) {
    
    if (!attributes) return;

    for (let attributeData of Object.values(attributes)) {

      let attribute = this.add(attributeData.name, attributeData.calcType);
      attribute.setValue(attributeData.value);

    }

  }

  createAttributesList() {

    this.createAbilityScoreAttributes(value => "base-ability-score-"+value, "fixed");
    this.createAbilityScoreAttributes(value => value, "calculated");
    this.createAbilityScoreAttributes(value => value+"mod", "calculated");

    this.add("all-features-descriptions", "concat");
    this.add("speed", "calculated");

  }

  get(name) {

    return(this.attributeList[name]);

  }

  add(name, calcType, overwrite = false) {

    if (name in this.attributeList && !overwrite) return false;

    let attribute = new Attribute(name, calcType);

    this.attributeList[name] = attribute;

    return (attribute);

  }

  createAbilityScoreAttributes(attributeNameTemplate, calcType) {

    this.abilityScores.forEach( (ability) => {

      let attrName = attributeNameTemplate(ability);
      this.add(attrName, calcType);

    });

  }

  getSaveInfo() {

    let listOfAttributes = Object.values(this.attributeList);

    let attributeSaveInfo = listOfAttributes.reduce( 
      (o, attribute) => Object.assign(o, attribute.getSaveInfo() ), {} 
    );

    return(attributeSaveInfo);

  }

  contains(name) {
    
    return(name in this.attributeList);

  }


  // loadCharacterSheet() {

  //   characterSheetData = JSON.parse(localStorage.getItem("characterSheet"));

  //   if (characterSheetData) {

  //     this.loadAttributes(characterSheetData?.attributes);

  //   }

  // }

  // loadAttributes(attributes) {
    
  //   if (!attributes) return;

  //   for (let attribute of attributes) {



  //   }

  // }

  // createAttributesList() {

  //   this.attributeList = Object.assign(
  //     this.createAbilityScoreAttributes(value => "base-ability-score-"+value, "fixed"),
  //     this.createAbilityScoreAttributes(value => value, "calculated"),
  //     this.createAbilityScoreAttributes(value => value+"mod", "calculated"),
  //     {"all-features-descriptions" : new Attribute("all-features-descriptions", "concat")},
  //     {"speed" : new Attribute("speed", "calculated")}
  //   );

  // }

  // setupEffectsBetweenAttributes() {

  //   this.setupTotalAbilityScoreAttributes();

  // }

  

  // createAbilityScoreAttributes(attributeNameTemplate, calcType) {

  //   let abilityScoreAttributes = Object.fromEntries(
  //     this.abilityScores.map(value => [
  //       attributeNameTemplate(value), 
  //       new Attribute(attributeNameTemplate(value), calcType)
  //     ])
  //   );

  //   return(abilityScoreAttributes);

  // }

  // setupTotalAbilityScoreAttributes() {
    
  //   function pairAbilityScores(value) {

  //     this.effects.add(value, `{{base-ability-score-${value}}}`, this, "calculated");
  //     this.effects.add(`${value}mod`, `({{${value}}}-10)/2`, this, "calculated");

  //   }

  //   this.abilityScores.forEach(pairAbilityScores.bind(this));

  // }

  // getSaveInfo() {

  //   let listOfAttributes = Object.values(this.attributeList);

  //   let attributeSaveInfo = listOfAttributes.reduce( 
  //     (o, attribute) => Object.assign(o, attribute.getSaveInfo() ), {} 
  //   );

  //   let saveInfo = {
  //     "attributes" : attributeSaveInfo,
  //     "effects" : this.effects.getSaveInfo()
  //   };

  //   return(saveInfo);

  // }

  // saveInfo() {

  //   localStorage.characterSheet = JSON.stringify(this.getSaveInfo());

  // }


  
}