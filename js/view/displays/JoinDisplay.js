"use strict";

import { Display } from "./Display.js";

export default class JoinDisplay extends Display {

  update() {
    let value = this.linkedAttribute.value;
    if (value == 0) return;
    this.elem.innerHTML = value.filter( x => x != "").join(", ");
  }

}