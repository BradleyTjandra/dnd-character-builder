"use strict";

export class View {

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

      let value = this.linkedAttribute.value;
      if (value == 0) return;
      this.elem.innerHTML = value.reduce( (accumulator, item) => {
        if (!item) return accumulator;
        if (item["name"].replace(" ", "") == "" && item["description"].replace(" ", "") == "") {
          return(`${accumulator}<div></div>`);
        }
        return(`${accumulator}<div><b><i>${item["name"] +"." ?? "" }</i></b> ${item['description'] ?? "" }</div>`);
      }, "");

    } else if (this.viewType == "input-text") {

      this.elem.value = this.linkedAttribute.value;

    } else if (this.viewType == "join") {

      let value = this.linkedAttribute.value;
      if (value == 0) return;
      this.elem.innerHTML = value.filter( x => x != "").join(", ");

    } else if (this.viewType == "resource") {

      let value = this.linkedAttribute.value;

      let currentElem = this.elem.querySelector("[data-feature*='current']");
      let totalElem = this.elem.querySelector("[data-feature*='total']");

      currentElem.value = (value.current ?? 0);
      totalElem.innerHTML = (value.total ?? 0);

    }

  }

}