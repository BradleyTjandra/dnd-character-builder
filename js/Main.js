"use strict";

import { Controller } from "./Controller.js"

let controller = new Controller();

window.addEventListener("unload", e => controller.saveInfo());

// This is apparently bad practice, so I will remove this
// before the final result
window.controller = controller;