
(function(){function checkSelectionChange(){var sel=this._.fakeSelection,realSel;if(sel){realSel=this.getSelection(1);if(!realSel||!realSel.isHidden()){sel.reset();sel=0;}}
if(!sel){sel=realSel||this.getSelection(1);if(!sel||sel.getType()==CKEDITOR.SELECTION_NONE)
return;}
this.fire('selectionCheck',sel);var currentPath=this.elementPath();if(!currentPath.compare(this._.selectionPreviousPath)){if(CKEDITOR.env.webkit)
this._.previousActive=this.document.getActive();this._.selectionPreviousPath=currentPath;this.fire('selectionChange',{selection:sel,path:currentPath});}}
var checkSelectionChangeTimer,checkSelectionChangeTimeoutPending;function checkSelectionChangeTimeout(){checkSelectionChangeTimeoutPending=true;if(checkSelectionChangeTimer)
return;checkSelectionChangeTimeoutExec.call(this);checkSelectionChangeTimer=CKEDITOR.tools.setTimeout(checkSelectionChangeTimeoutExec,200,this);}
function checkSelectionChangeTimeoutExec(){checkSelectionChangeTimer=null;if(checkSelectionChangeTimeoutPending){CKEDITOR.tools.setTimeout(checkSelectionChange,0,this);checkSelectionChangeTimeoutPending=false;}}
var isVisible=CKEDITOR.dom.walker.invisible(1);function rangeRequiresFix(range){function isTextCt(node,isAtEnd){if(!node||node.type==CKEDITOR.NODE_TEXT)
return false;var testRng=range.clone();return testRng['moveToElementEdit'+(isAtEnd?'End':'Start')](node);}
if(!(range.root instanceof CKEDITOR.editable))
return false;var ct=range.startContainer;var previous=range.getPreviousNode(isVisible,null,ct),next=range.getNextNode(isVisible,null,ct);if(isTextCt(previous)||isTextCt(next,1))
return true;if(!(previous||next)&&!(ct.type==CKEDITOR.NODE_ELEMENT&&ct.isBlockBoundary()&&ct.getBogus()))
return true;return false;}
function createFillingChar(element){removeFillingChar(element,false);var fillingChar=element.getDocument().createText('\u200B');element.setCustomData('cke-fillingChar',fillingChar);return fillingChar;}
function getFillingChar(element){return element.getCustomData('cke-fillingChar');}
function checkFillingChar(element){var fillingChar=getFillingChar(element);if(fillingChar){if(fillingChar.getCustomData('ready'))
removeFillingChar(element);else
fillingChar.setCustomData('ready',1);}}
function removeFillingChar(element,keepSelection){var fillingChar=element&&element.removeCustomData('cke-fillingChar');if(fillingChar){if(keepSelection!==false)
{var bm,doc=element.getDocument(),sel=doc.getSelection().getNative(),range=sel&&sel.type!='None'&&sel.getRangeAt(0);if(fillingChar.getLength()>1&&range&&range.intersectsNode(fillingChar.$)){bm=[sel.anchorOffset,sel.focusOffset];var startAffected=sel.anchorNode==fillingChar.$&&sel.anchorOffset>0,endAffected=sel.focusNode==fillingChar.$&&sel.focusOffset>0;startAffected&&bm[0]--;endAffected&&bm[1]--;isReversedSelection(sel)&&bm.unshift(bm.pop());}}
fillingChar.setText(replaceFillingChar(fillingChar.getText()));if(bm){var rng=sel.getRangeAt(0);rng.setStart(rng.startContainer,bm[0]);rng.setEnd(rng.startContainer,bm[1]);sel.removeAllRanges();sel.addRange(rng);}}}
function replaceFillingChar(html){return html.replace(/\u200B( )?/g,function(match){return match[1]?'\xa0':'';});}
function isReversedSelection(sel){if(!sel.isCollapsed){var range=sel.getRangeAt(0);range.setStart(sel.anchorNode,sel.anchorOffset);range.setEnd(sel.focusNode,sel.focusOffset);return range.collapsed;}}
function fixInitialSelection(root,nativeSel,doFocus){var listener=root.on('focus',function(evt){evt.cancel();},null,null,-100);if(!CKEDITOR.env.ie){var range=new CKEDITOR.dom.range(root);range.moveToElementEditStart(root);var nativeRange=root.getDocument().$.createRange();nativeRange.setStart(range.startContainer.$,range.startOffset);nativeRange.collapse(1);nativeSel.removeAllRanges();nativeSel.addRange(nativeRange);}
else{var listener2=root.getDocument().on('selectionchange',function(evt){evt.cancel();},null,null,-100);}
doFocus&&root.focus();listener.removeListener();listener2&&listener2.removeListener();}
function hideSelection(editor){var style=CKEDITOR.env.ie?'display:none':'position:fixed;top:0;left:-1000px',hiddenEl=CKEDITOR.dom.element.createFromHtml('<div data-cke-hidden-sel="1" data-cke-temp="1" style="'+style+'">&nbsp;</div>',editor.document);editor.fire('lockSnapshot');editor.editable().append(hiddenEl);var sel=editor.getSelection(),range=editor.createRange(),listener=sel.root.on('selectionchange',function(evt){evt.cancel();},null,null,0);range.setStartAt(hiddenEl,CKEDITOR.POSITION_AFTER_START);range.setEndAt(hiddenEl,CKEDITOR.POSITION_BEFORE_END);sel.selectRanges([range]);listener.removeListener();editor.fire('unlockSnapshot');editor._.hiddenSelectionContainer=hiddenEl;}
function removeHiddenSelectionContainer(editor){var hiddenEl=editor._.hiddenSelectionContainer;if(hiddenEl){editor.fire('lockSnapshot');hiddenEl.remove();editor.fire('unlockSnapshot');}
delete editor._.hiddenSelectionContainer;}
var fakeSelectionDefaultKeystrokeHandlers=(function(){function leave(right){return function(evt){var range=evt.editor.createRange();if(range.moveToClosestEditablePosition(evt.selected,right))
evt.editor.getSelection().selectRanges([range]);return false;};}
function del(right){return function(evt){var editor=evt.editor,range=editor.createRange(),found;if(!(found=range.moveToClosestEditablePosition(evt.selected,right)))
found=range.moveToClosestEditablePosition(evt.selected,!right);if(found)
editor.getSelection().selectRanges([range]);editor.fire('saveSnapshot');evt.selected.remove();if(!found){range.moveToElementEditablePosition(editor.editable());editor.getSelection().selectRanges([range]);}
editor.fire('saveSnapshot');return false;};}
var leaveLeft=leave(),leaveRight=leave(1);return{37:leaveLeft,38:leaveLeft,39:leaveRight,40:leaveRight,8:del(),46:del(1)};})();function getOnKeyDownListener(editor){var keystrokes={37:1,39:1,8:1,46:1};return function(evt){var keystroke=evt.data.getKeystroke();if(!keystrokes[keystroke])
return;var sel=editor.getSelection(),ranges=sel.getRanges(),range=ranges[0];if(ranges.length!=1||!range.collapsed)
return;var next=range[keystroke<38?'getPreviousEditableNode':'getNextEditableNode']();if(next&&next.type==CKEDITOR.NODE_ELEMENT&&next.getAttribute('contenteditable')=='false'){editor.getSelection().fake(next);evt.data.preventDefault();evt.cancel();}};}
function getNonEditableFakeSelectionReceiver(ranges){var enclosedNode,shrinkedNode,clone,range;if(ranges.length==1&&!(range=ranges[0]).collapsed&&(enclosedNode=range.getEnclosedNode())&&enclosedNode.type==CKEDITOR.NODE_ELEMENT){clone=range.clone();clone.shrink(CKEDITOR.SHRINK_ELEMENT,true);if((shrinkedNode=clone.getEnclosedNode())&&shrinkedNode.type==CKEDITOR.NODE_ELEMENT)
enclosedNode=shrinkedNode;if(enclosedNode.getAttribute('contenteditable')=='false')
return enclosedNode;}}
function fixRangesAfterHiddenSelectionContainer(ranges,root){var range;for(var i=0;i<ranges.length;++i){range=ranges[i];if(range.endContainer.equals(root)){range.endOffset=Math.min(range.endOffset,root.getChildCount());}}}
CKEDITOR.on('instanceCreated',function(ev){var editor=ev.editor;editor.on('contentDom',function(){var doc=editor.document,outerDoc=CKEDITOR.document,editable=editor.editable(),body=doc.getBody(),html=doc.getDocumentElement();var isInline=editable.isInline();var restoreSel,lastSel;if(CKEDITOR.env.gecko){editable.attachListener(editable,'focus',function(evt){evt.removeListener();if(restoreSel!==0){var nativ=editor.getSelection().getNative();if(nativ&&nativ.isCollapsed&&nativ.anchorNode==editable.$){var rng=editor.createRange();rng.moveToElementEditStart(editable);rng.select();}}},null,null,-2);}
editable.attachListener(editable,CKEDITOR.env.webkit?'DOMFocusIn':'focus',function(){if(restoreSel&&CKEDITOR.env.webkit)
restoreSel=editor._.previousActive&&editor._.previousActive.equals(doc.getActive());editor.unlockSelection(restoreSel);restoreSel=0;},null,null,-1);editable.attachListener(editable,'mousedown',function(){restoreSel=0;});if(CKEDITOR.env.ie||CKEDITOR.env.opera||isInline){function saveSel(){lastSel=new CKEDITOR.dom.selection(editor.getSelection());lastSel.lock();}
if(isMSSelection)
editable.attachListener(editable,'beforedeactivate',saveSel,null,null,-1);else
editable.attachListener(editor,'selectionCheck',saveSel,null,null,-1);editable.attachListener(editable,CKEDITOR.env.webkit?'DOMFocusOut':'blur',function(){editor.lockSelection(lastSel);restoreSel=1;},null,null,-1);editable.attachListener(editable,'mousedown',function(){restoreSel=0;});}
if(CKEDITOR.env.ie&&!isInline){var scroll;editable.attachListener(editable,'mousedown',function(evt){if(evt.data.$.button==2){var sel=editor.document.getSelection();if(!sel||sel.getType()==CKEDITOR.SELECTION_NONE)
scroll=editor.window.getScrollPosition();}});editable.attachListener(editable,'mouseup',function(evt){if(evt.data.$.button==2&&scroll){editor.document.$.documentElement.scrollLeft=scroll.x;editor.document.$.documentElement.scrollTop=scroll.y;}
scroll=null;});if(doc.$.compatMode!='BackCompat'){if(CKEDITOR.env.ie7Compat||CKEDITOR.env.ie6Compat){function moveRangeToPoint(range,x,y){try{range.moveToPoint(x,y);}catch(e){}}
html.on('mousedown',function(evt){evt=evt.data;function onHover(evt){evt=evt.data.$;if(textRng){var rngEnd=body.$.createTextRange();moveRangeToPoint(rngEnd,evt.x,evt.y);textRng.setEndPoint(startRng.compareEndPoints('StartToStart',rngEnd)<0?'EndToEnd':'StartToStart',rngEnd);textRng.select();}}
function removeListeners(){outerDoc.removeListener('mouseup',onSelectEnd);html.removeListener('mouseup',onSelectEnd);}
function onSelectEnd(){html.removeListener('mousemove',onHover);removeListeners();textRng.select();}
if(evt.getTarget().is('html')&&evt.$.y<html.$.clientHeight&&evt.$.x<html.$.clientWidth){var textRng=body.$.createTextRange();moveRangeToPoint(textRng,evt.$.x,evt.$.y);var startRng=textRng.duplicate();html.on('mousemove',onHover);outerDoc.on('mouseup',onSelectEnd);html.on('mouseup',onSelectEnd);}});}
if(CKEDITOR.env.version>7&&CKEDITOR.env.version<11){html.on('mousedown',function(evt){if(evt.data.getTarget().is('html')){outerDoc.on('mouseup',onSelectEnd);html.on('mouseup',onSelectEnd);}});function removeListeners(){outerDoc.removeListener('mouseup',onSelectEnd);html.removeListener('mouseup',onSelectEnd);}
function onSelectEnd(){removeListeners();var sel=CKEDITOR.document.$.selection,range=sel.createRange();if(sel.type!='None'&&range.parentElement().ownerDocument==doc.$)
range.select();}}}}
editable.attachListener(editable,'selectionchange',checkSelectionChange,editor);editable.attachListener(editable,'keyup',checkSelectionChangeTimeout,editor);editable.attachListener(editable,CKEDITOR.env.webkit?'DOMFocusIn':'focus',function(){editor.forceNextSelectionCheck();editor.selectionChange(1);});if(isInline?(CKEDITOR.env.webkit||CKEDITOR.env.gecko):CKEDITOR.env.opera){var mouseDown;editable.attachListener(editable,'mousedown',function(){mouseDown=1;});editable.attachListener(doc.getDocumentElement(),'mouseup',function(){if(mouseDown)
checkSelectionChangeTimeout.call(editor);mouseDown=0;});}
else
editable.attachListener(CKEDITOR.env.ie?editable:doc.getDocumentElement(),'mouseup',checkSelectionChangeTimeout,editor);if(CKEDITOR.env.webkit){editable.attachListener(doc,'keydown',function(evt){var key=evt.data.getKey();switch(key){case 13:case 33:case 34:case 35:case 36:case 37:case 39:case 8:case 45:case 46:removeFillingChar(editable);}},null,null,-1);}
editable.attachListener(editable,'keydown',getOnKeyDownListener(editor),null,null,-1);});editor.on('contentDomUnload',editor.forceNextSelectionCheck,editor);editor.on('dataReady',function(){delete editor._.fakeSelection;delete editor._.hiddenSelectionContainer;editor.selectionChange(1);});editor.on('loadSnapshot',function(){var el=editor.editable().getLast(function(node){return node.type==CKEDITOR.NODE_ELEMENT;});if(el&&el.hasAttribute('data-cke-hidden-sel'))
el.remove();},null,null,100);function clearSelection(){var sel=editor.getSelection();sel&&sel.removeAllRanges();}
CKEDITOR.env.ie9Compat&&editor.on('beforeDestroy',clearSelection,null,null,9);CKEDITOR.env.webkit&&editor.on('setData',clearSelection);editor.on('contentDomUnload',function(){editor.unlockSelection();});editor.on('key',function(evt){if(editor.mode!='wysiwyg')
return;var sel=editor.getSelection();if(!sel.isFake)
return;var handler=fakeSelectionDefaultKeystrokeHandlers[evt.data.keyCode];if(handler)
return handler({editor:editor,selected:sel.getSelectedElement(),selection:sel,keyEvent:evt});});});CKEDITOR.on('instanceReady',function(evt){var editor=evt.editor;if(CKEDITOR.env.webkit){editor.on('selectionChange',function(){checkFillingChar(editor.editable());},null,null,-1);editor.on('beforeSetMode',function(){removeFillingChar(editor.editable());},null,null,-1);var fillingCharBefore,resetSelection;function beforeData(){var editable=editor.editable();if(!editable)
return;var fillingChar=getFillingChar(editable);if(fillingChar){var sel=editor.document.$.defaultView.getSelection();if(sel.type=='Caret'&&sel.anchorNode==fillingChar.$)
resetSelection=1;fillingCharBefore=fillingChar.getText();fillingChar.setText(replaceFillingChar(fillingCharBefore));}}
function afterData(){var editable=editor.editable();if(!editable)
return;var fillingChar=getFillingChar(editable);if(fillingChar){fillingChar.setText(fillingCharBefore);if(resetSelection){editor.document.$.defaultView.getSelection().setPosition(fillingChar.$,fillingChar.getLength());resetSelection=0;}}}
editor.on('beforeUndoImage',beforeData);editor.on('afterUndoImage',afterData);editor.on('beforeGetData',beforeData,null,null,0);editor.on('getData',afterData);}});CKEDITOR.editor.prototype.selectionChange=function(checkNow){(checkNow?checkSelectionChange:checkSelectionChangeTimeout).call(this);};CKEDITOR.editor.prototype.getSelection=function(forceRealSelection){if((this._.savedSelection||this._.fakeSelection)&&!forceRealSelection)
return this._.savedSelection||this._.fakeSelection;var editable=this.editable();return editable&&this.mode=='wysiwyg'?new CKEDITOR.dom.selection(editable):null;};CKEDITOR.editor.prototype.lockSelection=function(sel){sel=sel||this.getSelection(1);if(sel.getType()!=CKEDITOR.SELECTION_NONE){!sel.isLocked&&sel.lock();this._.savedSelection=sel;return true;}
return false;};CKEDITOR.editor.prototype.unlockSelection=function(restore){var sel=this._.savedSelection;if(sel){sel.unlock(restore);delete this._.savedSelection;return true;}
return false;};CKEDITOR.editor.prototype.forceNextSelectionCheck=function(){delete this._.selectionPreviousPath;};CKEDITOR.dom.document.prototype.getSelection=function(){return new CKEDITOR.dom.selection(this);};CKEDITOR.dom.range.prototype.select=function(){var sel=this.root instanceof CKEDITOR.editable?this.root.editor.getSelection():new CKEDITOR.dom.selection(this.root);sel.selectRanges([this]);return sel;};CKEDITOR.SELECTION_NONE=1;CKEDITOR.SELECTION_TEXT=2;CKEDITOR.SELECTION_ELEMENT=3;var isMSSelection=typeof window.getSelection!='function',nextRev=1;CKEDITOR.dom.selection=function(target){if(target instanceof CKEDITOR.dom.selection){var selection=target;target=target.root;}
var isElement=target instanceof CKEDITOR.dom.element,root;this.rev=selection?selection.rev:nextRev++;this.document=target instanceof CKEDITOR.dom.document?target:target.getDocument();this.root=root=isElement?target:this.document.getBody();this.isLocked=0;this._={cache:{}};if(selection){CKEDITOR.tools.extend(this._.cache,selection._.cache);this.isFake=selection.isFake;this.isLocked=selection.isLocked;return this;}
var sel=isMSSelection?this.document.$.selection:this.document.getWindow().$.getSelection();if(CKEDITOR.env.webkit){if(sel.type=='None'&&this.document.getActive().equals(root)||sel.type=='Caret'&&sel.anchorNode.nodeType==CKEDITOR.NODE_DOCUMENT)
fixInitialSelection(root,sel);}
else if(CKEDITOR.env.gecko){if(sel&&this.document.getActive().equals(root)&&sel.anchorNode&&sel.anchorNode.nodeType==CKEDITOR.NODE_DOCUMENT)
fixInitialSelection(root,sel,true);}
else if(CKEDITOR.env.ie){var active;try{active=this.document.getActive();}catch(e){}
if(!isMSSelection){var anchorNode=sel&&sel.anchorNode;if(anchorNode)
anchorNode=new CKEDITOR.dom.node(anchorNode);if(active&&active.equals(this.document.getDocumentElement())&&anchorNode&&(root.equals(anchorNode)||root.contains(anchorNode)))
fixInitialSelection(root,null,true);}
else if(sel.type=='None'&&active&&active.equals(this.document.getDocumentElement()))
fixInitialSelection(root,null,true);}
var nativeSel=this.getNative(),rangeParent,range;if(nativeSel){if(nativeSel.getRangeAt){range=nativeSel.rangeCount&&nativeSel.getRangeAt(0);rangeParent=range&&new CKEDITOR.dom.node(range.commonAncestorContainer);}
else{try{range=nativeSel.createRange();}catch(err){}
rangeParent=range&&CKEDITOR.dom.element.get(range.item&&range.item(0)||range.parentElement());}}
if(!(rangeParent&&(rangeParent.type==CKEDITOR.NODE_ELEMENT||rangeParent.type==CKEDITOR.NODE_TEXT)&&(this.root.equals(rangeParent)||this.root.contains(rangeParent)))){this._.cache.type=CKEDITOR.SELECTION_NONE;this._.cache.startElement=null;this._.cache.selectedElement=null;this._.cache.selectedText='';this._.cache.ranges=new CKEDITOR.dom.rangeList();}
return this;};var styleObjectElements={img:1,hr:1,li:1,table:1,tr:1,td:1,th:1,embed:1,object:1,ol:1,ul:1,a:1,input:1,form:1,select:1,textarea:1,button:1,fieldset:1,thead:1,tfoot:1};CKEDITOR.dom.selection.prototype={getNative:function(){if(this._.cache.nativeSel!==undefined)
return this._.cache.nativeSel;return(this._.cache.nativeSel=isMSSelection?this.document.$.selection:this.document.getWindow().$.getSelection());},getType:isMSSelection?function(){var cache=this._.cache;if(cache.type)
return cache.type;var type=CKEDITOR.SELECTION_NONE;try{var sel=this.getNative(),ieType=sel.type;if(ieType=='Text')
type=CKEDITOR.SELECTION_TEXT;if(ieType=='Control')
type=CKEDITOR.SELECTION_ELEMENT;if(sel.createRange().parentElement())
type=CKEDITOR.SELECTION_TEXT;}catch(e){}
return(cache.type=type);}:function(){var cache=this._.cache;if(cache.type)
return cache.type;var type=CKEDITOR.SELECTION_TEXT;var sel=this.getNative();if(!(sel&&sel.rangeCount))
type=CKEDITOR.SELECTION_NONE;else if(sel.rangeCount==1){var range=sel.getRangeAt(0),startContainer=range.startContainer;if(startContainer==range.endContainer&&startContainer.nodeType==1&&(range.endOffset-range.startOffset)==1&&styleObjectElements[startContainer.childNodes[range.startOffset].nodeName.toLowerCase()])
type=CKEDITOR.SELECTION_ELEMENT;}
return(cache.type=type);},getRanges:(function(){var func=isMSSelection?(function(){function getNodeIndex(node){return new CKEDITOR.dom.node(node).getIndex();}
var getBoundaryInformation=function(range,start){range=range.duplicate();range.collapse(start);var parent=range.parentElement(),doc=parent.ownerDocument;if(!parent.hasChildNodes())
return{container:parent,offset:0};var siblings=parent.children,child,sibling,testRange=range.duplicate(),startIndex=0,endIndex=siblings.length-1,index=-1,position,distance,container;while(startIndex<=endIndex){index=Math.floor((startIndex+endIndex)/2);child=siblings[index];testRange.moveToElementText(child);position=testRange.compareEndPoints('StartToStart',range);if(position>0)
endIndex=index-1;else if(position<0)
startIndex=index+1;else
return{container:parent,offset:getNodeIndex(child)};}
if(index==-1||index==siblings.length-1&&position<0){testRange.moveToElementText(parent);testRange.setEndPoint('StartToStart',range);distance=testRange.text.replace(/(\r\n|\r)/g,'\n').length;siblings=parent.childNodes;if(!distance){child=siblings[siblings.length-1];if(child.nodeType!=CKEDITOR.NODE_TEXT)
return{container:parent,offset:siblings.length};else
return{container:child,offset:child.nodeValue.length};}
var i=siblings.length;while(distance>0&&i>0){sibling=siblings[--i];if(sibling.nodeType==CKEDITOR.NODE_TEXT){container=sibling;distance-=sibling.nodeValue.length;}}
return{container:container,offset:-distance};}
else{testRange.collapse(position>0?true:false);testRange.setEndPoint(position>0?'StartToStart':'EndToStart',range);distance=testRange.text.replace(/(\r\n|\r)/g,'\n').length;if(!distance)
return{container:parent,offset:getNodeIndex(child)+(position>0?0:1)};while(distance>0){try{sibling=child[position>0?'previousSibling':'nextSibling'];if(sibling.nodeType==CKEDITOR.NODE_TEXT){distance-=sibling.nodeValue.length;container=sibling;}
child=sibling;}
catch(e){return{container:parent,offset:getNodeIndex(child)};}}
return{container:container,offset:position>0?-distance:container.nodeValue.length+distance};}};return function(){var sel=this.getNative(),nativeRange=sel&&sel.createRange(),type=this.getType(),range;if(!sel)
return[];if(type==CKEDITOR.SELECTION_TEXT){range=new CKEDITOR.dom.range(this.root);var boundaryInfo=getBoundaryInformation(nativeRange,true);range.setStart(new CKEDITOR.dom.node(boundaryInfo.container),boundaryInfo.offset);boundaryInfo=getBoundaryInformation(nativeRange);range.setEnd(new CKEDITOR.dom.node(boundaryInfo.container),boundaryInfo.offset);if(range.endContainer.getPosition(range.startContainer)&CKEDITOR.POSITION_PRECEDING&&range.endOffset<=range.startContainer.getIndex())
range.collapse();return[range];}else if(type==CKEDITOR.SELECTION_ELEMENT){var retval=[];for(var i=0;i<nativeRange.length;i++){var element=nativeRange.item(i),parentElement=element.parentNode,j=0;range=new CKEDITOR.dom.range(this.root);for(;j<parentElement.childNodes.length&&parentElement.childNodes[j]!=element;j++){}
range.setStart(new CKEDITOR.dom.node(parentElement),j);range.setEnd(new CKEDITOR.dom.node(parentElement),j+1);retval.push(range);}
return retval;}
return[];};})():function(){var ranges=[],range,sel=this.getNative();if(!sel)
return ranges;for(var i=0;i<sel.rangeCount;i++){var nativeRange=sel.getRangeAt(i);range=new CKEDITOR.dom.range(this.root);range.setStart(new CKEDITOR.dom.node(nativeRange.startContainer),nativeRange.startOffset);range.setEnd(new CKEDITOR.dom.node(nativeRange.endContainer),nativeRange.endOffset);ranges.push(range);}
return ranges;};return function(onlyEditables){var cache=this._.cache;if(cache.ranges&&!onlyEditables)
return cache.ranges;else if(!cache.ranges)
cache.ranges=new CKEDITOR.dom.rangeList(func.call(this));if(onlyEditables){var ranges=cache.ranges;for(var i=0;i<ranges.length;i++){var range=ranges[i];var parent=range.getCommonAncestor();if(parent.isReadOnly())
ranges.splice(i,1);if(range.collapsed)
continue;if(range.startContainer.isReadOnly()){var current=range.startContainer,isElement;while(current){isElement=current.type==CKEDITOR.NODE_ELEMENT;if((isElement&&current.is('body'))||!current.isReadOnly())
break;if(isElement&&current.getAttribute('contentEditable')=='false')
range.setStartAfter(current);current=current.getParent();}}
var startContainer=range.startContainer,endContainer=range.endContainer,startOffset=range.startOffset,endOffset=range.endOffset,walkerRange=range.clone();if(startContainer&&startContainer.type==CKEDITOR.NODE_TEXT){if(startOffset>=startContainer.getLength())
walkerRange.setStartAfter(startContainer);else
walkerRange.setStartBefore(startContainer);}
if(endContainer&&endContainer.type==CKEDITOR.NODE_TEXT){if(!endOffset)
walkerRange.setEndBefore(endContainer);else
walkerRange.setEndAfter(endContainer);}
var walker=new CKEDITOR.dom.walker(walkerRange);walker.evaluator=function(node){if(node.type==CKEDITOR.NODE_ELEMENT&&node.isReadOnly()){var newRange=range.clone();range.setEndBefore(node);if(range.collapsed)
ranges.splice(i--,1);if(!(node.getPosition(walkerRange.endContainer)&CKEDITOR.POSITION_CONTAINS)){newRange.setStartAfter(node);if(!newRange.collapsed)
ranges.splice(i+1,0,newRange);}
return true;}
return false;};walker.next();}}
return cache.ranges;};})(),getStartElement:function(){var cache=this._.cache;if(cache.startElement!==undefined)
return cache.startElement;var node;switch(this.getType()){case CKEDITOR.SELECTION_ELEMENT:return this.getSelectedElement();case CKEDITOR.SELECTION_TEXT:var range=this.getRanges()[0];if(range){if(!range.collapsed){range.optimize();while(1){var startContainer=range.startContainer,startOffset=range.startOffset;if(startOffset==(startContainer.getChildCount?startContainer.getChildCount():startContainer.getLength())&&!startContainer.isBlockBoundary())
range.setStartAfter(startContainer);else
break;}
node=range.startContainer;if(node.type!=CKEDITOR.NODE_ELEMENT)
return node.getParent();node=node.getChild(range.startOffset);if(!node||node.type!=CKEDITOR.NODE_ELEMENT)
node=range.startContainer;else{var child=node.getFirst();while(child&&child.type==CKEDITOR.NODE_ELEMENT){node=child;child=child.getFirst();}}}else{node=range.startContainer;if(node.type!=CKEDITOR.NODE_ELEMENT)
node=node.getParent();}
node=node.$;}}
return cache.startElement=(node?new CKEDITOR.dom.element(node):null);},getSelectedElement:function(){var cache=this._.cache;if(cache.selectedElement!==undefined)
return cache.selectedElement;var self=this;var node=CKEDITOR.tools.tryThese(function(){return self.getNative().createRange().item(0);},function(){var range=self.getRanges()[0].clone(),enclosed,selected;for(var i=2;i&&!((enclosed=range.getEnclosedNode())&&(enclosed.type==CKEDITOR.NODE_ELEMENT)&&styleObjectElements[enclosed.getName()]&&(selected=enclosed));i--){range.shrink(CKEDITOR.SHRINK_ELEMENT);}
return selected&&selected.$;});return cache.selectedElement=(node?new CKEDITOR.dom.element(node):null);},getSelectedText:function(){var cache=this._.cache;if(cache.selectedText!==undefined)
return cache.selectedText;var nativeSel=this.getNative(),text=isMSSelection?nativeSel.type=='Control'?'':nativeSel.createRange().text:nativeSel.toString();return(cache.selectedText=text);},lock:function(){this.getRanges();this.getStartElement();this.getSelectedElement();this.getSelectedText();this._.cache.nativeSel=null;this.isLocked=1;},unlock:function(restore){if(!this.isLocked)
return;if(restore){var selectedElement=this.getSelectedElement(),ranges=!selectedElement&&this.getRanges(),faked=this.isFake;}
this.isLocked=0;this.reset();if(restore){var common=selectedElement||ranges[0]&&ranges[0].getCommonAncestor();if(!(common&&common.getAscendant('body',1)))
return;if(faked)
this.fake(selectedElement);else if(selectedElement)
this.selectElement(selectedElement);else
this.selectRanges(ranges);}},reset:function(){this._.cache={};this.isFake=0;var editor=this.root.editor,listener;if(editor&&editor._.fakeSelection){if(this.rev==editor._.fakeSelection.rev){delete editor._.fakeSelection;removeHiddenSelectionContainer(editor);}
else
window.console&&console.log('Wrong selection instance resets fake selection.');}
this.rev=nextRev++;},selectElement:function(element){var range=new CKEDITOR.dom.range(this.root);range.setStartBefore(element);range.setEndAfter(element);this.selectRanges([range]);},selectRanges:function(ranges){var editor=this.root.editor,hadHiddenSelectionContainer=editor&&editor._.hiddenSelectionContainer;this.reset();if(hadHiddenSelectionContainer)
fixRangesAfterHiddenSelectionContainer(ranges,this.root);if(!ranges.length)
return;if(this.isLocked){var focused=CKEDITOR.document.getActive();this.unlock();this.selectRanges(ranges);this.lock();!focused.equals(this.root)&&focused.focus();return;}
var receiver=getNonEditableFakeSelectionReceiver(ranges);if(receiver){this.fake(receiver);return;}
if(isMSSelection){var notWhitespaces=CKEDITOR.dom.walker.whitespaces(true),fillerTextRegex=/\ufeff|\u00a0/,nonCells={table:1,tbody:1,tr:1};if(ranges.length>1){var last=ranges[ranges.length-1];ranges[0].setEnd(last.endContainer,last.endOffset);}
var range=ranges[0];var collapsed=range.collapsed,isStartMarkerAlone,dummySpan,ieRange;var selected=range.getEnclosedNode();if(selected&&selected.type==CKEDITOR.NODE_ELEMENT&&selected.getName()in styleObjectElements&&!(selected.is('a')&&selected.getText())){try{ieRange=selected.$.createControlRange();ieRange.addElement(selected.$);ieRange.select();return;}catch(er){}}
if(range.startContainer.type==CKEDITOR.NODE_ELEMENT&&range.startContainer.getName()in nonCells||range.endContainer.type==CKEDITOR.NODE_ELEMENT&&range.endContainer.getName()in nonCells)
range.shrink(CKEDITOR.NODE_ELEMENT,true);var bookmark=range.createBookmark();var startNode=bookmark.startNode;var endNode;if(!collapsed)
endNode=bookmark.endNode;ieRange=range.document.$.body.createTextRange();ieRange.moveToElementText(startNode.$);ieRange.moveStart('character',1);if(endNode){var ieRangeEnd=range.document.$.body.createTextRange();ieRangeEnd.moveToElementText(endNode.$);ieRange.setEndPoint('EndToEnd',ieRangeEnd);ieRange.moveEnd('character',-1);}else{var next=startNode.getNext(notWhitespaces);var inPre=startNode.hasAscendant('pre');isStartMarkerAlone=(!(next&&next.getText&&next.getText().match(fillerTextRegex))&&(inPre||!startNode.hasPrevious()||(startNode.getPrevious().is&&startNode.getPrevious().is('br'))));dummySpan=range.document.createElement('span');dummySpan.setHtml('&#65279;');dummySpan.insertBefore(startNode);if(isStartMarkerAlone){range.document.createText('\ufeff').insertBefore(startNode);}}
range.setStartBefore(startNode);startNode.remove();if(collapsed){if(isStartMarkerAlone){ieRange.moveStart('character',-1);ieRange.select();range.document.$.selection.clear();}else
ieRange.select();range.moveToPosition(dummySpan,CKEDITOR.POSITION_BEFORE_START);dummySpan.remove();}else{range.setEndBefore(endNode);endNode.remove();ieRange.select();}}else{var sel=this.getNative();if(!sel)
return;if(CKEDITOR.env.opera){var nativeRng=this.document.$.createRange();nativeRng.selectNodeContents(this.root.$);sel.addRange(nativeRng);}
this.removeAllRanges();for(var i=0;i<ranges.length;i++){if(i<ranges.length-1){var left=ranges[i],right=ranges[i+1],between=left.clone();between.setStart(left.endContainer,left.endOffset);between.setEnd(right.startContainer,right.startOffset);if(!between.collapsed){between.shrink(CKEDITOR.NODE_ELEMENT,true);var ancestor=between.getCommonAncestor(),enclosed=between.getEnclosedNode();if(ancestor.isReadOnly()||enclosed&&enclosed.isReadOnly()){right.setStart(left.startContainer,left.startOffset);ranges.splice(i--,1);continue;}}}
range=ranges[i];var nativeRange=this.document.$.createRange();var startContainer=range.startContainer;if(CKEDITOR.env.opera&&range.collapsed&&startContainer.type==CKEDITOR.NODE_ELEMENT){var leftSib=startContainer.getChild(range.startOffset-1),rightSib=startContainer.getChild(range.startOffset);if(!leftSib&&!rightSib&&startContainer.is(CKEDITOR.dtd.$removeEmpty)||leftSib&&leftSib.type==CKEDITOR.NODE_ELEMENT||rightSib&&rightSib.type==CKEDITOR.NODE_ELEMENT){range.insertNode(this.document.createText(''));range.collapse(1);}}
if(range.collapsed&&CKEDITOR.env.webkit&&rangeRequiresFix(range)){var fillingChar=createFillingChar(this.root);range.insertNode(fillingChar);next=fillingChar.getNext();if(next&&!fillingChar.getPrevious()&&next.type==CKEDITOR.NODE_ELEMENT&&next.getName()=='br'){removeFillingChar(this.root);range.moveToPosition(next,CKEDITOR.POSITION_BEFORE_START);}else
range.moveToPosition(fillingChar,CKEDITOR.POSITION_AFTER_END);}
nativeRange.setStart(range.startContainer.$,range.startOffset);try{nativeRange.setEnd(range.endContainer.$,range.endOffset);}catch(e){if(e.toString().indexOf('NS_ERROR_ILLEGAL_VALUE')>=0){range.collapse(1);nativeRange.setEnd(range.endContainer.$,range.endOffset);}else
throw e;}
sel.addRange(nativeRange);}}
this.reset();this.root.fire('selectionchange');},fake:function(element){var editor=this.root.editor;this.reset();hideSelection(editor);var cache=this._.cache;var range=new CKEDITOR.dom.range(this.root);range.setStartBefore(element);range.setEndAfter(element);cache.ranges=new CKEDITOR.dom.rangeList(range);cache.selectedElement=cache.startElement=element;cache.type=CKEDITOR.SELECTION_ELEMENT;cache.selectedText=cache.nativeSel=null;this.isFake=1;this.rev=nextRev++;editor._.fakeSelection=this;this.root.fire('selectionchange');},isHidden:function(){var el=this.getCommonAncestor();if(el&&el.type==CKEDITOR.NODE_TEXT)
el=el.getParent();return!!(el&&el.data('cke-hidden-sel'));},createBookmarks:function(serializable){var bookmark=this.getRanges().createBookmarks(serializable);this.isFake&&(bookmark.isFake=1);return bookmark;},createBookmarks2:function(normalized){var bookmark=this.getRanges().createBookmarks2(normalized);this.isFake&&(bookmark.isFake=1);return bookmark;},selectBookmarks:function(bookmarks){var ranges=[];for(var i=0;i<bookmarks.length;i++){var range=new CKEDITOR.dom.range(this.root);range.moveToBookmark(bookmarks[i]);ranges.push(range);}
if(bookmarks.isFake)
this.fake(ranges[0].getEnclosedNode());else
this.selectRanges(ranges);return this;},getCommonAncestor:function(){var ranges=this.getRanges();if(!ranges.length)
return null;var startNode=ranges[0].startContainer,endNode=ranges[ranges.length-1].endContainer;return startNode.getCommonAncestor(endNode);},scrollIntoView:function(){if(this.type!=CKEDITOR.SELECTION_NONE)
this.getRanges()[0].scrollIntoView();},removeAllRanges:function(){var nativ=this.getNative();try{nativ&&nativ[isMSSelection?'empty':'removeAllRanges']();}
catch(er){}
this.reset();}};})();