"use strict";

let b = new Attribute("hello-there");
b.setValue(3);
let a = new Calculation("{{hello-there}}+8", {"hello-there" : b}, undefined);

// a.getInputs();
// alert(a.inputs.size);
alert(a.calculate());