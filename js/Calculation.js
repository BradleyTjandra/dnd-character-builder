"use strict";

class Calculation {
  
  constructor(formula, attributeList, source) {
    this.attributeList = attributeList;
    this.formula = formula.trim();
    this.inputs = [];
    this.getInputs();
    this.source = source;
  }

  set formula(formula) {

    this.parseFormula(formula);
    this.getInputs();

  }

  getInputs() {

    let union = new Set();

    if (this.op == "attribute") union.add(this.arg1);

    if (this.arg1 instanceof Calculation) {
      for (let inp of this.arg1.getInputs())  {
        if (inp) union.add(inp);
      }
    }
    
    if (this.arg2 instanceof Calculation) {
      for (let inp of this.arg2.getInputs()) {
        if (inp) union.add(inp);
      }
    }
    
    this.inputs = union;
    return union;

  }

  calculate() {
    
    if (this.op == "attribute") {
      return this.arg1.value;
    } else if (this.op == "id" && this.arg1.trim() == "") {
      return(0);
    } else if (this.op == "id") {
      return(this.arg1);
    } else if (this.op == "enbracket") {
      return(this.arg1.calculate());
    } else if (this.op == "+") {
      return(+this.arg1.calculate() + Number(this.arg2.calculate()));
    } else if (this.op == "-") {
      return(+this.arg1.calculate() - this.arg2.calculate());
    } else if (this.op == "*") {
      return(+this.arg1.calculate() * this.arg2.calculate());
    } else if (this.op == "/") {
      return(Math.floor(+this.arg1.calculate() / this.arg2.calculate()));
    }

  }

  nextCharCompare(string, pattern, from=0) {
    return(string.substr(from, pattern.length) == pattern);
  }

  splitAt(string, index, length) {
    return ([
      string.substr(index, length),
      new Calculation(string.substr(0, index), this.attributeList, this),
      new Calculation(string.substring(index + length), this.attributeList, this)
    ]);
  }

  parseFormula(formula) {

    this.op = undefined;
    this.arg1 = undefined;
    this.arg2 = undefined;

    if (formula == "{{null_op}}") {
      this.op = "null";
      return;
    }

    let bracketLevel = 0;
    let attributeBracketLevel = 0;
    let firstMultDiv, firstPlusMinus, firstBracketGroupStart, firstBracketGroupEnd,
    firstFeatBracketGroupStart, firstFeatBracketGroupEnd;

    for (let i = 0; i < formula.length; i++) {

      let substr = formula.substr(i);
      
      // Bracketing
      if (this.nextCharCompare(substr, "(")) {
        bracketLevel++;
        firstBracketGroupStart = firstBracketGroupStart ?? i;
      } else if (this.nextCharCompare(substr, ")")) {
        bracketLevel--;
        if (bracketLevel == 0) firstBracketGroupEnd = firstBracketGroupEnd ?? i;
      }

      if (bracketLevel > 0) continue;

      // Attribute bracketing
      if (this.nextCharCompare(substr, "{{")) {
        attributeBracketLevel++;
        firstFeatBracketGroupStart = firstFeatBracketGroupStart ?? i;
      } else if (this.nextCharCompare(substr, "}}")) {
        attributeBracketLevel--;
        firstFeatBracketGroupEnd = firstFeatBracketGroupEnd ?? i;
      }

      if (attributeBracketLevel > 0) continue;

      // Multiplication
      if (this.nextCharCompare(substr, "*") || this.nextCharCompare(substr, "/")) {
        firstMultDiv = firstMultDiv ?? i;
      } else if (this.nextCharCompare(substr, "+") || this.nextCharCompare(substr, "-")) {
        firstPlusMinus = firstPlusMinus ?? i;
      }

    }

    if (firstBracketGroupStart == 0 && firstBracketGroupEnd == formula.length-1) {
      this.op = "enbracket";
      this.arg1 = new Calculation(formula.slice(1, formula.length - 1), this.attributeList, this);
      this.arg2 = new Calculation("{{null_op}}");
    } else if (firstFeatBracketGroupStart == 0 && firstFeatBracketGroupEnd == formula.length-2) {
      this.op = "attribute";
      this.arg1 = this.attributeList[formula.slice(2, formula.length - 2)];
      this.arg2 = new Calculation("{{null_op}}");
    } else if (firstPlusMinus != undefined) {
      [this.op, this.arg1, this.arg2] = this.splitAt(formula, firstPlusMinus, 1);
    } else if (firstMultDiv != undefined) {
      [this.op, this.arg1, this.arg2] = this.splitAt(formula, firstMultDiv, 1);
    } else {
      this.op = "id";
      this.arg1 = formula;
      this.arg2 = new Calculation("{{null_op}}");
    }

  }

  getGraph() {

    if (this.op == "null") return "";

    if (this.op == "id") return this.arg1;

    if (this.op == "attribute") return this.arg1.name;

    return ({
      "op" : this.op,
      "arg1" : this.arg1.getGraph(),
      "arg2" : this.arg2.getGraph()
    });
  }

}
