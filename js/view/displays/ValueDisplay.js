"use strict";

import { Display } from "./Display.js";

export default class ValueDisplay extends Display {

  update() {
    this.elem.textContent = this.linkedAttribute.value;
  }

}