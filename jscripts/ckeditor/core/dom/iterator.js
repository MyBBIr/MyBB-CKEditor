'use strict';(function(){function iterator(range){if(arguments.length<1)
return;this.range=range;this.forceBrBreak=0;this.enlargeBr=1;this.enforceRealBlocks=0;this._||(this._={});}
var beginWhitespaceRegex=/^[\r\n\t ]+$/,bookmarkGuard=CKEDITOR.dom.walker.bookmark(false,true),whitespacesGuard=CKEDITOR.dom.walker.whitespaces(true),skipGuard=function(node){return bookmarkGuard(node)&&whitespacesGuard(node);};function getNextSourceNode(node,startFromSibling,lastNode){var next=node.getNextSourceNode(startFromSibling,null,lastNode);while(!bookmarkGuard(next))
next=next.getNextSourceNode(startFromSibling,null,lastNode);return next;}
iterator.prototype={getNextParagraph:function(blockTag){var block;var range;var isLast;var removePreviousBr,removeLastBr;blockTag=blockTag||'p';if(this._.nestedEditable){block=this._.nestedEditable.iterator.getNextParagraph(blockTag);if(block){this.activeFilter=this._.nestedEditable.iterator.activeFilter;return block;}
this.activeFilter=this.filter;if(startNestedEditableIterator(this,blockTag,this._.nestedEditable.container,this._.nestedEditable.remaining)){this.activeFilter=this._.nestedEditable.iterator.activeFilter;return this._.nestedEditable.iterator.getNextParagraph(blockTag);}else
this._.nestedEditable=null;}
if(!this.range.root.getDtd()[blockTag])
return null;if(!this._.started)
range=startIterator.call(this);var currentNode=this._.nextNode,lastNode=this._.lastNode;this._.nextNode=null;while(currentNode){var closeRange=0,parentPre=currentNode.hasAscendant('pre');var includeNode=(currentNode.type!=CKEDITOR.NODE_ELEMENT),continueFromSibling=0;if(!includeNode){var nodeName=currentNode.getName();if(CKEDITOR.dtd.$block[nodeName]&&currentNode.getAttribute('contenteditable')=='false'){block=currentNode;startNestedEditableIterator(this,blockTag,block);break;}else if(currentNode.isBlockBoundary(this.forceBrBreak&&!parentPre&&{br:1})){if(nodeName=='br')
includeNode=1;else if(!range&&!currentNode.getChildCount()&&nodeName!='hr'){block=currentNode;isLast=currentNode.equals(lastNode);break;}
if(range){range.setEndAt(currentNode,CKEDITOR.POSITION_BEFORE_START);if(nodeName!='br')
this._.nextNode=currentNode;}
closeRange=1;}else{if(currentNode.getFirst()){if(!range){range=this.range.clone();range.setStartAt(currentNode,CKEDITOR.POSITION_BEFORE_START);}
currentNode=currentNode.getFirst();continue;}
includeNode=1;}}else if(currentNode.type==CKEDITOR.NODE_TEXT){if(beginWhitespaceRegex.test(currentNode.getText()))
includeNode=0;}
if(includeNode&&!range){range=this.range.clone();range.setStartAt(currentNode,CKEDITOR.POSITION_BEFORE_START);}
isLast=((!closeRange||includeNode)&&currentNode.equals(lastNode));if(range&&!closeRange){while(!currentNode.getNext(skipGuard)&&!isLast){var parentNode=currentNode.getParent();if(parentNode.isBlockBoundary(this.forceBrBreak&&!parentPre&&{br:1})){closeRange=1;includeNode=0;isLast=isLast||(parentNode.equals(lastNode));range.setEndAt(parentNode,CKEDITOR.POSITION_BEFORE_END);break;}
currentNode=parentNode;includeNode=1;isLast=(currentNode.equals(lastNode));continueFromSibling=1;}}
if(includeNode)
range.setEndAt(currentNode,CKEDITOR.POSITION_AFTER_END);currentNode=getNextSourceNode(currentNode,continueFromSibling,lastNode);isLast=!currentNode;if(isLast||(closeRange&&range))
break;}
if(!block){if(!range){this._.docEndMarker&&this._.docEndMarker.remove();this._.nextNode=null;return null;}
var startPath=new CKEDITOR.dom.elementPath(range.startContainer,range.root);var startBlockLimit=startPath.blockLimit,checkLimits={div:1,th:1,td:1};block=startPath.block;if(!block&&startBlockLimit&&!this.enforceRealBlocks&&checkLimits[startBlockLimit.getName()]&&range.checkStartOfBlock()&&range.checkEndOfBlock()&&!startBlockLimit.equals(range.root))
block=startBlockLimit;else if(!block||(this.enforceRealBlocks&&block.getName()=='li')){block=this.range.document.createElement(blockTag);range.extractContents().appendTo(block);block.trim();range.insertNode(block);removePreviousBr=removeLastBr=true;}else if(block.getName()!='li'){if(!range.checkStartOfBlock()||!range.checkEndOfBlock()){block=block.clone(false);range.extractContents().appendTo(block);block.trim();var splitInfo=range.splitBlock();removePreviousBr=!splitInfo.wasStartOfBlock;removeLastBr=!splitInfo.wasEndOfBlock;range.insertNode(block);}}else if(!isLast){this._.nextNode=(block.equals(lastNode)?null:getNextSourceNode(range.getBoundaryNodes().endNode,1,lastNode));}}
if(removePreviousBr){var previousSibling=block.getPrevious();if(previousSibling&&previousSibling.type==CKEDITOR.NODE_ELEMENT){if(previousSibling.getName()=='br')
previousSibling.remove();else if(previousSibling.getLast()&&previousSibling.getLast().$.nodeName.toLowerCase()=='br')
previousSibling.getLast().remove();}}
if(removeLastBr){var lastChild=block.getLast();if(lastChild&&lastChild.type==CKEDITOR.NODE_ELEMENT&&lastChild.getName()=='br'){if(!CKEDITOR.env.needsBrFiller||lastChild.getPrevious(bookmarkGuard)||lastChild.getNext(bookmarkGuard))
lastChild.remove();}}
if(!this._.nextNode)
this._.nextNode=(isLast||block.equals(lastNode)||!lastNode)?null:getNextSourceNode(block,1,lastNode);return block;}};function startIterator(){var range=this.range.clone(),touchPre;range.shrink(CKEDITOR.SHRINK_ELEMENT,true);touchPre=range.endContainer.hasAscendant('pre',true)||range.startContainer.hasAscendant('pre',true);range.enlarge(this.forceBrBreak&&!touchPre||!this.enlargeBr?CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:CKEDITOR.ENLARGE_BLOCK_CONTENTS);if(!range.collapsed){var walker=new CKEDITOR.dom.walker(range.clone()),ignoreBookmarkTextEvaluator=CKEDITOR.dom.walker.bookmark(true,true);walker.evaluator=ignoreBookmarkTextEvaluator;this._.nextNode=walker.next();walker=new CKEDITOR.dom.walker(range.clone());walker.evaluator=ignoreBookmarkTextEvaluator;var lastNode=walker.previous();this._.lastNode=lastNode.getNextSourceNode(true);if(this._.lastNode&&this._.lastNode.type==CKEDITOR.NODE_TEXT&&!CKEDITOR.tools.trim(this._.lastNode.getText())&&this._.lastNode.getParent().isBlockBoundary()){var testRange=this.range.clone();testRange.moveToPosition(this._.lastNode,CKEDITOR.POSITION_AFTER_END);if(testRange.checkEndOfBlock()){var path=new CKEDITOR.dom.elementPath(testRange.endContainer,testRange.root),lastBlock=path.block||path.blockLimit;this._.lastNode=lastBlock.getNextSourceNode(true);}}
if(!this._.lastNode||!range.root.contains(this._.lastNode)){this._.lastNode=this._.docEndMarker=range.document.createText('');this._.lastNode.insertAfter(lastNode);}
range=null;}
this._.started=1;return range;}
function getNestedEditableIn(editablesContainer,remainingEditables){if(remainingEditables==undefined)
remainingEditables=findNestedEditables(editablesContainer);var editable;while((editable=remainingEditables.shift())){if(isIterableEditable(editable))
return{element:editable,remaining:remainingEditables};}
return null;}
function isIterableEditable(editable){return editable.getDtd().p;}
function findNestedEditables(container){var editables=[];container.forEach(function(element){if(element.getAttribute('contenteditable')=='true'){editables.push(element);return false;}},CKEDITOR.NODE_ELEMENT,true);return editables;}
function startNestedEditableIterator(parentIterator,blockTag,editablesContainer,remainingEditables){var editable=getNestedEditableIn(editablesContainer,remainingEditables);if(!editable)
return 0;var filter=CKEDITOR.filter.instances[editable.element.data('cke-filter')];if(filter&&!filter.check(blockTag))
return startNestedEditableIterator(parentIterator,blockTag,editablesContainer,editable.remaining);var range=new CKEDITOR.dom.range(editable.element);range.selectNodeContents(editable.element);var iterator=range.createIterator();iterator.enlargeBr=parentIterator.enlargeBr;iterator.enforceRealBlocks=parentIterator.enforceRealBlocks;iterator.activeFilter=iterator.filter=filter;parentIterator._.nestedEditable={element:editable.element,container:editablesContainer,remaining:editable.remaining,iterator:iterator};return 1;}
CKEDITOR.dom.range.prototype.createIterator=function(){return new iterator(this);};})();