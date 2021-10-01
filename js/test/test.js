"use strict";

// let attributes = new Attributes();
// let b = attributes.add("hello-there", "fixed");
// b.setValue(3);
// // let b = new Attribute("hello-there");
// // b.setValue(3);
// // let a = new Calculation("{{hello-there}}+if(4>(3+43),8*(20-3),4/(2-1))", attributes, undefined);
// // let a = new Calculation("{{hello-there}}+8*(20-3)+4/(2-1)", attributes, undefined);
// // let a = new Calculation("(3+2)*4", attributes, undefined);
// let a = new Calculation("if(false,3,if(true,1,2))", attributes, undefined);
// // alert(3+8*17);


// // a.getInputs();
// // alert(a.inputs.size);
// // alert(JSON.stringify(a.getGraph()));
// console.log("calculation: " + a.calculate());

import externalFunc from "./test2.js";

class aClass {

  constructor(name) {
    this.name = name;
  }

  sayYourName() {
    let boundFunc = externalFunc.bind(this)
    return(boundFunc());
  }

}

let anInstance = new aClass("hello!");
// anInstance.sayYourName();

window.anInstance = anInstance;