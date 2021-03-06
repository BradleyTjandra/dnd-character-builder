"use strict";

export function linkOtherAttributes(views) {

  let attributes = views.controller.attributes;

  views.add(
      document.getElementById("feature-descriptions"), 
      attributes.get("features-list"),
      "features"
  );

  views.add(
    document.getElementById("inventory-descriptions"), 
    attributes.get("inventory"),
    "features"
  );

  views.add(
    document.getElementById("speed"),
    attributes.get("speed"),
    "value"
  );

  views.add(
    document.getElementById("languages"),
    attributes.get("languages"),
    "join"
  );

  views.add(
    document.getElementById("proficiencies"),
    attributes.get("proficiencies"),
    "join"
  );

  views.add(
    document.getElementById("prof"),
    attributes.get("prof"),
    "signed value"
  );

  views.add(
    document.getElementById("hitdice"),
    attributes.get("hitdice"),
    "hitdice"
  );

  views.add(
    document.getElementById("ac"),
    attributes.get("ac"),
    "value"
  );

}

