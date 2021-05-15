"use strict";

let controller = new Controller();
let view = new ViewMaster(controller);
view.refreshViews();

window.onUnload = controller.saveInfo();