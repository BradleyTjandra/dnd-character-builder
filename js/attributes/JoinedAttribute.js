import Attribute from "./Attribute.js";
import { AttributeTypes } from "./Attributes.js";

export default class JoinedAttribute extends Attribute {

  constructor(name) {
    super(name, AttributeTypes.JOINED);
  }
  
  calculate() {
    this.value = this.inputs.map(item => item.value);
    this.triggerListeners();
    return(this.value);
  }
  
}