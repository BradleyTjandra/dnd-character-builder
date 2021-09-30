"use strict";

class EffectTreeNode {

  constructor(effectName, parent, effectsTree) {

    this.effect = effectName;
    this.effectsTree = effectsTree;
    this.parent = parent;
    if (this.parent instanceof EffectTreeNode) {
      this.parent.children.push(this);
    } 
    this.children = [];

  }

  getChild(effectName) {
    this.children.find(node => node.effect == effectName);
  }

  getLength() {
    return(this.children.length);
  }

  removeChild(effectName) {

    let idx = this.children.findIndex(node => node.effect == effectName);
    this.children.splice(idx, 1);

  }

  setChild(effect) {



  }

}