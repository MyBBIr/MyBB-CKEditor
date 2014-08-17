
(function(){CKEDITOR.editable=CKEDITOR.tools.createClass({base:CKEDITOR.dom.element,$:function(editor,element){this.base(element.$||element);this.editor=editor;this.hasFocus=false;this.setup();},proto:{focus:function(){var active;if(CKEDITOR.env.webkit&&!this.hasFocus){active=this.editor._.previousActive||this.getDocument().getActive();if(this.contains(active)){active.focus();return;}}
try{this.$[CKEDITOR.env.ie&&this.getDocument().equals(CKEDITOR.document)?'setActive':'focus']();}catch(e){if(!CKEDITOR.env.ie)
throw e;}
if(CKEDITOR.env.safari&&!this.isInline()){active=CKEDITOR.document.getActive();if(!active.equals(this.getWindow().getFrame()))
this.getWindow().focus();}},on:function(name,fn){var args=Array.prototype.slice.call(arguments,0);if(CKEDITOR.env.ie&&(/^focus|blur$/).exec(name)){name=name=='focus'?'focusin':'focusout';fn=isNotBubbling(fn,this);args[0]=name;args[1]=fn;}
return CKEDITOR.dom.element.prototype.on.apply(this,args);},attachListener:function(obj,event,fn,scope,listenerData,priority){!this._.listeners&&(this._.listeners=[]);var args=Array.prototype.slice.call(arguments,1),listener=obj.on.apply(obj,args);this._.listeners.push(listener);return listener;},clearListeners:function(){var listeners=this._.listeners;try{while(listeners.length)
listeners.pop().removeListener();}catch(e){}},restoreAttrs:function(){var changes=this._.attrChanges,orgVal;for(var attr in changes){if(changes.hasOwnProperty(attr)){orgVal=changes[attr];orgVal!==null?this.setAttribute(attr,orgVal):this.removeAttribute(attr);}}},attachClass:function(cls){var classes=this.getCustomData('classes');if(!this.hasClass(cls)){!classes&&(classes=[]),classes.push(cls);this.setCustomData('classes',classes);this.addClass(cls);}},changeAttr:function(attr,val){var orgVal=this.getAttribute(attr);if(val!==orgVal){!this._.attrChanges&&(this._.attrChanges={});if(!(attr in this._.attrChanges))
this._.attrChanges[attr]=orgVal;this.setAttribute(attr,val);}},insertHtml:function(data,mode){beforeInsert(this);insert(this,mode||'html',data);},insertText:function(text){beforeInsert(this);var editor=this.editor,mode=editor.getSelection().getStartElement().hasAscendant('pre',true)?CKEDITOR.ENTER_BR:editor.activeEnterMode,isEnterBrMode=mode==CKEDITOR.ENTER_BR,tools=CKEDITOR.tools;var html=tools.htmlEncode(text.replace(/\r\n/g,'\n'));html=html.replace(/\t/g,'&nbsp;&nbsp; &nbsp;');var paragraphTag=mode==CKEDITOR.ENTER_P?'p':'div';if(!isEnterBrMode){var duoLF=/\n{2}/g;if(duoLF.test(html))
{var openTag='<'+paragraphTag+'>',endTag='</'+paragraphTag+'>';html=openTag+html.replace(duoLF,function(){return endTag+openTag;})+endTag;}}
html=html.replace(/\n/g,'<br>');if(!isEnterBrMode){html=html.replace(new RegExp('<br>(?=</'+paragraphTag+'>)'),function(match){return tools.repeat(match,2);});}
html=html.replace(/^ | $/g,'&nbsp;');html=html.replace(/(>|\s) /g,function(match,before){return before+'&nbsp;';}).replace(/ (?=<)/g,'&nbsp;');insert(this,'text',html);},insertElement:function(element,range){if(!range)
this.insertElementIntoSelection(element);else
this.insertElementIntoRange(element,range);},insertElementIntoRange:function(element,range){var editor=this.editor,enterMode=editor.config.enterMode,elementName=element.getName(),isBlock=CKEDITOR.dtd.$block[elementName];if(range.checkReadOnly())
return false;range.deleteContents(1);if(range.startContainer.type==CKEDITOR.NODE_ELEMENT&&range.startContainer.is({tr:1,table:1,tbody:1,thead:1,tfoot:1}))
fixTableAfterContentsDeletion(range);var current,dtd;if(isBlock){while((current=range.getCommonAncestor(0,1))&&(dtd=CKEDITOR.dtd[current.getName()])&&!(dtd&&dtd[elementName])){if(current.getName()in CKEDITOR.dtd.span)
range.splitElement(current);else if(range.checkStartOfBlock()&&range.checkEndOfBlock()){range.setStartBefore(current);range.collapse(true);current.remove();}else
range.splitBlock(enterMode==CKEDITOR.ENTER_DIV?'div':'p',editor.editable());}}
range.insertNode(element);return true;},insertElementIntoSelection:function(element){var editor=this.editor,enterMode=editor.activeEnterMode,selection=editor.getSelection(),range=selection.getRanges()[0],elementName=element.getName(),isBlock=CKEDITOR.dtd.$block[elementName];beforeInsert(this);if(this.insertElementIntoRange(element,range)){range.moveToPosition(element,CKEDITOR.POSITION_AFTER_END);if(isBlock){var next=element.getNext(function(node){return isNotEmpty(node)&&!isBogus(node);});if(next&&next.type==CKEDITOR.NODE_ELEMENT&&next.is(CKEDITOR.dtd.$block)){if(next.getDtd()['#'])
range.moveToElementEditStart(next);else
range.moveToElementEditEnd(element);}
else if(!next&&enterMode!=CKEDITOR.ENTER_BR){next=range.fixBlock(true,enterMode==CKEDITOR.ENTER_DIV?'div':'p');range.moveToElementEditStart(next);}}}
selection.selectRanges([range]);afterInsert(this,CKEDITOR.env.opera);},setData:function(data,isSnapshot){if(!isSnapshot)
data=this.editor.dataProcessor.toHtml(data);this.setHtml(data);this.editor.fire('dataReady');},getData:function(isSnapshot){var data=this.getHtml();if(!isSnapshot)
data=this.editor.dataProcessor.toDataFormat(data);return data;},setReadOnly:function(isReadOnly){this.setAttribute('contenteditable',!isReadOnly);},detach:function(){this.removeClass('cke_editable');var editor=this.editor;this._.detach();delete editor.document;delete editor.window;},isInline:function(){return this.getDocument().equals(CKEDITOR.document);},setup:function(){var editor=this.editor;this.attachListener(editor,'beforeGetData',function(){var data=this.getData();if(!this.is('textarea')){if(editor.config.ignoreEmptyParagraph!==false)
data=data.replace(emptyParagraphRegexp,function(match,lookback){return lookback;});}
editor.setData(data,null,1);},this);this.attachListener(editor,'getSnapshot',function(evt){evt.data=this.getData(1);},this);this.attachListener(editor,'afterSetData',function(){this.setData(editor.getData(1));},this);this.attachListener(editor,'loadSnapshot',function(evt){this.setData(evt.data,1);},this);this.attachListener(editor,'beforeFocus',function(){var sel=editor.getSelection(),ieSel=sel&&sel.getNative();if(ieSel&&ieSel.type=='Control')
return;this.focus();},this);this.attachListener(editor,'insertHtml',function(evt){this.insertHtml(evt.data.dataValue,evt.data.mode);},this);this.attachListener(editor,'insertElement',function(evt){this.insertElement(evt.data);},this);this.attachListener(editor,'insertText',function(evt){this.insertText(evt.data);},this);this.setReadOnly(editor.readOnly);this.attachClass('cke_editable');this.attachClass(editor.elementMode==CKEDITOR.ELEMENT_MODE_INLINE?'cke_editable_inline':editor.elementMode==CKEDITOR.ELEMENT_MODE_REPLACE||editor.elementMode==CKEDITOR.ELEMENT_MODE_APPENDTO?'cke_editable_themed':'');this.attachClass('cke_contents_'+editor.config.contentsLangDirection);var keystrokeHandler=editor.keystrokeHandler;keystrokeHandler.blockedKeystrokes[8]=+editor.readOnly;editor.keystrokeHandler.attach(this);this.on('blur',function(evt){if(CKEDITOR.env.opera){var active=CKEDITOR.document.getActive();if(active.equals(this.isInline()?this:this.getWindow().getFrame())){evt.cancel();return;}}
this.hasFocus=false;},null,null,-1);this.on('focus',function(){this.hasFocus=true;},null,null,-1);editor.focusManager.add(this);if(this.equals(CKEDITOR.document.getActive())){this.hasFocus=true;editor.once('contentDom',function(){editor.focusManager.focus();});}
if(this.isInline()){this.changeAttr('tabindex',editor.tabIndex);}
if(this.is('textarea'))
return;editor.document=this.getDocument();editor.window=this.getWindow();var doc=editor.document;this.changeAttr('spellcheck',!editor.config.disableNativeSpellChecker);var dir=editor.config.contentsLangDirection;if(this.getDirection(1)!=dir)
this.changeAttr('dir',dir);var styles=CKEDITOR.getCss();if(styles){var head=doc.getHead();if(!head.getCustomData('stylesheet')){var sheet=doc.appendStyleText(styles);sheet=new CKEDITOR.dom.element(sheet.ownerNode||sheet.owningElement);head.setCustomData('stylesheet',sheet);sheet.data('cke-temp',1);}}
var ref=doc.getCustomData('stylesheet_ref')||0;doc.setCustomData('stylesheet_ref',ref+1);this.setCustomData('cke_includeReadonly',!editor.config.disableReadonlyStyling);this.attachListener(this,'click',function(evt){evt=evt.data;var link=new CKEDITOR.dom.elementPath(evt.getTarget(),this).contains('a');if(link&&evt.$.button!=2&&link.isReadOnly())
evt.preventDefault();});var backspaceOrDelete={8:1,46:1};this.attachListener(editor,'key',function(evt){if(editor.readOnly)
return true;var keyCode=evt.data.keyCode,isHandled;if(keyCode in backspaceOrDelete){var sel=editor.getSelection(),selected,range=sel.getRanges()[0],path=range.startPath(),block,parent,next,rtl=keyCode==8;if((CKEDITOR.env.ie&&CKEDITOR.env.version<11&&(selected=sel.getSelectedElement()))||(selected=getSelectedTableList(sel))){editor.fire('saveSnapshot');range.moveToPosition(selected,CKEDITOR.POSITION_BEFORE_START);selected.remove();range.select();editor.fire('saveSnapshot');isHandled=1;}else if(range.collapsed){if((block=path.block)&&(next=block[rtl?'getPrevious':'getNext'](isNotWhitespace))&&(next.type==CKEDITOR.NODE_ELEMENT)&&next.is('table')&&range[rtl?'checkStartOfBlock':'checkEndOfBlock']())
{editor.fire('saveSnapshot');if(range[rtl?'checkEndOfBlock':'checkStartOfBlock']())
block.remove();range['moveToElementEdit'+(rtl?'End':'Start')](next);range.select();editor.fire('saveSnapshot');isHandled=1;}
else if(path.blockLimit&&path.blockLimit.is('td')&&(parent=path.blockLimit.getAscendant('table'))&&range.checkBoundaryOfElement(parent,rtl?CKEDITOR.START:CKEDITOR.END)&&(next=parent[rtl?'getPrevious':'getNext'](isNotWhitespace)))
{editor.fire('saveSnapshot');range['moveToElementEdit'+(rtl?'End':'Start')](next);if(range.checkStartOfBlock()&&range.checkEndOfBlock())
next.remove();else
range.select();editor.fire('saveSnapshot');isHandled=1;}
else if((parent=path.contains(['td','th','caption']))&&range.checkBoundaryOfElement(parent,rtl?CKEDITOR.START:CKEDITOR.END)){isHandled=1;}}}
return!isHandled;});if(editor.blockless&&CKEDITOR.env.ie&&CKEDITOR.env.needsBrFiller){this.attachListener(this,'keyup',function(evt){if(evt.data.getKeystroke()in backspaceOrDelete&&!this.getFirst(isNotEmpty)){this.appendBogus();var range=editor.createRange();range.moveToPosition(this,CKEDITOR.POSITION_AFTER_START);range.select();}});}
this.attachListener(this,'dblclick',function(evt){if(editor.readOnly)
return false;var data={element:evt.data.getTarget()};editor.fire('doubleclick',data);});CKEDITOR.env.ie&&this.attachListener(this,'click',blockInputClick);if(!(CKEDITOR.env.ie||CKEDITOR.env.opera)){this.attachListener(this,'mousedown',function(ev){var control=ev.data.getTarget();if(control.is('img','hr','input','textarea','select')){editor.getSelection().selectElement(control);if(control.is('input','textarea','select'))
ev.data.preventDefault();}});}
if(CKEDITOR.env.gecko){this.attachListener(this,'mouseup',function(ev){if(ev.data.$.button==2){var target=ev.data.getTarget();if(!target.getOuterHtml().replace(emptyParagraphRegexp,'')){var range=editor.createRange();range.moveToElementEditStart(target);range.select(true);}}});}
if(CKEDITOR.env.webkit){this.attachListener(this,'click',function(ev){if(ev.data.getTarget().is('input','select'))
ev.data.preventDefault();});this.attachListener(this,'mouseup',function(ev){if(ev.data.getTarget().is('input','textarea'))
ev.data.preventDefault();});}}},_:{detach:function(){this.editor.setData(this.editor.getData(),0,1);this.clearListeners();this.restoreAttrs();var classes;if((classes=this.removeCustomData('classes'))){while(classes.length)
this.removeClass(classes.pop());}
var doc=this.getDocument(),head=doc.getHead();if(head.getCustomData('stylesheet')){var refs=doc.getCustomData('stylesheet_ref');if(!(--refs)){doc.removeCustomData('stylesheet_ref');var sheet=head.removeCustomData('stylesheet');sheet.remove();}else
doc.setCustomData('stylesheet_ref',refs);}
this.editor.fire('contentDomUnload');delete this.editor;}}});CKEDITOR.editor.prototype.editable=function(element){var editable=this._.editable;if(editable&&element)
return 0;if(arguments.length){editable=this._.editable=element?(element instanceof CKEDITOR.editable?element:new CKEDITOR.editable(this,element)):(editable&&editable.detach(),null);}
return editable;};function fixDom(evt){var editor=evt.editor,path=evt.data.path,blockLimit=path.blockLimit,selection=evt.data.selection,range=selection.getRanges()[0],enterMode=editor.activeEnterMode,selectionUpdateNeeded;if(CKEDITOR.env.gecko||(CKEDITOR.env.ie&&CKEDITOR.env.needsBrFiller)){var blockNeedsFiller=needsBrFiller(selection,path);if(blockNeedsFiller){blockNeedsFiller.appendBogus();selectionUpdateNeeded=CKEDITOR.env.ie;}}
if(shouldAutoParagraph(editor,path.block,blockLimit)&&range.collapsed&&!range.getCommonAncestor().isReadOnly()){var testRng=range.clone();testRng.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);var walker=new CKEDITOR.dom.walker(testRng);walker.guard=function(node){return!isNotEmpty(node)||node.type==CKEDITOR.NODE_COMMENT||node.isReadOnly();};if(!walker.checkForward()||testRng.checkStartOfBlock()&&testRng.checkEndOfBlock()){var fixedBlock=range.fixBlock(true,editor.activeEnterMode==CKEDITOR.ENTER_DIV?'div':'p');if(!CKEDITOR.env.needsBrFiller){var first=fixedBlock.getFirst(isNotEmpty);if(first&&isNbsp(first))
first.remove();}
selectionUpdateNeeded=1;evt.cancel();}}
if(selectionUpdateNeeded)
range.select();}
function needsBrFiller(selection,path){if(selection.isFake)
return 0;var pathBlock=path.block||path.blockLimit,lastNode=pathBlock&&pathBlock.getLast(isNotEmpty);if(pathBlock&&pathBlock.isBlockBoundary()&&!(lastNode&&lastNode.type==CKEDITOR.NODE_ELEMENT&&lastNode.isBlockBoundary())&&!pathBlock.is('pre')&&!pathBlock.getBogus())
return pathBlock;}
function blockInputClick(evt){var element=evt.data.getTarget();if(element.is('input')){var type=element.getAttribute('type');if(type=='submit'||type=='reset')
evt.data.preventDefault();}}
function isBlankParagraph(block){return block.getOuterHtml().match(emptyParagraphRegexp);}
function isNotEmpty(node){return isNotWhitespace(node)&&isNotBookmark(node);}
function isNbsp(node){return node.type==CKEDITOR.NODE_TEXT&&CKEDITOR.tools.trim(node.getText()).match(/^(?:&nbsp;|\xa0)$/);}
function nonEditable(element){return element.isBlockBoundary()&&CKEDITOR.dtd.$empty[element.getName()];}
function isNotBubbling(fn,src){return function(evt){var other=CKEDITOR.dom.element.get(evt.data.$.toElement||evt.data.$.fromElement||evt.data.$.relatedTarget);if(!(other&&(src.equals(other)||src.contains(other))))
fn.call(this,evt);};}
var isBogus=CKEDITOR.dom.walker.bogus();function getSelectedTableList(sel){var selected,range=sel.getRanges()[0],editable=sel.root,path=range.startPath(),structural={table:1,ul:1,ol:1,dl:1};if(path.contains(structural)){function guard(forwardGuard){return function(node,isWalkOut){if(isWalkOut&&node.type==CKEDITOR.NODE_ELEMENT&&node.is(structural))
selected=node;if(!isWalkOut&&isNotEmpty(node)&&!(forwardGuard&&isBogus(node)))
return false;};}
var walkerRng=range.clone();walkerRng.collapse(1);walkerRng.setStartAt(editable,CKEDITOR.POSITION_AFTER_START);var walker=new CKEDITOR.dom.walker(walkerRng);walker.guard=guard();walker.checkBackward();if(selected){walkerRng=range.clone();walkerRng.collapse();walkerRng.setEndAt(selected,CKEDITOR.POSITION_AFTER_END);walker=new CKEDITOR.dom.walker(walkerRng);walker.guard=guard(true);selected=false;walker.checkForward();return selected;}}
return null;}
function shouldAutoParagraph(editor,pathBlock,pathBlockLimit){return editor.config.autoParagraph!==false&&editor.activeEnterMode!=CKEDITOR.ENTER_BR&&editor.editable().equals(pathBlockLimit)&&!pathBlock;}
var emptyParagraphRegexp=/(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi;var isNotWhitespace=CKEDITOR.dom.walker.whitespaces(true),isNotBookmark=CKEDITOR.dom.walker.bookmark(false,true);CKEDITOR.on('instanceLoaded',function(evt){var editor=evt.editor;editor.on('insertElement',function(evt){var element=evt.data;if(element.type==CKEDITOR.NODE_ELEMENT&&(element.is('input')||element.is('textarea'))){if(element.getAttribute('contentEditable')!="false")
element.data('cke-editable',element.hasAttribute('contenteditable')?'true':'1');element.setAttribute('contentEditable',false);}});editor.on('selectionChange',function(evt){if(editor.readOnly)
return;var sel=editor.getSelection();if(sel&&!sel.isLocked){var isDirty=editor.checkDirty();editor.fire('lockSnapshot');fixDom(evt);editor.fire('unlockSnapshot');!isDirty&&editor.resetDirty();}});});CKEDITOR.on('instanceCreated',function(evt){var editor=evt.editor;editor.on('mode',function(){var editable=editor.editable();if(editable&&editable.isInline()){var ariaLabel=editor.title;editable.changeAttr('role','textbox');editable.changeAttr('aria-label',ariaLabel);if(ariaLabel)
editable.changeAttr('title',ariaLabel);var ct=this.ui.space(this.elementMode==CKEDITOR.ELEMENT_MODE_INLINE?'top':'contents');if(ct){var ariaDescId=CKEDITOR.tools.getNextId(),desc=CKEDITOR.dom.element.createFromHtml('<span id="'+ariaDescId+'" class="cke_voice_label">'+this.lang.common.editorHelp+'</span>');ct.append(desc);editable.changeAttr('aria-describedby',ariaDescId);}}});});CKEDITOR.addCss('.cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}');var insert=(function(){'use strict';var DTD=CKEDITOR.dtd;function insert(editable,type,data){var editor=editable.editor,doc=editable.getDocument(),selection=editor.getSelection(),range=selection.getRanges()[0],dontFilter=false;if(type=='unfiltered_html'){type='html';dontFilter=true;}
if(range.checkReadOnly())
return;var path=new CKEDITOR.dom.elementPath(range.startContainer,range.root),blockLimit=path.blockLimit||range.root,that={type:type,dontFilter:dontFilter,editable:editable,editor:editor,range:range,blockLimit:blockLimit,mergeCandidates:[],zombies:[]};prepareRangeToDataInsertion(that);if(data&&processDataForInsertion(that,data)){insertDataIntoRange(that);}
cleanupAfterInsertion(that);range.select();afterInsert(editable);}
function prepareRangeToDataInsertion(that){var range=that.range,mergeCandidates=that.mergeCandidates,node,marker,path,startPath,endPath,previous,bm;if(that.type=='text'&&range.shrink(CKEDITOR.SHRINK_ELEMENT,true,false)){marker=CKEDITOR.dom.element.createFromHtml('<span>&nbsp;</span>',range.document);range.insertNode(marker);range.setStartAfter(marker);}
startPath=new CKEDITOR.dom.elementPath(range.startContainer);that.endPath=endPath=new CKEDITOR.dom.elementPath(range.endContainer);if(!range.collapsed){node=endPath.block||endPath.blockLimit;var ancestor=range.getCommonAncestor();if(node&&!(node.equals(ancestor)||node.contains(ancestor))&&range.checkEndOfBlock()){that.zombies.push(node);}
range.deleteContents();}
while((previous=getRangePrevious(range))&&checkIfElement(previous)&&previous.isBlockBoundary()&&startPath.contains(previous))
range.moveToPosition(previous,CKEDITOR.POSITION_BEFORE_END);mergeAncestorElementsOfSelectionEnds(range,that.blockLimit,startPath,endPath);if(marker){range.setEndBefore(marker);range.collapse();marker.remove();}
path=range.startPath();if((node=path.contains(isInline,false,1))){range.splitElement(node);that.inlineStylesRoot=node;that.inlineStylesPeak=path.lastElement;}
bm=range.createBookmark();node=bm.startNode.getPrevious(isNotEmpty);node&&checkIfElement(node)&&isInline(node)&&mergeCandidates.push(node);node=bm.startNode.getNext(isNotEmpty);node&&checkIfElement(node)&&isInline(node)&&mergeCandidates.push(node);node=bm.startNode;while((node=node.getParent())&&isInline(node))
mergeCandidates.push(node);range.moveToBookmark(bm);}
function processDataForInsertion(that,data){var range=that.range;if(that.type=='text'&&that.inlineStylesRoot)
data=wrapDataWithInlineStyles(data,that);var context=that.blockLimit.getName();if(/^\s+|\s+$/.test(data)&&'span'in CKEDITOR.dtd[context]){var protect='<span data-cke-marker="1">&nbsp;</span>';data=protect+data+protect;}
data=that.editor.dataProcessor.toHtml(data,{context:null,fixForBody:false,dontFilter:that.dontFilter,filter:that.editor.activeFilter,enterMode:that.editor.activeEnterMode});var doc=range.document,wrapper=doc.createElement('body');wrapper.setHtml(data);if(protect){wrapper.getFirst().remove();wrapper.getLast().remove();}
var block=range.startPath().block;if(block&&!(block.getChildCount()==1&&block.getBogus())){stripBlockTagIfSingleLine(wrapper);}
that.dataWrapper=wrapper;return data;}
function insertDataIntoRange(that){var range=that.range,doc=range.document,path,blockLimit=that.blockLimit,nodesData,nodeData,node,nodeIndex=0,bogus,bogusNeededBlocks=[],pathBlock,fixBlock,splittingContainer=0,dontMoveCaret=0,insertionContainer,toSplit,newContainer,startContainer=range.startContainer,endContainer=that.endPath.elements[0],filteredNodes,pos=endContainer.getPosition(startContainer),separateEndContainer=!!endContainer.getCommonAncestor(startContainer)&&pos!=CKEDITOR.POSITION_IDENTICAL&&!(pos&CKEDITOR.POSITION_CONTAINS+CKEDITOR.POSITION_IS_CONTAINED);nodesData=extractNodesData(that.dataWrapper,that);removeBrsAdjacentToPastedBlocks(nodesData,range);for(;nodeIndex<nodesData.length;nodeIndex++){nodeData=nodesData[nodeIndex];if(nodeData.isLineBreak&&splitOnLineBreak(range,blockLimit,nodeData)){dontMoveCaret=nodeIndex>0;continue;}
path=range.startPath();if(!nodeData.isBlock&&shouldAutoParagraph(that.editor,path.block,path.blockLimit)&&(fixBlock=autoParagraphTag(that.editor))){fixBlock=doc.createElement(fixBlock);fixBlock.appendBogus();range.insertNode(fixBlock);if(CKEDITOR.env.needsBrFiller&&(bogus=fixBlock.getBogus()))
bogus.remove();range.moveToPosition(fixBlock,CKEDITOR.POSITION_BEFORE_END);}
node=range.startPath().block;if(node&&!node.equals(pathBlock)){bogus=node.getBogus();if(bogus){bogus.remove();bogusNeededBlocks.push(node);}
pathBlock=node;}
if(nodeData.firstNotAllowed)
splittingContainer=1;if(splittingContainer&&nodeData.isElement){insertionContainer=range.startContainer;toSplit=null;while(insertionContainer&&!DTD[insertionContainer.getName()][nodeData.name]){if(insertionContainer.equals(blockLimit)){insertionContainer=null;break;}
toSplit=insertionContainer;insertionContainer=insertionContainer.getParent();}
if(insertionContainer){if(toSplit){newContainer=range.splitElement(toSplit);that.zombies.push(newContainer);that.zombies.push(toSplit);}}
else{filteredNodes=filterElement(nodeData.node,blockLimit.getName(),!nodeIndex,nodeIndex==nodesData.length-1);}}
if(filteredNodes){while((node=filteredNodes.pop()))
range.insertNode(node);filteredNodes=0;}else
range.insertNode(nodeData.node);if(nodeData.lastNotAllowed&&nodeIndex<nodesData.length-1){newContainer=separateEndContainer?endContainer:newContainer;newContainer&&range.setEndAt(newContainer,CKEDITOR.POSITION_AFTER_START);splittingContainer=0;}
range.collapse();}
that.dontMoveCaret=dontMoveCaret;that.bogusNeededBlocks=bogusNeededBlocks;}
function cleanupAfterInsertion(that){var range=that.range,node,testRange,parent,movedIntoInline,bogusNeededBlocks=that.bogusNeededBlocks,bm=range.createBookmark();while((node=that.zombies.pop())){if(!node.getParent())
continue;testRange=range.clone();testRange.moveToElementEditStart(node);testRange.removeEmptyBlocksAtEnd();}
if(bogusNeededBlocks){while((node=bogusNeededBlocks.pop())){if(CKEDITOR.env.needsBrFiller)
node.appendBogus();else
node.append(range.document.createText('\u00a0'));}}
while((node=that.mergeCandidates.pop()))
node.mergeSiblings();range.moveToBookmark(bm);if(!that.dontMoveCaret){node=getRangePrevious(range);while(node&&checkIfElement(node)&&!node.is(DTD.$empty)){if(node.isBlockBoundary())
range.moveToPosition(node,CKEDITOR.POSITION_BEFORE_END);else{if(isInline(node)&&node.getHtml().match(/(\s|&nbsp;)$/g)){movedIntoInline=null;break;}
movedIntoInline=range.clone();movedIntoInline.moveToPosition(node,CKEDITOR.POSITION_BEFORE_END);}
node=node.getLast(isNotEmpty);}
movedIntoInline&&range.moveToRange(movedIntoInline);}}
function autoParagraphTag(editor){return(editor.activeEnterMode!=CKEDITOR.ENTER_BR&&editor.config.autoParagraph!==false)?editor.activeEnterMode==CKEDITOR.ENTER_DIV?'div':'p':false;}
function checkIfElement(node){return node.type==CKEDITOR.NODE_ELEMENT;}
function extractNodesData(dataWrapper,that){var node,sibling,nodeName,allowed,nodesData=[],startContainer=that.range.startContainer,path=that.range.startPath(),allowedNames=DTD[startContainer.getName()],nodeIndex=0,nodesList=dataWrapper.getChildren(),nodesCount=nodesList.count(),firstNotAllowed=-1,lastNotAllowed=-1,lineBreak=0,blockSibling;var insideOfList=path.contains(DTD.$list);for(;nodeIndex<nodesCount;++nodeIndex){node=nodesList.getItem(nodeIndex);if(checkIfElement(node)){nodeName=node.getName();if(insideOfList&&nodeName in CKEDITOR.dtd.$list){nodesData=nodesData.concat(extractNodesData(node,that));continue;}
allowed=!!allowedNames[nodeName];if(nodeName=='br'&&node.data('cke-eol')&&(!nodeIndex||nodeIndex==nodesCount-1)){sibling=nodeIndex?nodesData[nodeIndex-1].node:nodesList.getItem(nodeIndex+1);lineBreak=sibling&&(!checkIfElement(sibling)||!sibling.is('br'));blockSibling=sibling&&checkIfElement(sibling)&&DTD.$block[sibling.getName()];}
if(firstNotAllowed==-1&&!allowed)
firstNotAllowed=nodeIndex;if(!allowed)
lastNotAllowed=nodeIndex;nodesData.push({isElement:1,isLineBreak:lineBreak,isBlock:node.isBlockBoundary(),hasBlockSibling:blockSibling,node:node,name:nodeName,allowed:allowed});lineBreak=0;blockSibling=0;}else
nodesData.push({isElement:0,node:node,allowed:1});}
if(firstNotAllowed>-1)
nodesData[firstNotAllowed].firstNotAllowed=1;if(lastNotAllowed>-1)
nodesData[lastNotAllowed].lastNotAllowed=1;return nodesData;}
function filterElement(element,parentName,isFirst,isLast){var nodes=filterElementInner(element,parentName),nodes2=[],nodesCount=nodes.length,nodeIndex=0,node,afterSpace=0,lastSpaceIndex=-1;for(;nodeIndex<nodesCount;nodeIndex++){node=nodes[nodeIndex];if(node==' '){if(!afterSpace&&!(isFirst&&!nodeIndex)){nodes2.push(new CKEDITOR.dom.text(' '));lastSpaceIndex=nodes2.length;}
afterSpace=1;}else{nodes2.push(node);afterSpace=0;}}
if(isLast&&lastSpaceIndex==nodes2.length)
nodes2.pop();return nodes2;}
function filterElementInner(element,parentName){var nodes=[],children=element.getChildren(),childrenCount=children.count(),child,childIndex=0,allowedNames=DTD[parentName],surroundBySpaces=!element.is(DTD.$inline)||element.is('br');if(surroundBySpaces)
nodes.push(' ');for(;childIndex<childrenCount;childIndex++){child=children.getItem(childIndex);if(checkIfElement(child)&&!child.is(allowedNames))
nodes=nodes.concat(filterElementInner(child,parentName));else
nodes.push(child);}
if(surroundBySpaces)
nodes.push(' ');return nodes;}
function getRangePrevious(range){return checkIfElement(range.startContainer)&&range.startContainer.getChild(range.startOffset-1);}
function isInline(node){return node&&checkIfElement(node)&&(node.is(DTD.$removeEmpty)||node.is('a')&&!node.isBlockBoundary());}
var blockMergedTags={p:1,div:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,ul:1,ol:1,li:1,pre:1,dl:1,blockquote:1};function mergeAncestorElementsOfSelectionEnds(range,blockLimit,startPath,endPath){var walkerRange=range.clone(),walker,nextNode,previousNode;walkerRange.setEndAt(blockLimit,CKEDITOR.POSITION_BEFORE_END);walker=new CKEDITOR.dom.walker(walkerRange);if((nextNode=walker.next())&&checkIfElement(nextNode)&&blockMergedTags[nextNode.getName()]&&(previousNode=nextNode.getPrevious())&&checkIfElement(previousNode)&&!previousNode.getParent().equals(range.startContainer)&&startPath.contains(previousNode)&&endPath.contains(nextNode)&&nextNode.isIdentical(previousNode))
{nextNode.moveChildren(previousNode);nextNode.remove();mergeAncestorElementsOfSelectionEnds(range,blockLimit,startPath,endPath);}}
function removeBrsAdjacentToPastedBlocks(nodesData,range){var succeedingNode=range.endContainer.getChild(range.endOffset),precedingNode=range.endContainer.getChild(range.endOffset-1);if(succeedingNode)
remove(succeedingNode,nodesData[nodesData.length-1]);if(precedingNode&&remove(precedingNode,nodesData[0])){range.setEnd(range.endContainer,range.endOffset-1);range.collapse();}
function remove(maybeBr,maybeBlockData){if(maybeBlockData.isBlock&&maybeBlockData.isElement&&!maybeBlockData.node.is('br')&&checkIfElement(maybeBr)&&maybeBr.is('br')){maybeBr.remove();return 1;}}}
function splitOnLineBreak(range,blockLimit,nodeData){var firstBlockAscendant,pos;if(nodeData.hasBlockSibling)
return 1;firstBlockAscendant=range.startContainer.getAscendant(DTD.$block,1);if(!firstBlockAscendant||!firstBlockAscendant.is({div:1,p:1}))
return 0;pos=firstBlockAscendant.getPosition(blockLimit);if(pos==CKEDITOR.POSITION_IDENTICAL||pos==CKEDITOR.POSITION_CONTAINS)
return 0;var newContainer=range.splitElement(firstBlockAscendant);range.moveToPosition(newContainer,CKEDITOR.POSITION_AFTER_START);return 1;}
var stripSingleBlockTags={p:1,div:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1},inlineButNotBr=CKEDITOR.tools.extend({},DTD.$inline);delete inlineButNotBr.br;function stripBlockTagIfSingleLine(dataWrapper){var block,children;if(dataWrapper.getChildCount()==1&&checkIfElement(block=dataWrapper.getFirst())&&block.is(stripSingleBlockTags))
{children=block.getElementsByTag('*');for(var i=0,child,count=children.count();i<count;i++){child=children.getItem(i);if(!child.is(inlineButNotBr))
return;}
block.moveChildren(block.getParent(1));block.remove();}}
function wrapDataWithInlineStyles(data,that){var element=that.inlineStylesPeak,doc=element.getDocument(),wrapper=doc.createText('{cke-peak}'),limit=that.inlineStylesRoot.getParent();while(!element.equals(limit)){wrapper=wrapper.appendTo(element.clone());element=element.getParent();}
return wrapper.getOuterHtml().split('{cke-peak}').join(data);}
return insert;})();function beforeInsert(editable){editable.editor.focus();editable.editor.fire('saveSnapshot');}
function afterInsert(editable,noScroll){var editor=editable.editor;!noScroll&&editor.getSelection().scrollIntoView();setTimeout(function(){editor.fire('saveSnapshot');},0);}
var fixTableAfterContentsDeletion=(function(){function getFixTableSelectionWalker(testRange){var walker=new CKEDITOR.dom.walker(testRange);walker.guard=function(node,isMovingOut){if(isMovingOut)
return false;if(node.type==CKEDITOR.NODE_ELEMENT)
return node.is(CKEDITOR.dtd.$tableContent);};walker.evaluator=function(node){return node.type==CKEDITOR.NODE_ELEMENT;};return walker;}
function fixTableStructure(element,newElementName,appendToStart){var temp=element.getDocument().createElement(newElementName);element.append(temp,appendToStart);return temp;}
function fixEmptyCells(cells){var i=cells.count(),cell;for(i;i-->0;){cell=cells.getItem(i);if(!CKEDITOR.tools.trim(cell.getHtml())){cell.appendBogus();if(CKEDITOR.env.ie&&CKEDITOR.env.version<9&&cell.getChildCount())
cell.getFirst().remove();}}}
return function(range){var container=range.startContainer,table=container.getAscendant('table',1),testRange,walker,deeperSibling,doc=range.document,appendToStart=false;fixEmptyCells(table.getElementsByTag('td'));fixEmptyCells(table.getElementsByTag('th'));testRange=range.clone();testRange.setStart(container,0);deeperSibling=getFixTableSelectionWalker(testRange).lastBackward();if(!deeperSibling){testRange=range.clone();testRange.setEndAt(container,CKEDITOR.POSITION_BEFORE_END);deeperSibling=getFixTableSelectionWalker(testRange).lastForward();appendToStart=true;}
if(!deeperSibling)
deeperSibling=container;if(deeperSibling.is('table')){range.setStartAt(deeperSibling,CKEDITOR.POSITION_BEFORE_START);range.collapse(true);deeperSibling.remove();return;}
if(deeperSibling.is({tbody:1,thead:1,tfoot:1}))
deeperSibling=fixTableStructure(deeperSibling,'tr',appendToStart);if(deeperSibling.is('tr'))
deeperSibling=fixTableStructure(deeperSibling,deeperSibling.getParent().is('thead')?'th':'td',appendToStart);var bogus=deeperSibling.getBogus();if(bogus)
bogus.remove();range.moveToPosition(deeperSibling,appendToStart?CKEDITOR.POSITION_AFTER_START:CKEDITOR.POSITION_BEFORE_END);};})();})();