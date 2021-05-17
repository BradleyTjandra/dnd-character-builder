"use strict";

class Calculation {
  
  bracketingEndings = {
    "(" : ")",
    "[" : "]",
    "{" : "}",
    "if(" : ")",
  };

  constructor(formula, attributes, source) {
    this.attributes = attributes;
    this.formula = formula.trim();
    this.inputs = [];
    this.getInputs();
    this.source = source;
  }

  set formula(formula) {

    this.isValid = true;
    this.parseFormula(formula);
    this.getInputs();

  }

  getValidity() {
    
    if (!this.isValid) return false;
    
    let validity = true;

    if (this.arg1 instanceof Calculation) {
      validity = validity & this.arg1.getValidity();
    }

    if (this.arg2 instanceof Calculation) {
      validity = validity & this.arg2.getValidity();
    }

    return(validity);

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


    if (!this.getValidity()) {
      return undefined;
    } else if (this.op == "attribute") {
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
    } else if (this.op == "if") {
      let cond = this.arg1.calculate();
      if (cond == "0" || cond == 0 || cond == "false") return (this.arg3.calculate());
      if (this.arg1.calculate()) return (this.arg2.calculate());
      return (this.arg3.calculate());
    } else if (this.op == ">") {
      return(+this.arg1.calculate() > this.arg2.calculate());
    } else if (this.op == "<") {
      return(+this.arg1.calculate() < this.arg2.calculate());
    } else if (this.op == "=" || this.op == "==") {
      return(+this.arg1.calculate() == this.arg2.calculate());
    } else if (this.op == ">=") {
      return(+this.arg1.calculate() >= this.arg2.calculate());
    } else if (this.op == "<=") {
      return(+this.arg1.calculate() <= this.arg2.calculate());
    } else if (this.op == "!=") {
      return(+this.arg1.calculate() != this.arg2.calculate());
    }

  }

  nextCharCompare(string, pattern, from=0) {
    return(string.substr(from, pattern.length) == pattern);
  }

  splitAt(string, index, length) {
    return ([
      string.substr(index, length),
      new Calculation(string.substr(0, index), this.attributes, this),
      new Calculation(string.substring(index + length), this.attributes, this)
    ]);
  }

  isExitingGrouping(substr, stack, otherStacks) {

    // we haven't entered the group, so can't exit
    if (stack.length == 0) return false;

    // not a symbol to exit the group
    let closingSymbol = this.bracketingEndings[stack[0].symbol];
    if (!this.nextCharCompare(substr, closingSymbol)) return false;

    // we are exiting a different grouping 
    let mostRecentGroupEntry = otherStacks.reduce( (accum, stack) => {

      if (stack.length == 0) return accum;
      if (stack[0].symbol != closingSymbol) return accum;
      return(Math.max(accum,stack));

    }, -1);
    // let mostRecentGroupEntryPerStack = otherStacks.map( stack => stack[0]?.idx ?? -1)
    // let mostRecentGroupEntry = mostRecentGroupEntryPerStack.reduce(Math.max, -1);
    if (stack[0].start < mostRecentGroupEntry) return false;

    return true;

    // let isInBracketGroup = bracketStack[0].idx > (ifGroupStack[0]?.idx ?? -1) ; 
    // isEndOfBracketGroup = isUnbracketing && isInBracketGroup;

  }

  parseFormula(formula) {

    this.op = undefined;
    this.arg1 = undefined;
    this.arg2 = undefined;
    this.arg3 = undefined;

    if (formula == "{{null_op}}") {
      this.op = "null";
      return;
    } else if (formula == "") {
      this.isValid = false;
      this.op = "invalid";
      return;
    }

    let workingBracketStack = []; // what bracketing level we are at while parsing
    let latestBracketGroup;
    let workingIfStack = [];
    let latestIfGroup;
    let attributeBracketLevel = 0;
    let currentIfGroupOpening = 0;
    let firstTwoCharEq, firstCompare, firstMultDiv, firstPlusMinus,
    firstFeatBracketGroupStart, firstFeatBracketGroupEnd;

    for (let i = 0; i < formula.length; i++) {

      let substr = formula.substr(i);
      
      // Bracketing
      if (this.nextCharCompare(substr, "(")) {
        workingBracketStack.unshift( {"start" : i, "symbol" : substr[0]} );
        continue;
      } else if (this.isExitingGrouping(substr, workingBracketStack, [workingIfStack])) {
        latestBracketGroup = workingBracketStack.shift();
        latestBracketGroup.end = i;
      }

      if (workingBracketStack.length > 0) continue;

      // Attribute bracketing
      if (this.nextCharCompare(substr, "{{")) {
        attributeBracketLevel++;
        firstFeatBracketGroupStart = firstFeatBracketGroupStart ?? i;
        currentIfGroupOpening = 0;
      } else if (this.nextCharCompare(substr, "}}")) {
        attributeBracketLevel--;
        firstFeatBracketGroupEnd = firstFeatBracketGroupEnd ?? i;
      }

      if (attributeBracketLevel > 0) continue;

      // if statements
      if (this.nextCharCompare(substr.toLowerCase(), "if(")) {

        workingIfStack.unshift( {"start" : i, "symbol" : "if("} );

        // skip the "if(" characters
        i = i + 2;
        continue;

      } else if (this.nextCharCompare(substr, ",")) {

        let currentIfGrouping = workingIfStack[workingIfStack.length-1];
        if (!currentIfGrouping) break;

        if(!currentIfGrouping.comma1) currentIfGrouping.comma1 = i;
        else if (!currentIfGrouping.comma2) currentIfGrouping.comma2 = i;
        
      } else if (this.isExitingGrouping(substr, workingIfStack, [workingBracketStack])) {

        // is this close bracket already "claimed" by the bracket grouping?
        if (latestBracketGroup?.end != i || latestBracketGroup?.symbol != "(") {
          latestIfGroup = workingIfStack.shift();
          latestIfGroup.end = i;
        }
      }

      // Other symbols
      if (this.nextCharCompare(substr, ">=") 
            || this.nextCharCompare(substr, "<=") 
            || this.nextCharCompare(substr, "!=")
            || this.nextCharCompare(substr, "==")) {
        firstTwoCharEq = firstTwoCharEq ?? i;
      } else if (this.nextCharCompare(substr, "=") 
            || this.nextCharCompare(substr, ">") 
            || this.nextCharCompare(substr, "<")) {
        firstCompare = firstCompare ?? i;
      } else if (this.nextCharCompare(substr, "*") || this.nextCharCompare(substr, "/")) {
        firstMultDiv = firstMultDiv ?? i;
      } else if (this.nextCharCompare(substr, "+") || this.nextCharCompare(substr, "-")) {
        firstPlusMinus = firstPlusMinus ?? i;
      }
    }

    if (latestBracketGroup?.start == 0 && latestBracketGroup?.end == formula.length-1) {
      this.op = "enbracket";
      this.arg1 = new Calculation(formula.slice(1, formula.length - 1), this.attributes, this);
      this.arg2 = new Calculation("{{null_op}}");
    } else if (firstFeatBracketGroupStart == 0 && firstFeatBracketGroupEnd == formula.length-2) {
      this.op = "attribute";
      let attributeName = formula.slice(2, formula.length - 2);
      if (!this.attributes.contains(attributeName)) {
        this.isValid = false;
        return;
      }
      this.arg1 = this.attributes.get(formula.slice(2, formula.length - 2));
      this.arg2 = new Calculation("{{null_op}}");
    } else if (latestIfGroup?.start == 0 && latestIfGroup?.end == formula.length-1) {
      this.op = "if";
      this.arg1 = new Calculation(formula.slice(3, latestIfGroup?.comma1), this.attributes);
      this.arg2 = new Calculation(formula.slice(latestIfGroup?.comma1+1, latestIfGroup?.comma2), this.attributes);
      this.arg3 = new Calculation(formula.slice(latestIfGroup?.comma2+1, formula.length-1), this.attributes);
    } else if (firstTwoCharEq) {
      [this.op, this.arg1, this.arg2] = this.splitAt(formula, firstTwoCharEq, 2);
    } else if (firstPlusMinus || firstMultDiv || firstCompare) {
      let firstSymbol = firstPlusMinus || firstMultDiv || firstCompare;
      [this.op, this.arg1, this.arg2] = this.splitAt(formula, firstSymbol, 1);
    } else {
      this.op = "id";
      this.arg1 = formula;
      this.arg2 = new Calculation("{{null_op}}");
    }

  }

  getGraph() {

    if (!this.isValid) return "";

    if (this.op == "null") return "";

    if (this.op == "id") return this.arg1;

    if (this.op == "attribute") return this.arg1.name;

    if (this.op == "if") {
      return ({
        "op" : this.op,
        "arg1" : this.arg1.getGraph(),
        "arg2" : this.arg2.getGraph(),
        "arg3" : this.arg3.getGraph()
      });
    }

    return ({
      "op" : this.op,
      "arg1" : this.arg1.getGraph(),
      "arg2" : this.arg2.getGraph()
    });
  }

}
