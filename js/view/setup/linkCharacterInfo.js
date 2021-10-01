"use strict";

export default function linkCharacterInfo() {
  linkName.call(this);
}

function linkName() {
  let elem = document.getElementById("character-name");
  let attribute = this.controller.attributes.get("name");
  elem.oninput = (() => attribute.setValue(elem.value));
  this.add(elem, attribute, "input-text");
  elem.value = attribute.value;
}