"use strict";

import createFromTemplate from "../../helpers/createFromTemplate.js";
import { Display } from "./Display.js";

export default class HitDiceDisplay extends Display {

  update() {
    let hitDiceList = this.linkedAttribute.value;
    if (hitDiceList == 0) {
      this.elem.innerHTML = "";
      return;
    }
    let hitDice = hitDiceList.reduce(aggregate, {});
    let hitDiceArr = Object.entries(hitDice).sort(orderHD);
    let hitDiceText = hitDiceArr.map(joinText).join(", ");
    this.elem.innerHTML = hitDiceText;
  }

}

function aggregate(cumulative, hitDiceText) {

  if (hitDiceText.search("d") < 0) return cumulative;

  let [numDice, hitDie] = hitDiceText.split("d");
  
  let numDiceInt = parseInt(numDice);
  let hitDieInt = parseInt(hitDie);

  if (!numDiceInt) return cumulative;
  if (!hitDieInt) return cumulative;

  if (hitDieInt in cumulative) cumulative[hitDieInt] += numDiceInt;
  else cumulative[hitDieInt] = numDiceInt;

  return(cumulative);

}

function orderHD(a, b) {
  return(a[0] - b[0]);
}

function joinText(hd) {
  let [hitDie, numDice] = hd;
  return(numDice + "d" + hitDie);
}

function createHdCounter(hd) {
  let [hitDie, numDice] = hd;
  let counterElem = createFromTemplate("template-counter");
  counterElem.querySelector("[data-feature='total']").innerHTML 
    = numDice + "d" + hitDie;

  let curr = 0;
  let currElem = counterElem.querySelector("[data-feature='current']");
  currElem.setAttribute("value", curr);

  let incrElem = counterElem.querySelector("input[value='+']");
  incrElem.addEventListener("click", () => {
    currElem.setAttribute("value", 
      ++featuresData.counterCurrent[rowId][counterId]);
  });
  
  let decrElem = counterElem.querySelector("input[value='-']");
  decrElem.addEventListener("click", () => {
    currElem.setAttribute("value", 
      --featuresData.counterCurrent[rowId][counterId]);
  })
}