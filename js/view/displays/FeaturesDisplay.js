"use strict";

import { Display } from "./Display.js";
import createFromTemplate from "../../helpers/createFromTemplate.js";
// import isEmptyObj from "../../helpers/isEmptyObj.js";

export default class FeaturesDisplay extends Display {

  update() {
    let featuresData = this.linkedAttribute.value;
    if (featuresData == 0) return;

    let table = document.createElement("table");
    
    if (!featuresData.rowId) {
      this.elem.innerHTML = "";
      return;
    }

    for (let rowId of featuresData.rowId) {

      if (this.hasNoFeats(featuresData, rowId)) continue;

      let rowElem = document.createElement("tr");
      rowElem.dataset.featureSource = rowId;
      
      let textTd = this.createTextTd(featuresData, rowId);
      rowElem.append(textTd);

      let counterTd = this.createCounterTd(featuresData, rowId);
      rowElem.append(counterTd);

      table.append(rowElem);
      
    }

    let oldTable = this.elem.firstChild;
    let hasRows = table.querySelector("tr");
    
    // create an empty table with no rows;
    if (!hasRows) table = document.createElement("table");

    if (!oldTable) this.elem.append(table);
    else oldTable.replaceWith(table);
    
  }

  hasNoFeats(featuresData, rowId) {
    if (!/^\s*$/.exec(featuresData.name[rowId])) return false;
    if (!/^\s*$/.exec(featuresData.description[rowId])) return false;
    if (rowId in featuresData.counterTotal) return false;
    return true;
  }

  createTextTd(featuresData, rowId) {
    let td = document.createElement("td");

    let name = featuresData.name[rowId];
    if (!name) name = "";
    if (/[\w\s]$/.test(name)) name += ".";
    
    let description = featuresData.description[rowId];
    if (!description) description = "";
  
    td.innerHTML = `<div><b><i>${name}</i></b>${description}</div>`;
    return(td);
  }

  createCounterTd(featuresData, rowId) {

    let td = document.createElement("td");
    
    if (!(rowId in featuresData.counterTotal)) return td;

    let counters = Object.keys(featuresData.counterTotal[rowId]);
    
    for (let counterId of counters) {
      
      let counterElem = createFromTemplate("template-counter");

      let div = counterElem.querySelector("div[data-feature='counter']")
      div.setAttribute("data-counter-id", counterId);
            
      let total = featuresData.counterTotal[rowId][counterId];
      let totalElem = counterElem.querySelector("[data-feature='total']");
      totalElem.innerHTML = total;

      let nameElem = counterElem.querySelector("[data-feature='name']");
      nameElem.innerHTML = featuresData.counterName[rowId][counterId];

      let curr = featuresData.counterCurrent[rowId][counterId];
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

      td.append(counterElem);

    }
    
    return(td);
    
  }

}