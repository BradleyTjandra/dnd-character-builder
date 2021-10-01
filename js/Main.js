"use strict";

import { Controller } from "./controller/Controller.js"

let controller = new Controller();

window.addEventListener("unload", controller.saveInfo());

// This is apparently bad practice, so I will remove this
// once we launch
window["controller"] = controller;

// Some temporary helper to clear the cache
let deleteButton = document.getElementById("big-red-delete");
deleteButton.onclick = function(e) {
  let result = confirm("This will clear the cache - are you sure?");
  if (!result) return;
  window.removeEventListener("unload", controller.saveInfo);
  localStorage.removeItem("characterSheet");
}