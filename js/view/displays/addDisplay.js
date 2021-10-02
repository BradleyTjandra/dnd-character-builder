import JoinDisplay from "./JoinDisplay.js";
import ValueDisplay from "./ValueDisplay.js";
import FeaturesDisplay from "./FeaturesDisplay.js";
import ResourceDisplay from "./ResourceDisplay.js";
import InputTextDisplay from "./InputTextDisplay.js";
import SignedValueDisplay from "./SignedValueDisplay.js";
import HitDiceDisplay from "./HitDiceDisplay.js"

export default function addDisplay(elem, attribute, viewType) {

  let args = {"elem" : elem, "attribute" : attribute};
  
  let view;
  switch(viewType) {
    case "value":
      view = new ValueDisplay(args);
      break;

    case "signed value":
      view = new SignedValueDisplay(args);
      break;

    case "features":
      view = new FeaturesDisplay(args);
      break;

    case "input-text":
      view = new InputTextDisplay(args);
      break;

    case "join":
      view = new JoinDisplay(args);
      break;

    case "resource":
      view = new ResourceDisplay(args);
      break;
    
    case "hitdice":
      view = new HitDiceDisplay(args);
      break;
    

    default:
      throw new Error("Invalid view type option");
      break;

  }
  this.views[attribute.name] = view;
  return(view);

}