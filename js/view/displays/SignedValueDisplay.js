"use strict";

import { Display } from "./Display.js";

export default class SignedValueDisplay extends Display {

  update() {
    let val = this.linkedAttribute.value;
    this.elem.textContent = val >= 0 ? "+" + val : val;
  }

}