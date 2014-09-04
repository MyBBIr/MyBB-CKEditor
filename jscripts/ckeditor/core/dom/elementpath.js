'use strict';(function(){var pathBlockLimitElements={},pathBlockElements={},tag;for(tag in CKEDITOR.dtd.$blockLimit){if(!(tag in CKEDITOR.dtd.$list))
pathBlockLimitElements[tag]=1;}
for(tag in CKEDITOR.dtd.$block){if(!(tag in CKEDITOR.dtd.$blockLimit||tag in CKEDITOR.dtd.$empty))
pathBlockElements[tag]=1;}
function checkHasBlock(element){var childNodes=element.getChildren();for(var i=0,count=childNodes.count();i<count;i++){var child=childNodes.getItem(i);if(child.type==CKEDITOR.NODE_ELEMENT&&CKEDITOR.dtd.$block[child.getName()])
return true;}
return false;}
CKEDITOR.dom.elementPath=function(startNode,root){var block=null,blockLimit=null,elements=[],e=startNode,elementName;root=root||startNode.getDocument().getBody();do{if(e.type==CKEDITOR.NODE_ELEMENT){elements.push(e);if(!this.lastElement){this.lastElement=e;if(e.is(CKEDITOR.dtd.$object)||e.getAttribute('contenteditable')=='false')
continue;}
if(e.equals(root))
break;if(!blockLimit){elementName=e.getName();if(e.getAttribute('contenteditable')=='true')
blockLimit=e;else if(!block&&pathBlockElements[elementName])
block=e;if(pathBlockLimitElements[elementName]){if(!block&&elementName=='div'&&!checkHasBlock(e))
block=e;else
blockLimit=e;}}}}
while((e=e.getParent()));if(!blockLimit)
blockLimit=root;this.block=block;this.blockLimit=blockLimit;this.root=root;this.elements=elements;};})();CKEDITOR.dom.elementPath.prototype={compare:function(otherPath){var thisElements=this.elements;var otherElements=otherPath&&otherPath.elements;if(!otherElements||thisElements.length!=otherElements.length)
return false;for(var i=0;i<thisElements.length;i++){if(!thisElements[i].equals(otherElements[i]))
return false;}
return true;},contains:function(query,excludeRoot,fromTop){var evaluator;if(typeof query=='string')
evaluator=function(node){return node.getName()==query;};if(query instanceof CKEDITOR.dom.element)
evaluator=function(node){return node.equals(query);};else if(CKEDITOR.tools.isArray(query))
evaluator=function(node){return CKEDITOR.tools.indexOf(query,node.getName())>-1;};else if(typeof query=='function')
evaluator=query;else if(typeof query=='object')
evaluator=function(node){return node.getName()in query;};var elements=this.elements,length=elements.length;excludeRoot&&length--;if(fromTop){elements=Array.prototype.slice.call(elements,0);elements.reverse();}
for(var i=0;i<length;i++){if(evaluator(elements[i]))
return elements[i];}
return null;},isContextFor:function(tag){var holder;if(tag in CKEDITOR.dtd.$block){var inter=this.contains(CKEDITOR.dtd.$intermediate);holder=inter||(this.root.equals(this.block)&&this.block)||this.blockLimit;return!!holder.getDtd()[tag];}
return true;},direction:function(){var directionNode=this.block||this.blockLimit||this.root;return directionNode.getDirection(1);}};