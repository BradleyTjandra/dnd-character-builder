"use strict";

let controller = new Controller();

window.addEventListener("unload", e => controller.saveInfo());