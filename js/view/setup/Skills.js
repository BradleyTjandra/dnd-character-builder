"use strict";

export function linkSkills(views) {

  let skillArr = Object.values(views.controller.abilityAndSkills);
  let skills = skillArr.reduce( (a,v) => { a.push(...v); return(a); }, []);
  skills = skills.sort( (a,b) => {
    if (a.symbol > b.symbol) return 1;
    if (a.symbol == b.symbol) return 0;
    if (a.symbol < b.symbol) return -1;
  });
  let skillsElem = document.getElementById("skills");

  let firstSkill = true;

  for (let skill of skills) {

    let span = document.createElement("span");
    span.dataset.skill = skill.symbol;
    span.innerHTML = `${skill.label} `;
    if (firstSkill) {
      firstSkill = false;
    } else {
      span.innerHTML = ", " + span.innerHTML;
    }
    let spanMod = document.createElement("span");
    spanMod.dataset.attribute = skill.symbol;
    span.append(spanMod);
    skillsElem.append(span);

    let attribute = views.controller.attributes.get(skill.symbol+"skill");
    views.add(spanMod, attribute, "signed value");

  };

}