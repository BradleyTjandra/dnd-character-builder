"use strict";

class EffectTree {

  constructor() {

    this.nodes = {
      "stem" : this.newNode("stem", "stem"),
    };

  }

  newNode(effect, type) {

    return({
      "effect" : effect,
      "parent" : undefined,
      "children" : [],
      "type" : type
    });

  }

  addNode(parent, effect, type) {

    let node = this.newNode(effect, type);

    let parentNode = this.nodes[parent];
    node.parent = parentNode;

    if (!parentNode) alert(parent);

    parentNode.children.push(node);

    this.nodes[effect] = node;

  }

  removeNode(effect) {

    let node = this.nodes[effect];
    let idx = node.parent.children.findIndex(node => node.effect == effect);
    node.parent.children.splice(idx, 1);

    node.children.forEach( child => this.removeNode(child.effect) );
    
    delete this.nodes[effect];
    
  }

  getSubtree(effect) {

    if (!(effect in this.nodes)) {
      alert("can't find " + effect);
      return;
    }
    let node = this.nodes[effect];
    let arr = node.children.map(child => this.getSubtree(child.effect));
    let nodeInfo = [node.effect, node.type];
    let nodeChildren = Object.assign({}, ...arr);
    return({[[nodeInfo]] : nodeChildren});

  }

  getTree() {

    return(this.getSubtree("stem"));

  }



}