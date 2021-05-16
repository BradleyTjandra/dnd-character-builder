"use strict";

class EffectTree {

  constructor() {

    this.nodes = {
      "stem" : this.newNode("stem"),
    };

  }

  newNode(effect) {

    return({
      "effect" : effect,
      "parent" : undefined,
      "children" : [] 
    });

  }

  addNode(parent, effect) {

    let node = this.newNode(effect);

    let parentNode = this.nodes[parent];
    node.parent = parentNode;

    parentNode.children.push(node);

    this.nodes[effect] = node;

  }

  removeNode(effect) {

    let node = this.nodes[effect];
    let idx = node.parent.children.findIndex(node => node.effect == effect);
    node.parent.children.splice(idx, 1);

    for (let child in node.children) {
      this.removeNode(child.name);
    }

    delete this.nodes[effect];
    
  }

  getSubtree(effect) {

    if (!(effect in this.nodes)) {
      alert("can't find " + effect);
      return;
    }
    let node = this.nodes[effect];
    let arr = node.children.map(child => this.getSubtree(child.effect));
    let result = Object.assign({}, ...arr);
    return({[effect] : result});

  }

  getTree() {

    return(this.getSubtree("stem"));

  }



}