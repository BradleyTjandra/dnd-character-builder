import Attribute from "../attributes/Attribute.js";
import Calculation from "./Calculation.js";

// a special class used to link a list of skill proficiencies/expertise
// to the relevant skill proficiency/expertise
// not intended to be useable by users, so I've put into a separate class

export default class ContainsCalculation extends Calculation {

  getGraph() {
    return this.arg1.name;
  }

  set formula(formula) {

    let inOperator = formula.search("%in%");
    if (inOperator == -1) {
      this.isValid = false;
      return;
    }
    let searchString = formula.substring(0, inOperator).trim();
    let searchSet = formula.substring(inOperator + "%in%".length);

    this.op = "contains";
    this.arg1 = searchString.replace(/\s+/g, "").toLowerCase();
    this.arg2 = new Calculation(searchSet, this.attributes);
    if (!this.arg2.getValidity()) this.arg2 = searchSet;
    this.getInputs();

  }

  calculate() {
    let searchSet;
    if (this.arg2 instanceof Calculation) searchSet = this.arg2.calculate();
    else if (this.arg2 instanceof Attribute) searchSet = this.arg2.value;
    else searchSet = this.arg2;

    if (!searchSet) return false;
    if (searchSet instanceof String) return searchSet.search(this.arg1) > -1;
    if (searchSet instanceof Array) {
      // let searchSetIterator = searchSet.keys();
      for (let search of searchSet) {
        let valueToSearch = search?.formula;
        if (!valueToSearch) continue;
        valueToSearch = valueToSearch.replace(/\s+/g, "").toLowerCase();
        if (valueToSearch.search(this.arg1) > -1) return true;
        // if (valueToSearch.search(this.arg1) > -1) return true;
      }
      return false;
    }

    console.log(this.arg2);
    throw "Unexpected type";
    
  }
  
}