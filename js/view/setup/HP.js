"use strict";

export function linkHP(views) {
    
  let hpDiv = document.getElementById("hp");
  let hpAttribute = views.controller.attributes.get("hp");    
  
  let hpCurrentInput = hpDiv.querySelector("[data-feature='hp-current']");
  hpCurrentInput.addEventListener("input", e => hpAttribute.value.current = parseFloat(e.target.value));

  let hpIncrement = hpDiv.querySelector("input[value='+']");
  hpIncrement.addEventListener("click", e => {
    hpAttribute.value.current++;
    hpCurrentInput.value = hpAttribute.value.current;
  })
  
  let hpDecrement = hpDiv.querySelector("input[value='-']");
  hpDecrement.addEventListener("click", e => {
    hpAttribute.value.current--;
    hpCurrentInput.value = hpAttribute.value.current;
  })

  // do we want to link this to the total hp value??

}