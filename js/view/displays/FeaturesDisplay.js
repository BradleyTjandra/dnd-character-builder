"use strict";

import { Display } from "./Display.js";

export default class FeaturesDisplay extends Display {

  update() {
    let featuresData = this.linkedAttribute.value;
    if (featuresData == 0) return;

    let table = document.createElement("table");

    for (let row in featuresData.rowId) {
      let rowElem = document.createElement("tr");
      rowElem.dataset.featureSource = row;
      
      let textTd = document.createElement("td");
      textTd.innerHTML = `<div>
        <b><i>
          ${featuresData.name[rowId] +"." ?? "" }
        </i></b> 
        ${featuresData.description[rowId] ?? "" }
        </div>`;
      rowElem.append(textTd);

      let counterTd = document.createElement("td");
      counterTd.innerHTML = "";
      
    }
    
    

    // this.elem.innerHTML = value.reduce( (accumulator, item) => {
    //   if (!item) return accumulator;
    //   if (item["name"].replace(" ", "") == "" && item["description"].replace(" ", "") == "") {
    //     return(`${accumulator}<div></div>`);
    //   }
    //   return(`${accumulator}<div><b><i>${item["name"] +"." ?? "" }</i></b> ${item['description'] ?? "" }</div>`);
    // }, "");
  }

}