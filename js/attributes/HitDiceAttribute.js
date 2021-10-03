import Attribute from "./Attribute.js";
import { AttributeTypes } from "./Attributes.js";

export default class HitDiceAttribute extends Attribute {

  constructor(name) {
    super(name, AttributeTypes.HITDICE);
    this.reset();
  }

  reset() {
    
    this.oldCurrents = Object.assign(
      {},
      this.value?.current,
      this.oldCurrents,
    );
    this.value = {
      current : {},
      total : {},
      hitDice : [],
    }

  }
  
  calculate() {
    this.reset();
    this.value = this.inputs.reduce(this.aggregate.bind(this), {current : {}, total : {}});
    this.value.hitDice = Object.keys(this.value.total).sort();
    this.triggerListeners();
    return(this.value);
  }

  aggregate(cumulative, input) {
    
    let hitDiceText = String(input.value);

    if (!hitDiceText) return cumulative;
    if (hitDiceText.search("d") < 0) return cumulative;
  
    let [numDice, hitDie] = hitDiceText.split("d");
    
    let numDiceInt = parseInt(numDice);
    let hitDieInt = parseInt(hitDie);
  
    if (!numDiceInt) return cumulative;
    if (!hitDieInt) return cumulative;
  
    let oldCurr = this.oldCurrents[hitDieInt] ?? 0;
  
    if (!(hitDieInt in cumulative.total)) cumulative.total[hitDieInt] = 0;
    cumulative.current[hitDieInt] = oldCurr;
    cumulative.total[hitDieInt] += numDiceInt;
  
    return(cumulative);
  
  }

  setValue(value) {
    this.oldCurrents = (value?.counterCurrent) ?? {};
    super.setValue(value);
  }
  
}