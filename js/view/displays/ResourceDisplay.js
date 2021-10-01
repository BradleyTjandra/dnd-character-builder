"use strict";

import { Display } from "./Display.js";

export default class ResourceDisplay extends Display {

  update() {
    let value = this.linkedAttribute.value;

    let currentElem = this.elem.querySelector("[data-feature*='current']");
    let totalElem = this.elem.querySelector("[data-feature*='total']");

    currentElem.value = (value.current ?? 0);
    totalElem.innerHTML = (value.total ?? 0);
  }

}