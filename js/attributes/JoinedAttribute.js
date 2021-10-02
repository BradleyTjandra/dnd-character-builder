import Attribute from "./Attribute.js";

export default class JoinedAttribute extends Attribute {

  constructor(name) {
    super(name, "fixed");
  }
  
  calculate() {
    this.value = this.inputs.map(item => item.value);
    this.triggerListeners();
    return(this.value);
  }
  
}