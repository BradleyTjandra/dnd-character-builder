import Attribute from "./Attribute.js";
import { AttributeTypes } from "./Attributes.js";

export default class HitDiceAttribute extends Attribute {

  constructor(name) {
    super(name, AttributeTypes.JOINED);
  }
  
  calculate() {
    // instead of just creating a list, represent as an array of objects 
    // with properties: total, current, hit dice
    this.value = this.inputs.map(item => item.value);
    this.triggerListeners();
    return(this.value);
  }
  
}