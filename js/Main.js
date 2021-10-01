"use strict";

import { Controller } from "./controller/Controller.js"

let controller = new Controller();


// window.addEventListener("beforeunload", controller.saveInfo);

let saveInfoHandler = function() { controller.saveInfo(); };
window.addEventListener("beforeunload", saveInfoHandler);

// This is apparently bad practice, so I will remove this
// once we launch
window["controller"] = controller;

// Some temporary helper to clear the cache
let deleteButton = document.getElementById("big-red-delete");
deleteButton.onclick = function(e) {
  let result = confirm("This will clear the cache - are you sure?");
  if (!result) return;
  window.removeEventListener("beforeunload", saveInfoHandler);
  localStorage.removeItem("characterSheet");
}