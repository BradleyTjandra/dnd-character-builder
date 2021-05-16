"use strict";

let controller = new Controller();
let view = new ViewMaster(controller);

view.setup();
view.refreshViews();

window.onUnload = controller.saveInfo();