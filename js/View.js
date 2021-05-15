"use strict";

class View {

  constructor(elem, attribute, viewType = "value") {

    // this.controller = controller;
    this.linkedAttribute = attribute;
    this.elem = elem;
    this.viewType = viewType;

    this.linkedAttribute.linkedViews.push(this);

  }

  update() {

    if (this.viewType == "value") {
      this.elem.textContent = this.linkedAttribute.value;
    } else if (this.viewType == "signed value") {
      let val = this.linkedAttribute.value;
      this.elem.textContent = val >= 0 ? "+" + val : val;
    } else if (this.viewType == "features") {
      this.elem.innerHTML = this.linkedAttribute.value.reduce( (accumulator, item) => {
        if (!item) return accumulator;
        return(`${accumulator}<div><b><i>${item["name"] ?? "" }</i></b> ${item['description'] ?? "" }</div>`);
      }, "");
    } else if (this.viewType == "input-text") {
      this.elem.value = this.linkedAttribute.value;
    }

  }

}