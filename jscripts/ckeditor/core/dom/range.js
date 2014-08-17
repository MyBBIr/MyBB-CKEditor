CKEDITOR.dom.range=function(root){this.startContainer=null;this.startOffset=null;this.endContainer=null;this.endOffset=null;this.collapsed=true;var isDocRoot=root instanceof CKEDITOR.dom.document;this.document=isDocRoot?root:root.getDocument();this.root=isDocRoot?root.getBody():root;};(function(){var updateCollapsed=function(range){range.collapsed=(range.startContainer&&range.endContainer&&range.startContainer.equals(range.endContainer)&&range.startOffset==range.endOffset);};var execContentsAction=function(range,action,docFrag,mergeThen){range.optimizeBookmark();var startNode=range.startContainer;var endNode=range.endContainer;var startOffset=range.startOffset;var endOffset=range.endOffset;var removeStartNode;var removeEndNode;if(endNode.type==CKEDITOR.NODE_TEXT)
endNode=endNode.split(endOffset);else{if(endNode.getChildCount()>0){if(endOffset>=endNode.getChildCount()){endNode=endNode.append(range.document.createText(''));removeEndNode=true;}else
endNode=endNode.getChild(endOffset);}}
if(startNode.type==CKEDITOR.NODE_TEXT){startNode.split(startOffset);if(startNode.equals(endNode))
endNode=startNode.getNext();}else{if(!startOffset){startNode=startNode.append(range.document.createText(''),1);removeStartNode=true;}else if(startOffset>=startNode.getChildCount()){startNode=startNode.append(range.document.createText(''));removeStartNode=true;}else
startNode=startNode.getChild(startOffset).getPrevious();}
var startParents=startNode.getParents();var endParents=endNode.getParents();var i,topStart,topEnd;for(i=0;i<startParents.length;i++){topStart=startParents[i];topEnd=endParents[i];if(!topStart.equals(topEnd))
break;}
var clone=docFrag,levelStartNode,levelClone,currentNode,currentSibling;for(var j=i;j<startParents.length;j++){levelStartNode=startParents[j];if(clone&&!levelStartNode.equals(startNode))
levelClone=clone.append(levelStartNode.clone());currentNode=levelStartNode.getNext();while(currentNode){if(currentNode.equals(endParents[j])||currentNode.equals(endNode))
break;currentSibling=currentNode.getNext();if(action==2)
clone.append(currentNode.clone(true));else{currentNode.remove();if(action==1)
clone.append(currentNode);}
currentNode=currentSibling;}
if(clone)
clone=levelClone;}
clone=docFrag;for(var k=i;k<endParents.length;k++){levelStartNode=endParents[k];if(action>0&&!levelStartNode.equals(endNode))
levelClone=clone.append(levelStartNode.clone());if(!startParents[k]||levelStartNode.$.parentNode!=startParents[k].$.parentNode){currentNode=levelStartNode.getPrevious();while(currentNode){if(currentNode.equals(startParents[k])||currentNode.equals(startNode))
break;currentSibling=currentNode.getPrevious();if(action==2)
clone.$.insertBefore(currentNode.$.cloneNode(true),clone.$.firstChild);else{currentNode.remove();if(action==1)
clone.$.insertBefore(currentNode.$,clone.$.firstChild);}
currentNode=currentSibling;}}
if(clone)
clone=levelClone;}
if(action==2)
{var startTextNode=range.startContainer;if(startTextNode.type==CKEDITOR.NODE_TEXT){startTextNode.$.data+=startTextNode.$.nextSibling.data;startTextNode.$.parentNode.removeChild(startTextNode.$.nextSibling);}
var endTextNode=range.endContainer;if(endTextNode.type==CKEDITOR.NODE_TEXT&&endTextNode.$.nextSibling){endTextNode.$.data+=endTextNode.$.nextSibling.data;endTextNode.$.parentNode.removeChild(endTextNode.$.nextSibling);}}else{if(topStart&&topEnd&&(startNode.$.parentNode!=topStart.$.parentNode||endNode.$.parentNode!=topEnd.$.parentNode)){var endIndex=topEnd.getIndex();if(removeStartNode&&topEnd.$.parentNode==startNode.$.parentNode)
endIndex--;if(mergeThen&&topStart.type==CKEDITOR.NODE_ELEMENT){var span=CKEDITOR.dom.element.createFromHtml('<span '+'data-cke-bookmark="1" style="display:none">&nbsp;</span>',range.document);span.insertAfter(topStart);topStart.mergeSiblings(false);range.moveToBookmark({startNode:span});}else
range.setStart(topEnd.getParent(),endIndex);}
range.collapse(true);}
if(removeStartNode)
startNode.remove();if(removeEndNode&&endNode.$.parentNode)
endNode.remove();};var inlineChildReqElements={abbr:1,acronym:1,b:1,bdo:1,big:1,cite:1,code:1,del:1,dfn:1,em:1,font:1,i:1,ins:1,label:1,kbd:1,q:1,samp:1,small:1,span:1,strike:1,strong:1,sub:1,sup:1,tt:1,u:1,'var':1};function getCheckStartEndBlockEvalFunction(){var skipBogus=false,whitespaces=CKEDITOR.dom.walker.whitespaces(),bookmarkEvaluator=CKEDITOR.dom.walker.bookmark(true),isBogus=CKEDITOR.dom.walker.bogus();return function(node){if(bookmarkEvaluator(node)||whitespaces(node))
return true;if(isBogus(node)&&!skipBogus){skipBogus=true;return true;}
if(node.type==CKEDITOR.NODE_TEXT&&(node.hasAscendant('pre')||CKEDITOR.tools.trim(node.getText()).length))
return false;if(node.type==CKEDITOR.NODE_ELEMENT&&!node.is(inlineChildReqElements))
return false;return true;};}
var isBogus=CKEDITOR.dom.walker.bogus(),nbspRegExp=/^[\t\r\n ]*(?:&nbsp;|\xa0)$/,editableEval=CKEDITOR.dom.walker.editable(),notIgnoredEval=CKEDITOR.dom.walker.ignored(true);function elementBoundaryEval(checkStart){var whitespaces=CKEDITOR.dom.walker.whitespaces(),bookmark=CKEDITOR.dom.walker.bookmark(1);return function(node){if(bookmark(node)||whitespaces(node))
return true;return!checkStart&&isBogus(node)||node.type==CKEDITOR.NODE_ELEMENT&&node.is(CKEDITOR.dtd.$removeEmpty);};}
function getNextEditableNode(isPrevious){return function(){var first;return this[isPrevious?'getPreviousNode':'getNextNode'](function(node){if(!first&&notIgnoredEval(node))
first=node;return editableEval(node)&&!(isBogus(node)&&node.equals(first));});};}
CKEDITOR.dom.range.prototype={clone:function(){var clone=new CKEDITOR.dom.range(this.root);clone.startContainer=this.startContainer;clone.startOffset=this.startOffset;clone.endContainer=this.endContainer;clone.endOffset=this.endOffset;clone.collapsed=this.collapsed;return clone;},collapse:function(toStart){if(toStart){this.endContainer=this.startContainer;this.endOffset=this.startOffset;}else{this.startContainer=this.endContainer;this.startOffset=this.endOffset;}
this.collapsed=true;},cloneContents:function(){var docFrag=new CKEDITOR.dom.documentFragment(this.document);if(!this.collapsed)
execContentsAction(this,2,docFrag);return docFrag;},deleteContents:function(mergeThen){if(this.collapsed)
return;execContentsAction(this,0,null,mergeThen);},extractContents:function(mergeThen){var docFrag=new CKEDITOR.dom.documentFragment(this.document);if(!this.collapsed)
execContentsAction(this,1,docFrag,mergeThen);return docFrag;},createBookmark:function(serializable){var startNode,endNode;var baseId;var clone;var collapsed=this.collapsed;startNode=this.document.createElement('span');startNode.data('cke-bookmark',1);startNode.setStyle('display','none');startNode.setHtml('&nbsp;');if(serializable){baseId='cke_bm_'+CKEDITOR.tools.getNextNumber();startNode.setAttribute('id',baseId+(collapsed?'C':'S'));}
if(!collapsed){endNode=startNode.clone();endNode.setHtml('&nbsp;');if(serializable)
endNode.setAttribute('id',baseId+'E');clone=this.clone();clone.collapse();clone.insertNode(endNode);}
clone=this.clone();clone.collapse(true);clone.insertNode(startNode);if(endNode){this.setStartAfter(startNode);this.setEndBefore(endNode);}else
this.moveToPosition(startNode,CKEDITOR.POSITION_AFTER_END);return{startNode:serializable?baseId+(collapsed?'C':'S'):startNode,endNode:serializable?baseId+'E':endNode,serializable:serializable,collapsed:collapsed};},createBookmark2:(function(){function betweenTextNodes(container,offset){if(container.type!=CKEDITOR.NODE_ELEMENT||offset===0||offset==container.getChildCount())
return 0;return container.getChild(offset-1).type==CKEDITOR.NODE_TEXT&&container.getChild(offset).type==CKEDITOR.NODE_TEXT;}
function getLengthOfPrecedingTextNodes(node){var sum=0;while((node=node.getPrevious())&&node.type==CKEDITOR.NODE_TEXT)
sum+=node.getLength();return sum;}
function normalize(limit){var container=limit.container,offset=limit.offset;if(betweenTextNodes(container,offset)){container=container.getChild(offset-1);offset=container.getLength();}
if(container.type==CKEDITOR.NODE_ELEMENT&&offset>1)
offset=container.getChild(offset-1).getIndex(true)+1;if(container.type==CKEDITOR.NODE_TEXT)
offset+=getLengthOfPrecedingTextNodes(container);limit.container=container;limit.offset=offset;}
return function(normalized){var collapsed=this.collapsed,bmStart={container:this.startContainer,offset:this.startOffset},bmEnd={container:this.endContainer,offset:this.endOffset};if(normalized){normalize(bmStart);if(!collapsed)
normalize(bmEnd);}
return{start:bmStart.container.getAddress(normalized),end:collapsed?null:bmEnd.container.getAddress(normalized),startOffset:bmStart.offset,endOffset:bmEnd.offset,normalized:normalized,collapsed:collapsed,is2:true};};})(),moveToBookmark:function(bookmark){if(bookmark.is2)
{var startContainer=this.document.getByAddress(bookmark.start,bookmark.normalized),startOffset=bookmark.startOffset;var endContainer=bookmark.end&&this.document.getByAddress(bookmark.end,bookmark.normalized),endOffset=bookmark.endOffset;this.setStart(startContainer,startOffset);if(endContainer)
this.setEnd(endContainer,endOffset);else
this.collapse(true);}else
{var serializable=bookmark.serializable,startNode=serializable?this.document.getById(bookmark.startNode):bookmark.startNode,endNode=serializable?this.document.getById(bookmark.endNode):bookmark.endNode;this.setStartBefore(startNode);startNode.remove();if(endNode){this.setEndBefore(endNode);endNode.remove();}else
this.collapse(true);}},getBoundaryNodes:function(){var startNode=this.startContainer,endNode=this.endContainer,startOffset=this.startOffset,endOffset=this.endOffset,childCount;if(startNode.type==CKEDITOR.NODE_ELEMENT){childCount=startNode.getChildCount();if(childCount>startOffset)
startNode=startNode.getChild(startOffset);else if(childCount<1)
startNode=startNode.getPreviousSourceNode();else
{startNode=startNode.$;while(startNode.lastChild)
startNode=startNode.lastChild;startNode=new CKEDITOR.dom.node(startNode);startNode=startNode.getNextSourceNode()||startNode;}}
if(endNode.type==CKEDITOR.NODE_ELEMENT){childCount=endNode.getChildCount();if(childCount>endOffset)
endNode=endNode.getChild(endOffset).getPreviousSourceNode(true);else if(childCount<1)
endNode=endNode.getPreviousSourceNode();else
{endNode=endNode.$;while(endNode.lastChild)
endNode=endNode.lastChild;endNode=new CKEDITOR.dom.node(endNode);}}
if(startNode.getPosition(endNode)&CKEDITOR.POSITION_FOLLOWING)
startNode=endNode;return{startNode:startNode,endNode:endNode};},getCommonAncestor:function(includeSelf,ignoreTextNode){var start=this.startContainer,end=this.endContainer,ancestor;if(start.equals(end)){if(includeSelf&&start.type==CKEDITOR.NODE_ELEMENT&&this.startOffset==this.endOffset-1)
ancestor=start.getChild(this.startOffset);else
ancestor=start;}else
ancestor=start.getCommonAncestor(end);return ignoreTextNode&&!ancestor.is?ancestor.getParent():ancestor;},optimize:function(){var container=this.startContainer;var offset=this.startOffset;if(container.type!=CKEDITOR.NODE_ELEMENT){if(!offset)
this.setStartBefore(container);else if(offset>=container.getLength())
this.setStartAfter(container);}
container=this.endContainer;offset=this.endOffset;if(container.type!=CKEDITOR.NODE_ELEMENT){if(!offset)
this.setEndBefore(container);else if(offset>=container.getLength())
this.setEndAfter(container);}},optimizeBookmark:function(){var startNode=this.startContainer,endNode=this.endContainer;if(startNode.is&&startNode.is('span')&&startNode.data('cke-bookmark'))
this.setStartAt(startNode,CKEDITOR.POSITION_BEFORE_START);if(endNode&&endNode.is&&endNode.is('span')&&endNode.data('cke-bookmark'))
this.setEndAt(endNode,CKEDITOR.POSITION_AFTER_END);},trim:function(ignoreStart,ignoreEnd){var startContainer=this.startContainer,startOffset=this.startOffset,collapsed=this.collapsed;if((!ignoreStart||collapsed)&&startContainer&&startContainer.type==CKEDITOR.NODE_TEXT){if(!startOffset){startOffset=startContainer.getIndex();startContainer=startContainer.getParent();}
else if(startOffset>=startContainer.getLength()){startOffset=startContainer.getIndex()+1;startContainer=startContainer.getParent();}
else{var nextText=startContainer.split(startOffset);startOffset=startContainer.getIndex()+1;startContainer=startContainer.getParent();if(this.startContainer.equals(this.endContainer))
this.setEnd(nextText,this.endOffset-this.startOffset);else if(startContainer.equals(this.endContainer))
this.endOffset+=1;}
this.setStart(startContainer,startOffset);if(collapsed){this.collapse(true);return;}}
var endContainer=this.endContainer;var endOffset=this.endOffset;if(!(ignoreEnd||collapsed)&&endContainer&&endContainer.type==CKEDITOR.NODE_TEXT){if(!endOffset){endOffset=endContainer.getIndex();endContainer=endContainer.getParent();}
else if(endOffset>=endContainer.getLength()){endOffset=endContainer.getIndex()+1;endContainer=endContainer.getParent();}
else{endContainer.split(endOffset);endOffset=endContainer.getIndex()+1;endContainer=endContainer.getParent();}
this.setEnd(endContainer,endOffset);}},enlarge:function(unit,excludeBrs){var leadingWhitespaceRegex=new RegExp(/[^\s\ufeff]/);switch(unit){case CKEDITOR.ENLARGE_INLINE:var enlargeInlineOnly=1;case CKEDITOR.ENLARGE_ELEMENT:if(this.collapsed)
return;var commonAncestor=this.getCommonAncestor();var boundary=this.root;var startTop,endTop;var enlargeable,sibling,commonReached;var needsWhiteSpace=false;var isWhiteSpace;var siblingText;var container=this.startContainer;var offset=this.startOffset;if(container.type==CKEDITOR.NODE_TEXT){if(offset){container=!CKEDITOR.tools.trim(container.substring(0,offset)).length&&container;needsWhiteSpace=!!container;}
if(container){if(!(sibling=container.getPrevious()))
enlargeable=container.getParent();}}else{if(offset)
sibling=container.getChild(offset-1)||container.getLast();if(!sibling)
enlargeable=container;}
enlargeable=getValidEnlargeable(enlargeable);while(enlargeable||sibling){if(enlargeable&&!sibling){if(!commonReached&&enlargeable.equals(commonAncestor))
commonReached=true;if(enlargeInlineOnly?enlargeable.isBlockBoundary():!boundary.contains(enlargeable))
break;if(!needsWhiteSpace||enlargeable.getComputedStyle('display')!='inline'){needsWhiteSpace=false;if(commonReached)
startTop=enlargeable;else
this.setStartBefore(enlargeable);}
sibling=enlargeable.getPrevious();}
while(sibling){isWhiteSpace=false;if(sibling.type==CKEDITOR.NODE_COMMENT){sibling=sibling.getPrevious();continue;}else if(sibling.type==CKEDITOR.NODE_TEXT){siblingText=sibling.getText();if(leadingWhitespaceRegex.test(siblingText))
sibling=null;isWhiteSpace=/[\s\ufeff]$/.test(siblingText);}else{if((sibling.$.offsetWidth>0||excludeBrs&&sibling.is('br'))&&!sibling.data('cke-bookmark')){if(needsWhiteSpace&&CKEDITOR.dtd.$removeEmpty[sibling.getName()]){siblingText=sibling.getText();if(leadingWhitespaceRegex.test(siblingText))
sibling=null;else{var allChildren=sibling.$.getElementsByTagName('*');for(var i=0,child;child=allChildren[i++];){if(!CKEDITOR.dtd.$removeEmpty[child.nodeName.toLowerCase()]){sibling=null;break;}}}
if(sibling)
isWhiteSpace=!!siblingText.length;}else
sibling=null;}}
if(isWhiteSpace){if(needsWhiteSpace){if(commonReached)
startTop=enlargeable;else if(enlargeable)
this.setStartBefore(enlargeable);}else
needsWhiteSpace=true;}
if(sibling){var next=sibling.getPrevious();if(!enlargeable&&!next){enlargeable=sibling;sibling=null;break;}
sibling=next;}else{enlargeable=null;}}
if(enlargeable)
enlargeable=getValidEnlargeable(enlargeable.getParent());}
container=this.endContainer;offset=this.endOffset;enlargeable=sibling=null;commonReached=needsWhiteSpace=false;function onlyWhiteSpaces(startContainer,startOffset){var walkerRange=new CKEDITOR.dom.range(boundary);walkerRange.setStart(startContainer,startOffset);walkerRange.setEndAt(boundary,CKEDITOR.POSITION_BEFORE_END);var walker=new CKEDITOR.dom.walker(walkerRange),node;walker.guard=function(node,movingOut){return!(node.type==CKEDITOR.NODE_ELEMENT&&node.isBlockBoundary());};while((node=walker.next())){if(node.type!=CKEDITOR.NODE_TEXT){return false;}else{if(node!=startContainer)
siblingText=node.getText();else
siblingText=node.substring(startOffset);if(leadingWhitespaceRegex.test(siblingText))
return false;}}
return true;}
if(container.type==CKEDITOR.NODE_TEXT){if(CKEDITOR.tools.trim(container.substring(offset)).length){needsWhiteSpace=true;}else{needsWhiteSpace=!container.getLength();if(offset==container.getLength()){if(!(sibling=container.getNext()))
enlargeable=container.getParent();}else{if(onlyWhiteSpaces(container,offset))
enlargeable=container.getParent();}}}else{sibling=container.getChild(offset);if(!sibling)
enlargeable=container;}
while(enlargeable||sibling){if(enlargeable&&!sibling){if(!commonReached&&enlargeable.equals(commonAncestor))
commonReached=true;if(enlargeInlineOnly?enlargeable.isBlockBoundary():!boundary.contains(enlargeable))
break;if(!needsWhiteSpace||enlargeable.getComputedStyle('display')!='inline'){needsWhiteSpace=false;if(commonReached)
endTop=enlargeable;else if(enlargeable)
this.setEndAfter(enlargeable);}
sibling=enlargeable.getNext();}
while(sibling){isWhiteSpace=false;if(sibling.type==CKEDITOR.NODE_TEXT){siblingText=sibling.getText();if(!onlyWhiteSpaces(sibling,0))
sibling=null;isWhiteSpace=/^[\s\ufeff]/.test(siblingText);}else if(sibling.type==CKEDITOR.NODE_ELEMENT){if((sibling.$.offsetWidth>0||excludeBrs&&sibling.is('br'))&&!sibling.data('cke-bookmark')){if(needsWhiteSpace&&CKEDITOR.dtd.$removeEmpty[sibling.getName()]){siblingText=sibling.getText();if(leadingWhitespaceRegex.test(siblingText))
sibling=null;else{allChildren=sibling.$.getElementsByTagName('*');for(i=0;child=allChildren[i++];){if(!CKEDITOR.dtd.$removeEmpty[child.nodeName.toLowerCase()]){sibling=null;break;}}}
if(sibling)
isWhiteSpace=!!siblingText.length;}else
sibling=null;}}else
isWhiteSpace=1;if(isWhiteSpace){if(needsWhiteSpace){if(commonReached)
endTop=enlargeable;else
this.setEndAfter(enlargeable);}}
if(sibling){next=sibling.getNext();if(!enlargeable&&!next){enlargeable=sibling;sibling=null;break;}
sibling=next;}else{enlargeable=null;}}
if(enlargeable)
enlargeable=getValidEnlargeable(enlargeable.getParent());}
if(startTop&&endTop){commonAncestor=startTop.contains(endTop)?endTop:startTop;this.setStartBefore(commonAncestor);this.setEndAfter(commonAncestor);}
break;case CKEDITOR.ENLARGE_BLOCK_CONTENTS:case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:var walkerRange=new CKEDITOR.dom.range(this.root);boundary=this.root;walkerRange.setStartAt(boundary,CKEDITOR.POSITION_AFTER_START);walkerRange.setEnd(this.startContainer,this.startOffset);var walker=new CKEDITOR.dom.walker(walkerRange),blockBoundary,tailBr,notBlockBoundary=CKEDITOR.dom.walker.blockBoundary((unit==CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS)?{br:1}:null),inNonEditable=null,boundaryGuard=function(node){if(node.type==CKEDITOR.NODE_ELEMENT&&node.getAttribute('contenteditable')=='false'){if(inNonEditable){if(inNonEditable.equals(node)){inNonEditable=null;return;}}else
inNonEditable=node;}
else if(inNonEditable)
return;var retval=notBlockBoundary(node);if(!retval)
blockBoundary=node;return retval;},tailBrGuard=function(node){var retval=boundaryGuard(node);if(!retval&&node.is&&node.is('br'))
tailBr=node;return retval;};walker.guard=boundaryGuard;enlargeable=walker.lastBackward();blockBoundary=blockBoundary||boundary;this.setStartAt(blockBoundary,!blockBoundary.is('br')&&(!enlargeable&&this.checkStartOfBlock()||enlargeable&&blockBoundary.contains(enlargeable))?CKEDITOR.POSITION_AFTER_START:CKEDITOR.POSITION_AFTER_END);if(unit==CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS){var theRange=this.clone();walker=new CKEDITOR.dom.walker(theRange);var whitespaces=CKEDITOR.dom.walker.whitespaces(),bookmark=CKEDITOR.dom.walker.bookmark();walker.evaluator=function(node){return!whitespaces(node)&&!bookmark(node);};var previous=walker.previous();if(previous&&previous.type==CKEDITOR.NODE_ELEMENT&&previous.is('br'))
return;}
walkerRange=this.clone();walkerRange.collapse();walkerRange.setEndAt(boundary,CKEDITOR.POSITION_BEFORE_END);walker=new CKEDITOR.dom.walker(walkerRange);walker.guard=(unit==CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS)?tailBrGuard:boundaryGuard;blockBoundary=null;enlargeable=walker.lastForward();blockBoundary=blockBoundary||boundary;this.setEndAt(blockBoundary,(!enlargeable&&this.checkEndOfBlock()||enlargeable&&blockBoundary.contains(enlargeable))?CKEDITOR.POSITION_BEFORE_END:CKEDITOR.POSITION_BEFORE_START);if(tailBr)
this.setEndAfter(tailBr);}
function getValidEnlargeable(enlargeable){return enlargeable&&enlargeable.type==CKEDITOR.NODE_ELEMENT&&enlargeable.hasAttribute('contenteditable')?null:enlargeable;}},shrink:function(mode,selectContents,shrinkOnBlockBoundary){if(!this.collapsed){mode=mode||CKEDITOR.SHRINK_TEXT;var walkerRange=this.clone();var startContainer=this.startContainer,endContainer=this.endContainer,startOffset=this.startOffset,endOffset=this.endOffset,collapsed=this.collapsed;var moveStart=1,moveEnd=1;if(startContainer&&startContainer.type==CKEDITOR.NODE_TEXT){if(!startOffset)
walkerRange.setStartBefore(startContainer);else if(startOffset>=startContainer.getLength())
walkerRange.setStartAfter(startContainer);else{walkerRange.setStartBefore(startContainer);moveStart=0;}}
if(endContainer&&endContainer.type==CKEDITOR.NODE_TEXT){if(!endOffset)
walkerRange.setEndBefore(endContainer);else if(endOffset>=endContainer.getLength())
walkerRange.setEndAfter(endContainer);else{walkerRange.setEndAfter(endContainer);moveEnd=0;}}
var walker=new CKEDITOR.dom.walker(walkerRange),isBookmark=CKEDITOR.dom.walker.bookmark();walker.evaluator=function(node){return node.type==(mode==CKEDITOR.SHRINK_ELEMENT?CKEDITOR.NODE_ELEMENT:CKEDITOR.NODE_TEXT);};var currentElement;walker.guard=function(node,movingOut){if(isBookmark(node))
return true;if(mode==CKEDITOR.SHRINK_ELEMENT&&node.type==CKEDITOR.NODE_TEXT)
return false;if(movingOut&&node.equals(currentElement))
return false;if(shrinkOnBlockBoundary===false&&node.type==CKEDITOR.NODE_ELEMENT&&node.isBlockBoundary())
return false;if(node.type==CKEDITOR.NODE_ELEMENT&&node.hasAttribute('contenteditable'))
return false;if(!movingOut&&node.type==CKEDITOR.NODE_ELEMENT)
currentElement=node;return true;};if(moveStart){var textStart=walker[mode==CKEDITOR.SHRINK_ELEMENT?'lastForward':'next']();textStart&&this.setStartAt(textStart,selectContents?CKEDITOR.POSITION_AFTER_START:CKEDITOR.POSITION_BEFORE_START);}
if(moveEnd){walker.reset();var textEnd=walker[mode==CKEDITOR.SHRINK_ELEMENT?'lastBackward':'previous']();textEnd&&this.setEndAt(textEnd,selectContents?CKEDITOR.POSITION_BEFORE_END:CKEDITOR.POSITION_AFTER_END);}
return!!(moveStart||moveEnd);}},insertNode:function(node){this.optimizeBookmark();this.trim(false,true);var startContainer=this.startContainer;var startOffset=this.startOffset;var nextNode=startContainer.getChild(startOffset);if(nextNode)
node.insertBefore(nextNode);else
startContainer.append(node);if(node.getParent()&&node.getParent().equals(this.endContainer))
this.endOffset++;this.setStartBefore(node);},moveToPosition:function(node,position){this.setStartAt(node,position);this.collapse(true);},moveToRange:function(range){this.setStart(range.startContainer,range.startOffset);this.setEnd(range.endContainer,range.endOffset);},selectNodeContents:function(node){this.setStart(node,0);this.setEnd(node,node.type==CKEDITOR.NODE_TEXT?node.getLength():node.getChildCount());},setStart:function(startNode,startOffset){if(startNode.type==CKEDITOR.NODE_ELEMENT&&CKEDITOR.dtd.$empty[startNode.getName()])
startOffset=startNode.getIndex(),startNode=startNode.getParent();this.startContainer=startNode;this.startOffset=startOffset;if(!this.endContainer){this.endContainer=startNode;this.endOffset=startOffset;}
updateCollapsed(this);},setEnd:function(endNode,endOffset){if(endNode.type==CKEDITOR.NODE_ELEMENT&&CKEDITOR.dtd.$empty[endNode.getName()])
endOffset=endNode.getIndex()+1,endNode=endNode.getParent();this.endContainer=endNode;this.endOffset=endOffset;if(!this.startContainer){this.startContainer=endNode;this.startOffset=endOffset;}
updateCollapsed(this);},setStartAfter:function(node){this.setStart(node.getParent(),node.getIndex()+1);},setStartBefore:function(node){this.setStart(node.getParent(),node.getIndex());},setEndAfter:function(node){this.setEnd(node.getParent(),node.getIndex()+1);},setEndBefore:function(node){this.setEnd(node.getParent(),node.getIndex());},setStartAt:function(node,position){switch(position){case CKEDITOR.POSITION_AFTER_START:this.setStart(node,0);break;case CKEDITOR.POSITION_BEFORE_END:if(node.type==CKEDITOR.NODE_TEXT)
this.setStart(node,node.getLength());else
this.setStart(node,node.getChildCount());break;case CKEDITOR.POSITION_BEFORE_START:this.setStartBefore(node);break;case CKEDITOR.POSITION_AFTER_END:this.setStartAfter(node);}
updateCollapsed(this);},setEndAt:function(node,position){switch(position){case CKEDITOR.POSITION_AFTER_START:this.setEnd(node,0);break;case CKEDITOR.POSITION_BEFORE_END:if(node.type==CKEDITOR.NODE_TEXT)
this.setEnd(node,node.getLength());else
this.setEnd(node,node.getChildCount());break;case CKEDITOR.POSITION_BEFORE_START:this.setEndBefore(node);break;case CKEDITOR.POSITION_AFTER_END:this.setEndAfter(node);}
updateCollapsed(this);},fixBlock:function(isStart,blockTag){var bookmark=this.createBookmark(),fixedBlock=this.document.createElement(blockTag);this.collapse(isStart);this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);this.extractContents().appendTo(fixedBlock);fixedBlock.trim();fixedBlock.appendBogus();this.insertNode(fixedBlock);this.moveToBookmark(bookmark);return fixedBlock;},splitBlock:function(blockTag){var startPath=new CKEDITOR.dom.elementPath(this.startContainer,this.root),endPath=new CKEDITOR.dom.elementPath(this.endContainer,this.root);var startBlockLimit=startPath.blockLimit,endBlockLimit=endPath.blockLimit;var startBlock=startPath.block,endBlock=endPath.block;var elementPath=null;if(!startBlockLimit.equals(endBlockLimit))
return null;if(blockTag!='br'){if(!startBlock){startBlock=this.fixBlock(true,blockTag);endBlock=new CKEDITOR.dom.elementPath(this.endContainer,this.root).block;}
if(!endBlock)
endBlock=this.fixBlock(false,blockTag);}
var isStartOfBlock=startBlock&&this.checkStartOfBlock(),isEndOfBlock=endBlock&&this.checkEndOfBlock();this.deleteContents();if(startBlock&&startBlock.equals(endBlock)){if(isEndOfBlock){elementPath=new CKEDITOR.dom.elementPath(this.startContainer,this.root);this.moveToPosition(endBlock,CKEDITOR.POSITION_AFTER_END);endBlock=null;}else if(isStartOfBlock){elementPath=new CKEDITOR.dom.elementPath(this.startContainer,this.root);this.moveToPosition(startBlock,CKEDITOR.POSITION_BEFORE_START);startBlock=null;}else{endBlock=this.splitElement(startBlock);if(!startBlock.is('ul','ol'))
startBlock.appendBogus();}}
return{previousBlock:startBlock,nextBlock:endBlock,wasStartOfBlock:isStartOfBlock,wasEndOfBlock:isEndOfBlock,elementPath:elementPath};},splitElement:function(toSplit){if(!this.collapsed)
return null;this.setEndAt(toSplit,CKEDITOR.POSITION_BEFORE_END);var documentFragment=this.extractContents();var clone=toSplit.clone(false);documentFragment.appendTo(clone);clone.insertAfter(toSplit);this.moveToPosition(toSplit,CKEDITOR.POSITION_AFTER_END);return clone;},removeEmptyBlocksAtEnd:(function(){var whitespace=CKEDITOR.dom.walker.whitespaces(),bookmark=CKEDITOR.dom.walker.bookmark(false);function childEval(parent){return function(node){if(whitespace(node)||bookmark(node)||node.type==CKEDITOR.NODE_ELEMENT&&node.isEmptyInlineRemoveable())
return false;else if(parent.is('table')&&node.is('caption'))
return false;return true;};}
return function(atEnd){var bm=this.createBookmark();var path=this[atEnd?'endPath':'startPath']();var block=path.block||path.blockLimit,parent;while(block&&!block.equals(path.root)&&!block.getFirst(childEval(block)))
{parent=block.getParent();this[atEnd?'setEndAt':'setStartAt'](block,CKEDITOR.POSITION_AFTER_END);block.remove(1);block=parent;}
this.moveToBookmark(bm);};})(),startPath:function(){return new CKEDITOR.dom.elementPath(this.startContainer,this.root);},endPath:function(){return new CKEDITOR.dom.elementPath(this.endContainer,this.root);},checkBoundaryOfElement:function(element,checkType){var checkStart=(checkType==CKEDITOR.START);var walkerRange=this.clone();walkerRange.collapse(checkStart);walkerRange[checkStart?'setStartAt':'setEndAt']
(element,checkStart?CKEDITOR.POSITION_AFTER_START:CKEDITOR.POSITION_BEFORE_END);var walker=new CKEDITOR.dom.walker(walkerRange);walker.evaluator=elementBoundaryEval(checkStart);return walker[checkStart?'checkBackward':'checkForward']();},checkStartOfBlock:function(){var startContainer=this.startContainer,startOffset=this.startOffset;if(CKEDITOR.env.ie&&startOffset&&startContainer.type==CKEDITOR.NODE_TEXT)
{var textBefore=CKEDITOR.tools.ltrim(startContainer.substring(0,startOffset));if(nbspRegExp.test(textBefore))
this.trim(0,1);}
this.trim();var path=new CKEDITOR.dom.elementPath(this.startContainer,this.root);var walkerRange=this.clone();walkerRange.collapse(true);walkerRange.setStartAt(path.block||path.blockLimit,CKEDITOR.POSITION_AFTER_START);var walker=new CKEDITOR.dom.walker(walkerRange);walker.evaluator=getCheckStartEndBlockEvalFunction();return walker.checkBackward();},checkEndOfBlock:function(){var endContainer=this.endContainer,endOffset=this.endOffset;if(CKEDITOR.env.ie&&endContainer.type==CKEDITOR.NODE_TEXT)
{var textAfter=CKEDITOR.tools.rtrim(endContainer.substring(endOffset));if(nbspRegExp.test(textAfter))
this.trim(1,0);}
this.trim();var path=new CKEDITOR.dom.elementPath(this.endContainer,this.root);var walkerRange=this.clone();walkerRange.collapse(false);walkerRange.setEndAt(path.block||path.blockLimit,CKEDITOR.POSITION_BEFORE_END);var walker=new CKEDITOR.dom.walker(walkerRange);walker.evaluator=getCheckStartEndBlockEvalFunction();return walker.checkForward();},getPreviousNode:function(evaluator,guard,boundary){var walkerRange=this.clone();walkerRange.collapse(1);walkerRange.setStartAt(boundary||this.root,CKEDITOR.POSITION_AFTER_START);var walker=new CKEDITOR.dom.walker(walkerRange);walker.evaluator=evaluator;walker.guard=guard;return walker.previous();},getNextNode:function(evaluator,guard,boundary){var walkerRange=this.clone();walkerRange.collapse();walkerRange.setEndAt(boundary||this.root,CKEDITOR.POSITION_BEFORE_END);var walker=new CKEDITOR.dom.walker(walkerRange);walker.evaluator=evaluator;walker.guard=guard;return walker.next();},checkReadOnly:(function(){function checkNodesEditable(node,anotherEnd){while(node){if(node.type==CKEDITOR.NODE_ELEMENT){if(node.getAttribute('contentEditable')=='false'&&!node.data('cke-editable'))
return 0;else if(node.is('html')||node.getAttribute('contentEditable')=='true'&&(node.contains(anotherEnd)||node.equals(anotherEnd)))
break;}
node=node.getParent();}
return 1;}
return function(){var startNode=this.startContainer,endNode=this.endContainer;return!(checkNodesEditable(startNode,endNode)&&checkNodesEditable(endNode,startNode));};})(),moveToElementEditablePosition:function(el,isMoveToEnd){function nextDFS(node,childOnly){var next;if(node.type==CKEDITOR.NODE_ELEMENT&&node.isEditable(false))
next=node[isMoveToEnd?'getLast':'getFirst'](notIgnoredEval);if(!childOnly&&!next)
next=node[isMoveToEnd?'getPrevious':'getNext'](notIgnoredEval);return next;}
if(el.type==CKEDITOR.NODE_ELEMENT&&!el.isEditable(false)){this.moveToPosition(el,isMoveToEnd?CKEDITOR.POSITION_AFTER_END:CKEDITOR.POSITION_BEFORE_START);return true;}
var found=0;while(el){if(el.type==CKEDITOR.NODE_TEXT){if(isMoveToEnd&&this.endContainer&&this.checkEndOfBlock()&&nbspRegExp.test(el.getText()))
this.moveToPosition(el,CKEDITOR.POSITION_BEFORE_START);else
this.moveToPosition(el,isMoveToEnd?CKEDITOR.POSITION_AFTER_END:CKEDITOR.POSITION_BEFORE_START);found=1;break;}
if(el.type==CKEDITOR.NODE_ELEMENT){if(el.isEditable()){this.moveToPosition(el,isMoveToEnd?CKEDITOR.POSITION_BEFORE_END:CKEDITOR.POSITION_AFTER_START);found=1;}
else if(isMoveToEnd&&el.is('br')&&this.endContainer&&this.checkEndOfBlock())
this.moveToPosition(el,CKEDITOR.POSITION_BEFORE_START);else if(el.getAttribute('contenteditable')=='false'&&el.is(CKEDITOR.dtd.$block)){this.setStartBefore(el);this.setEndAfter(el);return true;}}
el=nextDFS(el,found);}
return!!found;},moveToClosestEditablePosition:function(element,isMoveToEnd){var range=new CKEDITOR.dom.range(this.root),found=0,sibling,positions=[CKEDITOR.POSITION_AFTER_END,CKEDITOR.POSITION_BEFORE_START];range.moveToPosition(element,positions[isMoveToEnd?0:1]);if(!element.is(CKEDITOR.dtd.$block))
found=1;else{sibling=range[isMoveToEnd?'getNextEditableNode':'getPreviousEditableNode']();if(sibling){found=1;if(sibling.type==CKEDITOR.NODE_ELEMENT&&sibling.is(CKEDITOR.dtd.$block)&&sibling.getAttribute('contenteditable')=='false'){range.setStartAt(sibling,CKEDITOR.POSITION_BEFORE_START);range.setEndAt(sibling,CKEDITOR.POSITION_AFTER_END);}
else
range.moveToPosition(sibling,positions[isMoveToEnd?1:0]);}}
if(found)
this.moveToRange(range);return!!found;},moveToElementEditStart:function(target){return this.moveToElementEditablePosition(target);},moveToElementEditEnd:function(target){return this.moveToElementEditablePosition(target,true);},getEnclosedNode:function(){var walkerRange=this.clone();walkerRange.optimize();if(walkerRange.startContainer.type!=CKEDITOR.NODE_ELEMENT||walkerRange.endContainer.type!=CKEDITOR.NODE_ELEMENT)
return null;var walker=new CKEDITOR.dom.walker(walkerRange),isNotBookmarks=CKEDITOR.dom.walker.bookmark(false,true),isNotWhitespaces=CKEDITOR.dom.walker.whitespaces(true);walker.evaluator=function(node){return isNotWhitespaces(node)&&isNotBookmarks(node);};var node=walker.next();walker.reset();return node&&node.equals(walker.previous())?node:null;},getTouchedStartNode:function(){var container=this.startContainer;if(this.collapsed||container.type!=CKEDITOR.NODE_ELEMENT)
return container;return container.getChild(this.startOffset)||container;},getTouchedEndNode:function(){var container=this.endContainer;if(this.collapsed||container.type!=CKEDITOR.NODE_ELEMENT)
return container;return container.getChild(this.endOffset-1)||container;},getNextEditableNode:getNextEditableNode(),getPreviousEditableNode:getNextEditableNode(1),scrollIntoView:function(){var reference=new CKEDITOR.dom.element.createFromHtml('<span>&nbsp;</span>',this.document),afterCaretNode,startContainerText,isStartText;var range=this.clone();range.optimize();if(isStartText=range.startContainer.type==CKEDITOR.NODE_TEXT){startContainerText=range.startContainer.getText();afterCaretNode=range.startContainer.split(range.startOffset);reference.insertAfter(range.startContainer);}
else
range.insertNode(reference);reference.scrollIntoView();if(isStartText){range.startContainer.setText(startContainerText);afterCaretNode.remove();}
reference.remove();}};})();CKEDITOR.POSITION_AFTER_START=1;CKEDITOR.POSITION_BEFORE_END=2;CKEDITOR.POSITION_BEFORE_START=3;CKEDITOR.POSITION_AFTER_END=4;CKEDITOR.ENLARGE_ELEMENT=1;CKEDITOR.ENLARGE_BLOCK_CONTENTS=2;CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS=3;CKEDITOR.ENLARGE_INLINE=4;CKEDITOR.START=1;CKEDITOR.END=2;CKEDITOR.SHRINK_ELEMENT=1;CKEDITOR.SHRINK_TEXT=2;