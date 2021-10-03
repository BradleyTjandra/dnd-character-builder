"use strict";

import createFromTemplate from "../../helpers/createFromTemplate.js";
import { Display } from "./Display.js";

export default class HitDiceDisplay extends Display {

  update() {
    let value = this.linkedAttribute.value;
    this.elem.innerHTML = "";

    if (!value) return;
    for (let hd of value.hitDice) {
      let hdElem = createFromTemplate("template-counter");
      let total = value.total[hd] + "d" + hd;
      hdElem.querySelector("[data-feature='total']").innerHTML = total;

      let curr = value.current[hd];
      let currElem = hdElem.querySelector("[data-feature='current']");
      currElem.value = curr;

      let incrElem = hdElem.querySelector("input[value='+']");
      incrElem.addEventListener("click", () => {
        currElem.value = ++this.linkedAttribute.value.current[hd];
      });
      
      let decrElem = hdElem.querySelector("input[value='-']");
      decrElem.addEventListener("click", () => {
        currElem.value = --this.linkedAttribute.value.current[hd];
      })

      this.elem.append(hdElem);
    }
    
  }

}

// function aggregate(cumulative, hitDiceText) {

//   if (hitDiceText.search("d") < 0) return cumulative;

//   let [numDice, hitDie] = hitDiceText.split("d");
  
//   let numDiceInt = parseInt(numDice);
//   let hitDieInt = parseInt(hitDie);

//   if (!numDiceInt) return cumulative;
//   if (!hitDieInt) return cumulative;

//   if (hitDieInt in cumulative) cumulative[hitDieInt] += numDiceInt;
//   else cumulative[hitDieInt] = numDiceInt;

//   return(cumulative);

// }

// function orderHD(a, b) {
//   return(a[0] - b[0]);
// }

// function joinText(hd) {
//   let [hitDie, numDice] = hd;
//   return(numDice + "d" + hitDie);
// }

// function createHdCounter(hd) {
//   let [hitDie, numDice] = hd;
//   let counterElem = createFromTemplate("template-counter");
//   counterElem.querySelector("[data-feature='total']").innerHTML 
//     = numDice + "d" + hitDie;

//   let curr = 0;
//   let currElem = counterElem.querySelector("[data-feature='current']");
//   currElem.setAttribute("value", curr);

//   let incrElem = counterElem.querySelector("input[value='+']");
//   incrElem.addEventListener("click", () => {
//     currElem.setAttribute("value", 
//       ++featuresData.counterCurrent[rowId][counterId]);
//   });
  
//   let decrElem = counterElem.querySelector("input[value='-']");
//   decrElem.addEventListener("click", () => {
//     currElem.setAttribute("value", 
//       --featuresData.counterCurrent[rowId][counterId]);
//   })
// }