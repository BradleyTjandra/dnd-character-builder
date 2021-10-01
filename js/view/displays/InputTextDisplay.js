"use strict";

import { Display } from "./Display.js";

export default class InputTextDisplay extends Display {

  update() {
    this.elem.value = this.linkedAttribute.value;
  }

}