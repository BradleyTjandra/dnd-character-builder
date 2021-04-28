"use strict";

class View {

  constructor(elem, controller, attribute, viewType = "value") {

    this.controller = controller;
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

    }

  }

}