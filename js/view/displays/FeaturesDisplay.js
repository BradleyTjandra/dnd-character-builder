"use strict";

import { Display } from "./Display.js";

export default class FeaturesDisplay extends Display {

  update() {
    let value = this.linkedAttribute.value;
    if (value == 0) return;
    this.elem.innerHTML = value.reduce( (accumulator, item) => {
      if (!item) return accumulator;
      if (item["name"].replace(" ", "") == "" && item["description"].replace(" ", "") == "") {
        return(`${accumulator}<div></div>`);
      }
      return(`${accumulator}<div><b><i>${item["name"] +"." ?? "" }</i></b> ${item['description'] ?? "" }</div>`);
    }, "");
  }

}