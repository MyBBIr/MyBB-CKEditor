'use strict';CKEDITOR.editor.prototype.attachStyleStateChange=function(style,callback){var styleStateChangeCallbacks=this._.styleStateChangeCallbacks;if(!styleStateChangeCallbacks){styleStateChangeCallbacks=this._.styleStateChangeCallbacks=[];this.on('selectionChange',function(ev){for(var i=0;i<styleStateChangeCallbacks.length;i++){var callback=styleStateChangeCallbacks[i];var currentState=callback.style.checkActive(ev.data.path)?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF;callback.fn.call(this,currentState);}});}
styleStateChangeCallbacks.push({style:style,fn:callback});};CKEDITOR.STYLE_BLOCK=1;CKEDITOR.STYLE_INLINE=2;CKEDITOR.STYLE_OBJECT=3;(function(){var blockElements={address:1,div:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,p:1,pre:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,time:1,meter:1,menu:1,command:1,keygen:1,output:1,progress:1,details:1,datagrid:1,datalist:1},objectElements={a:1,embed:1,hr:1,img:1,li:1,object:1,ol:1,table:1,td:1,tr:1,th:1,ul:1,dl:1,dt:1,dd:1,form:1,audio:1,video:1};var semicolonFixRegex=/\s*(?:;\s*|$)/,varRegex=/#\((.+?)\)/g;var notBookmark=CKEDITOR.dom.walker.bookmark(0,1),nonWhitespaces=CKEDITOR.dom.walker.whitespaces(1);CKEDITOR.style=function(styleDefinition,variablesValues){var attrs=styleDefinition.attributes;if(attrs&&attrs.style){styleDefinition.styles=CKEDITOR.tools.extend({},styleDefinition.styles,CKEDITOR.tools.parseCssText(attrs.style));delete attrs.style;}
if(variablesValues){styleDefinition=CKEDITOR.tools.clone(styleDefinition);replaceVariables(styleDefinition.attributes,variablesValues);replaceVariables(styleDefinition.styles,variablesValues);}
var element=this.element=styleDefinition.element?(typeof styleDefinition.element=='string'?styleDefinition.element.toLowerCase():styleDefinition.element):'*';this.type=styleDefinition.type||(blockElements[element]?CKEDITOR.STYLE_BLOCK:objectElements[element]?CKEDITOR.STYLE_OBJECT:CKEDITOR.STYLE_INLINE);if(typeof this.element=='object')
this.type=CKEDITOR.STYLE_OBJECT;this._={definition:styleDefinition};};CKEDITOR.editor.prototype.applyStyle=function(style){if(style.checkApplicable(this.elementPath()))
applyStyleOnSelection.call(style,this.getSelection());};CKEDITOR.editor.prototype.removeStyle=function(style){if(style.checkApplicable(this.elementPath()))
applyStyleOnSelection.call(style,this.getSelection(),1);};CKEDITOR.style.prototype={apply:function(document){applyStyleOnSelection.call(this,document.getSelection());},remove:function(document){applyStyleOnSelection.call(this,document.getSelection(),1);},applyToRange:function(range){return(this.applyToRange=this.type==CKEDITOR.STYLE_INLINE?applyInlineStyle:this.type==CKEDITOR.STYLE_BLOCK?applyBlockStyle:this.type==CKEDITOR.STYLE_OBJECT?applyObjectStyle:null).call(this,range);},removeFromRange:function(range){return(this.removeFromRange=this.type==CKEDITOR.STYLE_INLINE?removeInlineStyle:this.type==CKEDITOR.STYLE_BLOCK?removeBlockStyle:this.type==CKEDITOR.STYLE_OBJECT?removeObjectStyle:null).call(this,range);},applyToObject:function(element){setupElement(element,this);},checkActive:function(elementPath){switch(this.type){case CKEDITOR.STYLE_BLOCK:return this.checkElementRemovable(elementPath.block||elementPath.blockLimit,true);case CKEDITOR.STYLE_OBJECT:case CKEDITOR.STYLE_INLINE:var elements=elementPath.elements;for(var i=0,element;i<elements.length;i++){element=elements[i];if(this.type==CKEDITOR.STYLE_INLINE&&(element==elementPath.block||element==elementPath.blockLimit))
continue;if(this.type==CKEDITOR.STYLE_OBJECT){var name=element.getName();if(!(typeof this.element=='string'?name==this.element:name in this.element))
continue;}
if(this.checkElementRemovable(element,true))
return true;}}
return false;},checkApplicable:function(elementPath,filter){if(filter&&!filter.check(this))
return false;switch(this.type){case CKEDITOR.STYLE_OBJECT:return!!elementPath.contains(this.element);case CKEDITOR.STYLE_BLOCK:return!!elementPath.blockLimit.getDtd()[this.element];}
return true;},checkElementMatch:function(element,fullMatch){var def=this._.definition;if(!element||!def.ignoreReadonly&&element.isReadOnly())
return false;var attribs,name=element.getName();if(typeof this.element=='string'?name==this.element:name in this.element){if(!fullMatch&&!element.hasAttributes())
return true;attribs=getAttributesForComparison(def);if(attribs._length){for(var attName in attribs){if(attName=='_length')
continue;var elementAttr=element.getAttribute(attName)||'';if(attName=='style'?compareCssText(attribs[attName],elementAttr):attribs[attName]==elementAttr){if(!fullMatch)
return true;}else if(fullMatch)
return false;}
if(fullMatch)
return true;}else
return true;}
return false;},checkElementRemovable:function(element,fullMatch){if(this.checkElementMatch(element,fullMatch))
return true;var override=getOverrides(this)[element.getName()];if(override){var attribs,attName;if(!(attribs=override.attributes))
return true;for(var i=0;i<attribs.length;i++){attName=attribs[i][0];var actualAttrValue=element.getAttribute(attName);if(actualAttrValue){var attValue=attribs[i][1];if(attValue===null||(typeof attValue=='string'&&actualAttrValue==attValue)||attValue.test(actualAttrValue))
return true;}}}
return false;},buildPreview:function(label){var styleDefinition=this._.definition,html=[],elementName=styleDefinition.element;if(elementName=='bdo')
elementName='span';html=['<',elementName];var attribs=styleDefinition.attributes;if(attribs){for(var att in attribs)
html.push(' ',att,'="',attribs[att],'"');}
var cssStyle=CKEDITOR.style.getStyleText(styleDefinition);if(cssStyle)
html.push(' style="',cssStyle,'"');html.push('>',(label||styleDefinition.name),'</',elementName,'>');return html.join('');},getDefinition:function(){return this._.definition;}};CKEDITOR.style.getStyleText=function(styleDefinition){var stylesDef=styleDefinition._ST;if(stylesDef)
return stylesDef;stylesDef=styleDefinition.styles;var stylesText=(styleDefinition.attributes&&styleDefinition.attributes['style'])||'',specialStylesText='';if(stylesText.length)
stylesText=stylesText.replace(semicolonFixRegex,';');for(var style in stylesDef){var styleVal=stylesDef[style],text=(style+':'+styleVal).replace(semicolonFixRegex,';');if(styleVal=='inherit')
specialStylesText+=text;else
stylesText+=text;}
if(stylesText.length)
stylesText=CKEDITOR.tools.normalizeCssText(stylesText,true);stylesText+=specialStylesText;return(styleDefinition._ST=stylesText);};function getUnstylableParent(element,root){var unstylable,editable;while((element=element.getParent())){if(element.equals(root))
break;if(element.getAttribute('data-nostyle'))
unstylable=element;else if(!editable){var contentEditable=element.getAttribute('contentEditable');if(contentEditable=='false')
unstylable=element;else if(contentEditable=='true')
editable=1;}}
return unstylable;}
var posPrecedingIdenticalContained=CKEDITOR.POSITION_PRECEDING|CKEDITOR.POSITION_IDENTICAL|CKEDITOR.POSITION_IS_CONTAINED,posFollowingIdenticalContained=CKEDITOR.POSITION_FOLLOWING|CKEDITOR.POSITION_IDENTICAL|CKEDITOR.POSITION_IS_CONTAINED;function checkIfNodeCanBeChildOfStyle(def,currentNode,lastNode,nodeName,dtd,nodeIsNoStyle,nodeIsReadonly,includeReadonly){if(!nodeName)
return 1;if(!dtd[nodeName]||nodeIsNoStyle)
return 0;if(nodeIsReadonly&&!includeReadonly)
return 0;return checkPositionAndRule(currentNode,lastNode,def,posPrecedingIdenticalContained);}
function checkIfStyleCanBeChildOf(def,currentParent,elementName,isUnknownElement){return currentParent&&((currentParent.getDtd()||CKEDITOR.dtd.span)[elementName]||isUnknownElement)&&(!def.parentRule||def.parentRule(currentParent));}
function checkIfStartsRange(nodeName,currentNode,lastNode){return(!nodeName||!CKEDITOR.dtd.$removeEmpty[nodeName]||(currentNode.getPosition(lastNode)|posPrecedingIdenticalContained)==posPrecedingIdenticalContained);}
function checkIfTextOrReadonlyOrEmptyElement(currentNode,nodeIsReadonly){var nodeType=currentNode.type;return nodeType==CKEDITOR.NODE_TEXT||nodeIsReadonly||(nodeType==CKEDITOR.NODE_ELEMENT&&!currentNode.getChildCount());}
function checkPositionAndRule(nodeA,nodeB,def,posBitFlags){return(nodeA.getPosition(nodeB)|posBitFlags)==posBitFlags&&(!def.childRule||def.childRule(nodeA));}
function applyInlineStyle(range){var document=range.document;if(range.collapsed){var collapsedElement=getElement(this,document);range.insertNode(collapsedElement);range.moveToPosition(collapsedElement,CKEDITOR.POSITION_BEFORE_END);return;}
var elementName=this.element,def=this._.definition,isUnknownElement;var ignoreReadonly=def.ignoreReadonly,includeReadonly=ignoreReadonly||def.includeReadonly;if(includeReadonly==undefined)
includeReadonly=range.root.getCustomData('cke_includeReadonly');var dtd=CKEDITOR.dtd[elementName];if(!dtd){isUnknownElement=true;dtd=CKEDITOR.dtd.span;}
range.enlarge(CKEDITOR.ENLARGE_INLINE,1);range.trim();var boundaryNodes=range.createBookmark(),firstNode=boundaryNodes.startNode,lastNode=boundaryNodes.endNode,currentNode=firstNode,styleRange;if(!ignoreReadonly){var root=range.getCommonAncestor(),firstUnstylable=getUnstylableParent(firstNode,root),lastUnstylable=getUnstylableParent(lastNode,root);if(firstUnstylable)
currentNode=firstUnstylable.getNextSourceNode(true);if(lastUnstylable)
lastNode=lastUnstylable;}
if(currentNode.getPosition(lastNode)==CKEDITOR.POSITION_FOLLOWING)
currentNode=0;while(currentNode){var applyStyle=false;if(currentNode.equals(lastNode)){currentNode=null;applyStyle=true;}else{var nodeName=currentNode.type==CKEDITOR.NODE_ELEMENT?currentNode.getName():null,nodeIsReadonly=nodeName&&(currentNode.getAttribute('contentEditable')=='false'),nodeIsNoStyle=nodeName&&currentNode.getAttribute('data-nostyle');if(nodeName&&currentNode.data('cke-bookmark')){currentNode=currentNode.getNextSourceNode(true);continue;}
if(nodeIsReadonly&&includeReadonly&&CKEDITOR.dtd.$block[nodeName])
applyStyleOnNestedEditables.call(this,currentNode);if(checkIfNodeCanBeChildOfStyle(def,currentNode,lastNode,nodeName,dtd,nodeIsNoStyle,nodeIsReadonly,includeReadonly)){var currentParent=currentNode.getParent();if(checkIfStyleCanBeChildOf(def,currentParent,elementName,isUnknownElement)){if(!styleRange&&checkIfStartsRange(nodeName,currentNode,lastNode)){styleRange=range.clone();styleRange.setStartBefore(currentNode);}
if(checkIfTextOrReadonlyOrEmptyElement(currentNode,nodeIsReadonly)){var includedNode=currentNode;var parentNode;while((applyStyle=!includedNode.getNext(notBookmark))&&(parentNode=includedNode.getParent(),dtd[parentNode.getName()])&&checkPositionAndRule(parentNode,firstNode,def,posFollowingIdenticalContained)){includedNode=parentNode;}
styleRange.setEndAfter(includedNode);}}else
applyStyle=true;}
else
applyStyle=true;currentNode=currentNode.getNextSourceNode(nodeIsNoStyle||nodeIsReadonly);}
if(applyStyle&&styleRange&&!styleRange.collapsed){var styleNode=getElement(this,document),styleHasAttrs=styleNode.hasAttributes();var parent=styleRange.getCommonAncestor();var removeList={styles:{},attrs:{},blockedStyles:{},blockedAttrs:{}};var attName,styleName,value;while(styleNode&&parent){if(parent.getName()==elementName){for(attName in def.attributes){if(removeList.blockedAttrs[attName]||!(value=parent.getAttribute(styleName)))
continue;if(styleNode.getAttribute(attName)==value)
removeList.attrs[attName]=1;else
removeList.blockedAttrs[attName]=1;}
for(styleName in def.styles){if(removeList.blockedStyles[styleName]||!(value=parent.getStyle(styleName)))
continue;if(styleNode.getStyle(styleName)==value)
removeList.styles[styleName]=1;else
removeList.blockedStyles[styleName]=1;}}
parent=parent.getParent();}
for(attName in removeList.attrs)
styleNode.removeAttribute(attName);for(styleName in removeList.styles)
styleNode.removeStyle(styleName);if(styleHasAttrs&&!styleNode.hasAttributes())
styleNode=null;if(styleNode){styleRange.extractContents().appendTo(styleNode);styleRange.insertNode(styleNode);removeFromInsideElement.call(this,styleNode);styleNode.mergeSiblings();if(!CKEDITOR.env.ie)
styleNode.$.normalize();}
else{styleNode=new CKEDITOR.dom.element('span');styleRange.extractContents().appendTo(styleNode);styleRange.insertNode(styleNode);removeFromInsideElement.call(this,styleNode);styleNode.remove(true);}
styleRange=null;}}
range.moveToBookmark(boundaryNodes);range.shrink(CKEDITOR.SHRINK_TEXT);range.shrink(CKEDITOR.NODE_ELEMENT,true);}
function removeInlineStyle(range){range.enlarge(CKEDITOR.ENLARGE_INLINE,1);var bookmark=range.createBookmark(),startNode=bookmark.startNode;if(range.collapsed){var startPath=new CKEDITOR.dom.elementPath(startNode.getParent(),range.root),boundaryElement;for(var i=0,element;i<startPath.elements.length&&(element=startPath.elements[i]);i++){if(element==startPath.block||element==startPath.blockLimit)
break;if(this.checkElementRemovable(element)){var isStart;if(range.collapsed&&(range.checkBoundaryOfElement(element,CKEDITOR.END)||(isStart=range.checkBoundaryOfElement(element,CKEDITOR.START)))){boundaryElement=element;boundaryElement.match=isStart?'start':'end';}else{element.mergeSiblings();if(element.is(this.element))
removeFromElement.call(this,element);else
removeOverrides(element,getOverrides(this)[element.getName()]);}}}
if(boundaryElement){var clonedElement=startNode;for(i=0;;i++){var newElement=startPath.elements[i];if(newElement.equals(boundaryElement))
break;else if(newElement.match)
continue;else
newElement=newElement.clone();newElement.append(clonedElement);clonedElement=newElement;}
clonedElement[boundaryElement.match=='start'?'insertBefore':'insertAfter'](boundaryElement);}}else{var endNode=bookmark.endNode,me=this;breakNodes();var currentNode=startNode;while(!currentNode.equals(endNode)){var nextNode=currentNode.getNextSourceNode();if(currentNode.type==CKEDITOR.NODE_ELEMENT&&this.checkElementRemovable(currentNode)){if(currentNode.getName()==this.element)
removeFromElement.call(this,currentNode);else
removeOverrides(currentNode,getOverrides(this)[currentNode.getName()]);if(nextNode.type==CKEDITOR.NODE_ELEMENT&&nextNode.contains(startNode)){breakNodes();nextNode=startNode.getNext();}}
currentNode=nextNode;}}
range.moveToBookmark(bookmark);range.shrink(CKEDITOR.NODE_ELEMENT,true);function breakNodes(){var startPath=new CKEDITOR.dom.elementPath(startNode.getParent()),endPath=new CKEDITOR.dom.elementPath(endNode.getParent()),breakStart=null,breakEnd=null;for(var i=0;i<startPath.elements.length;i++){var element=startPath.elements[i];if(element==startPath.block||element==startPath.blockLimit)
break;if(me.checkElementRemovable(element))
breakStart=element;}
for(i=0;i<endPath.elements.length;i++){element=endPath.elements[i];if(element==endPath.block||element==endPath.blockLimit)
break;if(me.checkElementRemovable(element))
breakEnd=element;}
if(breakEnd)
endNode.breakParent(breakEnd);if(breakStart)
startNode.breakParent(breakStart);}}
function applyStyleOnNestedEditables(editablesContainer){var editables=findNestedEditables(editablesContainer),editable,l=editables.length,i=0,range=l&&new CKEDITOR.dom.range(editablesContainer.getDocument());for(;i<l;++i){editable=editables[i];if(checkIfAllowedInEditable(editable,this)){range.selectNodeContents(editable);applyInlineStyle.call(this,range);}}}
function findNestedEditables(container){var editables=[];container.forEach(function(element){if(element.getAttribute('contenteditable')=='true'){editables.push(element);return false;}},CKEDITOR.NODE_ELEMENT,true);return editables;}
function checkIfAllowedInEditable(editable,style){var filter=CKEDITOR.filter.instances[editable.data('cke-filter')];return filter?filter.check(style):1;}
function checkIfAllowedByIterator(iterator,style){return iterator.activeFilter?iterator.activeFilter.check(style):1;}
function applyObjectStyle(range){var start=range.getEnclosedNode()||range.getCommonAncestor(false,true),element=new CKEDITOR.dom.elementPath(start,range.root).contains(this.element,1);element&&!element.isReadOnly()&&setupElement(element,this);}
function removeObjectStyle(range){var parent=range.getCommonAncestor(true,true),element=new CKEDITOR.dom.elementPath(parent,range.root).contains(this.element,1);if(!element)
return;var style=this,def=style._.definition,attributes=def.attributes;if(attributes){for(var att in attributes)
element.removeAttribute(att,attributes[att]);}
if(def.styles){for(var i in def.styles){if(def.styles.hasOwnProperty(i))
element.removeStyle(i);}}}
function applyBlockStyle(range){var bookmark=range.createBookmark(true);var iterator=range.createIterator();iterator.enforceRealBlocks=true;if(this._.enterMode)
iterator.enlargeBr=(this._.enterMode!=CKEDITOR.ENTER_BR);var block,doc=range.document,previousPreBlock,newBlock;while((block=iterator.getNextParagraph())){if(!block.isReadOnly()&&checkIfAllowedByIterator(iterator,this)){newBlock=getElement(this,doc,block);replaceBlock(block,newBlock);}}
range.moveToBookmark(bookmark);}
function removeBlockStyle(range){var bookmark=range.createBookmark(1);var iterator=range.createIterator();iterator.enforceRealBlocks=true;iterator.enlargeBr=this._.enterMode!=CKEDITOR.ENTER_BR;var block,newBlock;while((block=iterator.getNextParagraph())){if(this.checkElementRemovable(block)){if(block.is('pre')){newBlock=this._.enterMode==CKEDITOR.ENTER_BR?null:range.document.createElement(this._.enterMode==CKEDITOR.ENTER_P?'p':'div');newBlock&&block.copyAttributes(newBlock);replaceBlock(block,newBlock);}else
removeFromElement.call(this,block);}}
range.moveToBookmark(bookmark);}
function replaceBlock(block,newBlock){var removeBlock=!newBlock;if(removeBlock){newBlock=block.getDocument().createElement('div');block.copyAttributes(newBlock);}
var newBlockIsPre=newBlock&&newBlock.is('pre'),blockIsPre=block.is('pre'),isToPre=newBlockIsPre&&!blockIsPre,isFromPre=!newBlockIsPre&&blockIsPre;if(isToPre)
newBlock=toPre(block,newBlock);else if(isFromPre)
newBlock=fromPres(removeBlock?[block.getHtml()]:splitIntoPres(block),newBlock);else
block.moveChildren(newBlock);newBlock.replace(block);if(newBlockIsPre){mergePre(newBlock);}else if(removeBlock)
removeNoAttribsElement(newBlock);}
function mergePre(preBlock){var previousBlock;if(!((previousBlock=preBlock.getPrevious(nonWhitespaces))&&previousBlock.type==CKEDITOR.NODE_ELEMENT&&previousBlock.is('pre')))
return;var mergedHtml=replace(previousBlock.getHtml(),/\n$/,'')+'\n\n'+
replace(preBlock.getHtml(),/^\n/,'');if(CKEDITOR.env.ie)
preBlock.$.outerHTML='<pre>'+mergedHtml+'</pre>';else
preBlock.setHtml(mergedHtml);previousBlock.remove();}
function splitIntoPres(preBlock){var duoBrRegex=/(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi,blockName=preBlock.getName(),pres=[],splitedHtml=replace(preBlock.getOuterHtml(),duoBrRegex,function(match,charBefore,bookmark){return charBefore+'</pre>'+bookmark+'<pre>';});splitedHtml.replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi,function(match,preContent){pres.push(preContent);});return pres;}
function replace(str,regexp,replacement){var headBookmark='',tailBookmark='';str=str.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi,function(str,m1,m2){m1&&(headBookmark=m1);m2&&(tailBookmark=m2);return'';});return headBookmark+str.replace(regexp,replacement)+tailBookmark;}
function fromPres(preHtmls,newBlock){var docFrag;if(preHtmls.length>1)
docFrag=new CKEDITOR.dom.documentFragment(newBlock.getDocument());for(var i=0;i<preHtmls.length;i++){var blockHtml=preHtmls[i];blockHtml=blockHtml.replace(/(\r\n|\r)/g,'\n');blockHtml=replace(blockHtml,/^[ \t]*\n/,'');blockHtml=replace(blockHtml,/\n$/,'');blockHtml=replace(blockHtml,/^[ \t]+|[ \t]+$/g,function(match,offset,s){if(match.length==1)
return'&nbsp;';else if(!offset)
return CKEDITOR.tools.repeat('&nbsp;',match.length-1)+' ';else
return' '+CKEDITOR.tools.repeat('&nbsp;',match.length-1);});blockHtml=blockHtml.replace(/\n/g,'<br>');blockHtml=blockHtml.replace(/[ \t]{2,}/g,function(match){return CKEDITOR.tools.repeat('&nbsp;',match.length-1)+' ';});if(docFrag){var newBlockClone=newBlock.clone();newBlockClone.setHtml(blockHtml);docFrag.append(newBlockClone);}else
newBlock.setHtml(blockHtml);}
return docFrag||newBlock;}
function toPre(block,newBlock){var bogus=block.getBogus();bogus&&bogus.remove();var preHtml=block.getHtml();preHtml=replace(preHtml,/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g,'');preHtml=preHtml.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi,'$1');preHtml=preHtml.replace(/([ \t\n\r]+|&nbsp;)/g,' ');preHtml=preHtml.replace(/<br\b[^>]*>/gi,'\n');if(CKEDITOR.env.ie){var temp=block.getDocument().createElement('div');temp.append(newBlock);newBlock.$.outerHTML='<pre>'+preHtml+'</pre>';newBlock.copyAttributes(temp.getFirst());newBlock=temp.getFirst().remove();}else
newBlock.setHtml(preHtml);return newBlock;}
function removeFromElement(element,keepDataAttrs){var def=this._.definition,attributes=def.attributes,styles=def.styles,overrides=getOverrides(this)[element.getName()],removeEmpty=CKEDITOR.tools.isEmpty(attributes)&&CKEDITOR.tools.isEmpty(styles);for(var attName in attributes){if((attName=='class'||this._.definition.fullMatch)&&element.getAttribute(attName)!=normalizeProperty(attName,attributes[attName]))
continue;if(keepDataAttrs&&attName.slice(0,5)=='data-')
continue;removeEmpty=element.hasAttribute(attName);element.removeAttribute(attName);}
for(var styleName in styles){if(this._.definition.fullMatch&&element.getStyle(styleName)!=normalizeProperty(styleName,styles[styleName],true))
continue;removeEmpty=removeEmpty||!!element.getStyle(styleName);element.removeStyle(styleName);}
removeOverrides(element,overrides,blockElements[element.getName()]);if(removeEmpty){if(this._.definition.alwaysRemoveElement)
removeNoAttribsElement(element,1);else{if(!CKEDITOR.dtd.$block[element.getName()]||this._.enterMode==CKEDITOR.ENTER_BR&&!element.hasAttributes())
removeNoAttribsElement(element);else
element.renameNode(this._.enterMode==CKEDITOR.ENTER_P?'p':'div');}}}
function removeFromInsideElement(element){var def=this._.definition,attribs=def.attributes,styles=def.styles,overrides=getOverrides(this),innerElements=element.getElementsByTag(this.element),innerElement;for(var i=innerElements.count();--i>=0;){innerElement=innerElements.getItem(i);if(!innerElement.isReadOnly())
removeFromElement.call(this,innerElement,true);}
for(var overrideElement in overrides){if(overrideElement!=this.element){innerElements=element.getElementsByTag(overrideElement);for(i=innerElements.count()-1;i>=0;i--){innerElement=innerElements.getItem(i);if(!innerElement.isReadOnly())
removeOverrides(innerElement,overrides[overrideElement]);}}}}
function removeOverrides(element,overrides,dontRemove){var attributes=overrides&&overrides.attributes;if(attributes){for(var i=0;i<attributes.length;i++){var attName=attributes[i][0],actualAttrValue;if((actualAttrValue=element.getAttribute(attName))){var attValue=attributes[i][1];if(attValue===null||(attValue.test&&attValue.test(actualAttrValue))||(typeof attValue=='string'&&actualAttrValue==attValue))
element.removeAttribute(attName);}}}
if(!dontRemove)
removeNoAttribsElement(element);}
function removeNoAttribsElement(element,forceRemove){if(!element.hasAttributes()||forceRemove){if(CKEDITOR.dtd.$block[element.getName()]){var previous=element.getPrevious(nonWhitespaces),next=element.getNext(nonWhitespaces);if(previous&&(previous.type==CKEDITOR.NODE_TEXT||!previous.isBlockBoundary({br:1})))
element.append('br',1);if(next&&(next.type==CKEDITOR.NODE_TEXT||!next.isBlockBoundary({br:1})))
element.append('br');element.remove(true);}else{var firstChild=element.getFirst();var lastChild=element.getLast();element.remove(true);if(firstChild){firstChild.type==CKEDITOR.NODE_ELEMENT&&firstChild.mergeSiblings();if(lastChild&&!firstChild.equals(lastChild)&&lastChild.type==CKEDITOR.NODE_ELEMENT)
lastChild.mergeSiblings();}}}}
function getElement(style,targetDocument,element){var el,def=style._.definition,elementName=style.element;if(elementName=='*')
elementName='span';el=new CKEDITOR.dom.element(elementName,targetDocument);if(element)
element.copyAttributes(el);el=setupElement(el,style);if(targetDocument.getCustomData('doc_processing_style')&&el.hasAttribute('id'))
el.removeAttribute('id');else
targetDocument.setCustomData('doc_processing_style',1);return el;}
function setupElement(el,style){var def=style._.definition,attributes=def.attributes,styles=CKEDITOR.style.getStyleText(def);if(attributes){for(var att in attributes)
el.setAttribute(att,attributes[att]);}
if(styles)
el.setAttribute('style',styles);return el;}
function replaceVariables(list,variablesValues){for(var item in list){list[item]=list[item].replace(varRegex,function(match,varName){return variablesValues[varName];});}}
function getAttributesForComparison(styleDefinition){var attribs=styleDefinition._AC;if(attribs)
return attribs;attribs={};var length=0;var styleAttribs=styleDefinition.attributes;if(styleAttribs){for(var styleAtt in styleAttribs){length++;attribs[styleAtt]=styleAttribs[styleAtt];}}
var styleText=CKEDITOR.style.getStyleText(styleDefinition);if(styleText){if(!attribs['style'])
length++;attribs['style']=styleText;}
attribs._length=length;return(styleDefinition._AC=attribs);}
function getOverrides(style){if(style._.overrides)
return style._.overrides;var overrides=(style._.overrides={}),definition=style._.definition.overrides;if(definition){if(!CKEDITOR.tools.isArray(definition))
definition=[definition];for(var i=0;i<definition.length;i++){var override=definition[i],elementName,overrideEl,attrs;if(typeof override=='string')
elementName=override.toLowerCase();else{elementName=override.element?override.element.toLowerCase():style.element;attrs=override.attributes;}
overrideEl=overrides[elementName]||(overrides[elementName]={});if(attrs){var overrideAttrs=(overrideEl.attributes=overrideEl.attributes||new Array());for(var attName in attrs){overrideAttrs.push([attName.toLowerCase(),attrs[attName]]);}}}}
return overrides;}
function normalizeProperty(name,value,isStyle){var temp=new CKEDITOR.dom.element('span');temp[isStyle?'setStyle':'setAttribute'](name,value);return temp[isStyle?'getStyle':'getAttribute'](name);}
function compareCssText(source,target){if(typeof source=='string')
source=CKEDITOR.tools.parseCssText(source);if(typeof target=='string')
target=CKEDITOR.tools.parseCssText(target,true);for(var name in source){if(!(name in target&&(target[name]==source[name]||source[name]=='inherit'||target[name]=='inherit')))
return false;}
return true;}
function applyStyleOnSelection(selection,remove){var doc=selection.document,ranges=selection.getRanges(),func=remove?this.removeFromRange:this.applyToRange,range;var iterator=ranges.createIterator();while((range=iterator.getNextRange()))
func.call(this,range);selection.selectRanges(ranges);doc.removeCustomData('doc_processing_style');}})();CKEDITOR.styleCommand=function(style,ext){this.style=style;this.allowedContent=style;this.requiredContent=style;CKEDITOR.tools.extend(this,ext,true);};CKEDITOR.styleCommand.prototype.exec=function(editor){editor.focus();if(this.state==CKEDITOR.TRISTATE_OFF)
editor.applyStyle(this.style);else if(this.state==CKEDITOR.TRISTATE_ON)
editor.removeStyle(this.style);};CKEDITOR.stylesSet=new CKEDITOR.resourceManager('','stylesSet');CKEDITOR.addStylesSet=CKEDITOR.tools.bind(CKEDITOR.stylesSet.add,CKEDITOR.stylesSet);CKEDITOR.loadStylesSet=function(name,url,callback){CKEDITOR.stylesSet.addExternal(name,url,'');CKEDITOR.stylesSet.load(name,callback);};CKEDITOR.editor.prototype.getStylesSet=function(callback){if(!this._.stylesDefinitions){var editor=this,configStyleSet=editor.config.stylesCombo_stylesSet||editor.config.stylesSet;if(configStyleSet===false){callback(null);return;}
if(configStyleSet instanceof Array){editor._.stylesDefinitions=configStyleSet;callback(configStyleSet);return;}
if(!configStyleSet)
configStyleSet='default';var partsStylesSet=configStyleSet.split(':'),styleSetName=partsStylesSet[0],externalPath=partsStylesSet[1];CKEDITOR.stylesSet.addExternal(styleSetName,externalPath?partsStylesSet.slice(1).join(':'):CKEDITOR.getUrl('styles.js'),'');CKEDITOR.stylesSet.load(styleSetName,function(stylesSet){editor._.stylesDefinitions=stylesSet[styleSetName];callback(editor._.stylesDefinitions);});}else
callback(this._.stylesDefinitions);};