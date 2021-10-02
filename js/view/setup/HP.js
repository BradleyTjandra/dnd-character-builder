"use strict";

export function linkHP(views) {
    
  let div = document.getElementById("hp");
  let attribute = views.controller.attributes.get("hp");    
  
  let current = div.querySelector("[data-feature='hp-current']");
  current.addEventListener("input", e => attribute.value.current = parseFloat(e.target.value));

  let hpIncrement = div.querySelector("input[value='+']");
  hpIncrement.addEventListener("click", e => {
    attribute.value.current++;
    current.value = attribute.value.current;
  })
  
  let hpDecrement = div.querySelector("input[value='-']");
  hpDecrement.addEventListener("click", e => {
    attribute.value.current--;
    current.value = attribute.value.current;
  })

}