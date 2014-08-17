
CKEDITOR.dom.element=function(element,ownerDocument){if(typeof element=='string')
element=(ownerDocument?ownerDocument.$:document).createElement(element);CKEDITOR.dom.domObject.call(this,element);};CKEDITOR.dom.element.get=function(element){var el=typeof element=='string'?document.getElementById(element)||document.getElementsByName(element)[0]:element;return el&&(el.$?el:new CKEDITOR.dom.element(el));};CKEDITOR.dom.element.prototype=new CKEDITOR.dom.node();CKEDITOR.dom.element.createFromHtml=function(html,ownerDocument){var temp=new CKEDITOR.dom.element('div',ownerDocument);temp.setHtml(html);return temp.getFirst().remove();};CKEDITOR.dom.element.setMarker=function(database,element,name,value){var id=element.getCustomData('list_marker_id')||(element.setCustomData('list_marker_id',CKEDITOR.tools.getNextNumber()).getCustomData('list_marker_id')),markerNames=element.getCustomData('list_marker_names')||(element.setCustomData('list_marker_names',{}).getCustomData('list_marker_names'));database[id]=element;markerNames[name]=1;return element.setCustomData(name,value);};CKEDITOR.dom.element.clearAllMarkers=function(database){for(var i in database)
CKEDITOR.dom.element.clearMarkers(database,database[i],1);};CKEDITOR.dom.element.clearMarkers=function(database,element,removeFromDatabase){var names=element.getCustomData('list_marker_names'),id=element.getCustomData('list_marker_id');for(var i in names)
element.removeCustomData(i);element.removeCustomData('list_marker_names');if(removeFromDatabase){element.removeCustomData('list_marker_id');delete database[id];}};(function(){CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype,{type:CKEDITOR.NODE_ELEMENT,addClass:function(className){var c=this.$.className;if(c){var regex=new RegExp('(?:^|\\s)'+className+'(?:\\s|$)','');if(!regex.test(c))
c+=' '+className;}
this.$.className=c||className;},removeClass:function(className){var c=this.getAttribute('class');if(c){var regex=new RegExp('(?:^|\\s+)'+className+'(?=\\s|$)','i');if(regex.test(c)){c=c.replace(regex,'').replace(/^\s+/,'');if(c)
this.setAttribute('class',c);else
this.removeAttribute('class');}}
return this;},hasClass:function(className){var regex=new RegExp('(?:^|\\s+)'+className+'(?=\\s|$)','');return regex.test(this.getAttribute('class'));},append:function(node,toStart){if(typeof node=='string')
node=this.getDocument().createElement(node);if(toStart)
this.$.insertBefore(node.$,this.$.firstChild);else
this.$.appendChild(node.$);return node;},appendHtml:function(html){if(!this.$.childNodes.length)
this.setHtml(html);else{var temp=new CKEDITOR.dom.element('div',this.getDocument());temp.setHtml(html);temp.moveChildren(this);}},appendText:function(text){if(this.$.text!=undefined)
this.$.text+=text;else
this.append(new CKEDITOR.dom.text(text));},appendBogus:function(force){if(!force&&!(CKEDITOR.env.needsBrFiller||CKEDITOR.env.opera))
return;var lastChild=this.getLast();while(lastChild&&lastChild.type==CKEDITOR.NODE_TEXT&&!CKEDITOR.tools.rtrim(lastChild.getText()))
lastChild=lastChild.getPrevious();if(!lastChild||!lastChild.is||!lastChild.is('br')){var bogus=CKEDITOR.env.opera?this.getDocument().createText(''):this.getDocument().createElement('br');CKEDITOR.env.gecko&&bogus.setAttribute('type','_moz');this.append(bogus);}},breakParent:function(parent){var range=new CKEDITOR.dom.range(this.getDocument());range.setStartAfter(this);range.setEndAfter(parent);var docFrag=range.extractContents();range.insertNode(this.remove());docFrag.insertAfterNode(this);},contains:CKEDITOR.env.ie||CKEDITOR.env.webkit?function(node){var $=this.$;return node.type!=CKEDITOR.NODE_ELEMENT?$.contains(node.getParent().$):$!=node.$&&$.contains(node.$);}:function(node){return!!(this.$.compareDocumentPosition(node.$)&16);},focus:(function(){function exec(){try{this.$.focus();}catch(e){}}
return function(defer){if(defer)
CKEDITOR.tools.setTimeout(exec,100,this);else
exec.call(this);};})(),getHtml:function(){var retval=this.$.innerHTML;return CKEDITOR.env.ie?retval.replace(/<\?[^>]*>/g,''):retval;},getOuterHtml:function(){if(this.$.outerHTML){return this.$.outerHTML.replace(/<\?[^>]*>/,'');}
var tmpDiv=this.$.ownerDocument.createElement('div');tmpDiv.appendChild(this.$.cloneNode(true));return tmpDiv.innerHTML;},getClientRect:function(){var rect=CKEDITOR.tools.extend({},this.$.getBoundingClientRect());!rect.width&&(rect.width=rect.right-rect.left);!rect.height&&(rect.height=rect.bottom-rect.top);return rect;},setHtml:(CKEDITOR.env.ie&&CKEDITOR.env.version<9)?function(html){try{var $=this.$;if(this.getParent())
return($.innerHTML=html);else{var $frag=this.getDocument()._getHtml5ShivFrag();$frag.appendChild($);$.innerHTML=html;$frag.removeChild($);return html;}}
catch(e){this.$.innerHTML='';var temp=new CKEDITOR.dom.element('body',this.getDocument());temp.$.innerHTML=html;var children=temp.getChildren();while(children.count())
this.append(children.getItem(0));return html;}}:function(html){return(this.$.innerHTML=html);},setText:function(text){CKEDITOR.dom.element.prototype.setText=(this.$.innerText!=undefined)?function(text){return this.$.innerText=text;}:function(text){return this.$.textContent=text;};return this.setText(text);},getAttribute:(function(){var standard=function(name){return this.$.getAttribute(name,2);};if(CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||CKEDITOR.env.ie6Compat)){return function(name){switch(name){case'class':name='className';break;case'http-equiv':name='httpEquiv';break;case'name':return this.$.name;case'tabindex':var tabIndex=standard.call(this,name);if(tabIndex!==0&&this.$.tabIndex===0)
tabIndex=null;return tabIndex;break;case'checked':{var attr=this.$.attributes.getNamedItem(name),attrValue=attr.specified?attr.nodeValue:this.$.checked;return attrValue?'checked':null;}
case'hspace':case'value':return this.$[name];case'style':return this.$.style.cssText;case'contenteditable':case'contentEditable':return this.$.attributes.getNamedItem('contentEditable').specified?this.$.getAttribute('contentEditable'):null;}
return standard.call(this,name);};}else
return standard;})(),getChildren:function(){return new CKEDITOR.dom.nodeList(this.$.childNodes);},getComputedStyle:CKEDITOR.env.ie?function(propertyName){return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(propertyName)];}:function(propertyName){var style=this.getWindow().$.getComputedStyle(this.$,null);return style?style.getPropertyValue(propertyName):'';},getDtd:function(){var dtd=CKEDITOR.dtd[this.getName()];this.getDtd=function(){return dtd;};return dtd;},getElementsByTag:CKEDITOR.dom.document.prototype.getElementsByTag,getTabIndex:CKEDITOR.env.ie?function(){var tabIndex=this.$.tabIndex;if(tabIndex===0&&!CKEDITOR.dtd.$tabIndex[this.getName()]&&parseInt(this.getAttribute('tabindex'),10)!==0)
tabIndex=-1;return tabIndex;}:CKEDITOR.env.webkit?function(){var tabIndex=this.$.tabIndex;if(tabIndex==undefined){tabIndex=parseInt(this.getAttribute('tabindex'),10);if(isNaN(tabIndex))
tabIndex=-1;}
return tabIndex;}:function(){return this.$.tabIndex;},getText:function(){return this.$.textContent||this.$.innerText||'';},getWindow:function(){return this.getDocument().getWindow();},getId:function(){return this.$.id||null;},getNameAtt:function(){return this.$.name||null;},getName:function(){var nodeName=this.$.nodeName.toLowerCase();if(CKEDITOR.env.ie&&!(document.documentMode>8)){var scopeName=this.$.scopeName;if(scopeName!='HTML')
nodeName=scopeName.toLowerCase()+':'+nodeName;}
return(this.getName=function(){return nodeName;})();},getValue:function(){return this.$.value;},getFirst:function(evaluator){var first=this.$.firstChild,retval=first&&new CKEDITOR.dom.node(first);if(retval&&evaluator&&!evaluator(retval))
retval=retval.getNext(evaluator);return retval;},getLast:function(evaluator){var last=this.$.lastChild,retval=last&&new CKEDITOR.dom.node(last);if(retval&&evaluator&&!evaluator(retval))
retval=retval.getPrevious(evaluator);return retval;},getStyle:function(name){return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(name)];},is:function(){var name=this.getName();if(typeof arguments[0]=='object')
return!!arguments[0][name];for(var i=0;i<arguments.length;i++){if(arguments[i]==name)
return true;}
return false;},isEditable:function(textCursor){var name=this.getName();if(this.isReadOnly()||this.getComputedStyle('display')=='none'||this.getComputedStyle('visibility')=='hidden'||CKEDITOR.dtd.$nonEditable[name]||CKEDITOR.dtd.$empty[name]||(this.is('a')&&(this.data('cke-saved-name')||this.hasAttribute('name'))&&!this.getChildCount()))
{return false;}
if(textCursor!==false){var dtd=CKEDITOR.dtd[name]||CKEDITOR.dtd.span;return!!(dtd&&dtd['#']);}
return true;},isIdentical:function(otherElement){var thisEl=this.clone(0,1),otherEl=otherElement.clone(0,1);thisEl.removeAttributes(['_moz_dirty','data-cke-expando','data-cke-saved-href','data-cke-saved-name']);otherEl.removeAttributes(['_moz_dirty','data-cke-expando','data-cke-saved-href','data-cke-saved-name']);if(thisEl.$.isEqualNode){thisEl.$.style.cssText=CKEDITOR.tools.normalizeCssText(thisEl.$.style.cssText);otherEl.$.style.cssText=CKEDITOR.tools.normalizeCssText(otherEl.$.style.cssText);return thisEl.$.isEqualNode(otherEl.$);}else{thisEl=thisEl.getOuterHtml();otherEl=otherEl.getOuterHtml();if(CKEDITOR.env.ie&&CKEDITOR.env.version<9&&this.is('a')){var parent=this.getParent();if(parent.type==CKEDITOR.NODE_ELEMENT){var el=parent.clone();el.setHtml(thisEl),thisEl=el.getHtml();el.setHtml(otherEl),otherEl=el.getHtml();}}
return thisEl==otherEl;}},isVisible:function(){var isVisible=(this.$.offsetHeight||this.$.offsetWidth)&&this.getComputedStyle('visibility')!='hidden',elementWindow,elementWindowFrame;if(isVisible&&(CKEDITOR.env.webkit||CKEDITOR.env.opera)){elementWindow=this.getWindow();if(!elementWindow.equals(CKEDITOR.document.getWindow())&&(elementWindowFrame=elementWindow.$.frameElement))
isVisible=new CKEDITOR.dom.element(elementWindowFrame).isVisible();}
return!!isVisible;},isEmptyInlineRemoveable:function(){if(!CKEDITOR.dtd.$removeEmpty[this.getName()])
return false;var children=this.getChildren();for(var i=0,count=children.count();i<count;i++){var child=children.getItem(i);if(child.type==CKEDITOR.NODE_ELEMENT&&child.data('cke-bookmark'))
continue;if(child.type==CKEDITOR.NODE_ELEMENT&&!child.isEmptyInlineRemoveable()||child.type==CKEDITOR.NODE_TEXT&&CKEDITOR.tools.trim(child.getText()))
return false;}
return true;},hasAttributes:CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||CKEDITOR.env.ie6Compat)?function(){var attributes=this.$.attributes;for(var i=0;i<attributes.length;i++){var attribute=attributes[i];switch(attribute.nodeName){case'class':if(this.getAttribute('class'))
return true;case'data-cke-expando':continue;default:if(attribute.specified)
return true;}}
return false;}:function(){var attrs=this.$.attributes,attrsNum=attrs.length;var execludeAttrs={'data-cke-expando':1,_moz_dirty:1};return attrsNum>0&&(attrsNum>2||!execludeAttrs[attrs[0].nodeName]||(attrsNum==2&&!execludeAttrs[attrs[1].nodeName]));},hasAttribute:(function(){function standard(name){var $attr=this.$.attributes.getNamedItem(name);return!!($attr&&$attr.specified);}
return(CKEDITOR.env.ie&&CKEDITOR.env.version<8)?function(name){if(name=='name')
return!!this.$.name;return standard.call(this,name);}:standard;})(),hide:function(){this.setStyle('display','none');},moveChildren:function(target,toStart){var $=this.$;target=target.$;if($==target)
return;var child;if(toStart){while((child=$.lastChild))
target.insertBefore($.removeChild(child),target.firstChild);}else{while((child=$.firstChild))
target.appendChild($.removeChild(child));}},mergeSiblings:(function(){function mergeElements(element,sibling,isNext){if(sibling&&sibling.type==CKEDITOR.NODE_ELEMENT){var pendingNodes=[];while(sibling.data('cke-bookmark')||sibling.isEmptyInlineRemoveable()){pendingNodes.push(sibling);sibling=isNext?sibling.getNext():sibling.getPrevious();if(!sibling||sibling.type!=CKEDITOR.NODE_ELEMENT)
return;}
if(element.isIdentical(sibling)){var innerSibling=isNext?element.getLast():element.getFirst();while(pendingNodes.length)
pendingNodes.shift().move(element,!isNext);sibling.moveChildren(element,!isNext);sibling.remove();if(innerSibling&&innerSibling.type==CKEDITOR.NODE_ELEMENT)
innerSibling.mergeSiblings();}}}
return function(inlineOnly){if(!(inlineOnly===false||CKEDITOR.dtd.$removeEmpty[this.getName()]||this.is('a')))
{return;}
mergeElements(this,this.getNext(),true);mergeElements(this,this.getPrevious());};})(),show:function(){this.setStyles({display:'',visibility:''});},setAttribute:(function(){var standard=function(name,value){this.$.setAttribute(name,value);return this;};if(CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||CKEDITOR.env.ie6Compat)){return function(name,value){if(name=='class')
this.$.className=value;else if(name=='style')
this.$.style.cssText=value;else if(name=='tabindex')
this.$.tabIndex=value;else if(name=='checked')
this.$.checked=value;else if(name=='contenteditable')
standard.call(this,'contentEditable',value);else
standard.apply(this,arguments);return this;};}else if(CKEDITOR.env.ie8Compat&&CKEDITOR.env.secure){return function(name,value){if(name=='src'&&value.match(/^http:\/\//))
try{standard.apply(this,arguments);}catch(e){}else
standard.apply(this,arguments);return this;};}else
return standard;})(),setAttributes:function(attributesPairs){for(var name in attributesPairs)
this.setAttribute(name,attributesPairs[name]);return this;},setValue:function(value){this.$.value=value;return this;},removeAttribute:(function(){var standard=function(name){this.$.removeAttribute(name);};if(CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||CKEDITOR.env.ie6Compat)){return function(name){if(name=='class')
name='className';else if(name=='tabindex')
name='tabIndex';else if(name=='contenteditable')
name='contentEditable';standard.call(this,name);};}else
return standard;})(),removeAttributes:function(attributes){if(CKEDITOR.tools.isArray(attributes)){for(var i=0;i<attributes.length;i++)
this.removeAttribute(attributes[i]);}else{for(var attr in attributes)
attributes.hasOwnProperty(attr)&&this.removeAttribute(attr);}},removeStyle:function(name){var $=this.$.style;if(!$.removeProperty&&(name=='border'||name=='margin'||name=='padding')){var names=expandedRules(name);for(var i=0;i<names.length;i++)
this.removeStyle(names[i]);return;}
$.removeProperty?$.removeProperty(name):$.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(name));if(!this.$.style.cssText)
this.removeAttribute('style');},setStyle:function(name,value){this.$.style[CKEDITOR.tools.cssStyleToDomStyle(name)]=value;return this;},setStyles:function(stylesPairs){for(var name in stylesPairs)
this.setStyle(name,stylesPairs[name]);return this;},setOpacity:function(opacity){if(CKEDITOR.env.ie&&CKEDITOR.env.version<9){opacity=Math.round(opacity*100);this.setStyle('filter',opacity>=100?'':'progid:DXImageTransform.Microsoft.Alpha(opacity='+opacity+')');}else
this.setStyle('opacity',opacity);},unselectable:function(){this.setStyles(CKEDITOR.tools.cssVendorPrefix('user-select','none'));if(CKEDITOR.env.ie||CKEDITOR.env.opera){this.setAttribute('unselectable','on');var element,elements=this.getElementsByTag("*");for(var i=0,count=elements.count();i<count;i++){element=elements.getItem(i);element.setAttribute('unselectable','on');}}},getPositionedAncestor:function(){var current=this;while(current.getName()!='html'){if(current.getComputedStyle('position')!='static')
return current;current=current.getParent();}
return null;},getDocumentPosition:function(refDocument){var x=0,y=0,doc=this.getDocument(),body=doc.getBody(),quirks=doc.$.compatMode=='BackCompat';if(document.documentElement["getBoundingClientRect"]){var box=this.$.getBoundingClientRect(),$doc=doc.$,$docElem=$doc.documentElement;var clientTop=$docElem.clientTop||body.$.clientTop||0,clientLeft=$docElem.clientLeft||body.$.clientLeft||0,needAdjustScrollAndBorders=true;if(CKEDITOR.env.ie){var inDocElem=doc.getDocumentElement().contains(this),inBody=doc.getBody().contains(this);needAdjustScrollAndBorders=(quirks&&inBody)||(!quirks&&inDocElem);}
if(needAdjustScrollAndBorders){x=box.left+(!quirks&&$docElem.scrollLeft||body.$.scrollLeft);x-=clientLeft;y=box.top+(!quirks&&$docElem.scrollTop||body.$.scrollTop);y-=clientTop;}}else{var current=this,previous=null,offsetParent;while(current&&!(current.getName()=='body'||current.getName()=='html')){x+=current.$.offsetLeft-current.$.scrollLeft;y+=current.$.offsetTop-current.$.scrollTop;if(!current.equals(this)){x+=(current.$.clientLeft||0);y+=(current.$.clientTop||0);}
var scrollElement=previous;while(scrollElement&&!scrollElement.equals(current)){x-=scrollElement.$.scrollLeft;y-=scrollElement.$.scrollTop;scrollElement=scrollElement.getParent();}
previous=current;current=(offsetParent=current.$.offsetParent)?new CKEDITOR.dom.element(offsetParent):null;}}
if(refDocument){var currentWindow=this.getWindow(),refWindow=refDocument.getWindow();if(!currentWindow.equals(refWindow)&&currentWindow.$.frameElement){var iframePosition=(new CKEDITOR.dom.element(currentWindow.$.frameElement)).getDocumentPosition(refDocument);x+=iframePosition.x;y+=iframePosition.y;}}
if(!document.documentElement["getBoundingClientRect"]){if(CKEDITOR.env.gecko&&!quirks){x+=this.$.clientLeft?1:0;y+=this.$.clientTop?1:0;}}
return{x:x,y:y};},scrollIntoView:function(alignToTop){var parent=this.getParent();if(!parent)
return;do{var overflowed=parent.$.clientWidth&&parent.$.clientWidth<parent.$.scrollWidth||parent.$.clientHeight&&parent.$.clientHeight<parent.$.scrollHeight;if(overflowed&&!parent.is('body'))
this.scrollIntoParent(parent,alignToTop,1);if(parent.is('html')){var win=parent.getWindow();try{var iframe=win.$.frameElement;iframe&&(parent=new CKEDITOR.dom.element(iframe));}catch(er){}}}
while((parent=parent.getParent()));},scrollIntoParent:function(parent,alignToTop,hscroll){!parent&&(parent=this.getWindow());var doc=parent.getDocument();var isQuirks=doc.$.compatMode=='BackCompat';if(parent instanceof CKEDITOR.dom.window)
parent=isQuirks?doc.getBody():doc.getDocumentElement();function scrollBy(x,y){if(/body|html/.test(parent.getName()))
parent.getWindow().$.scrollBy(x,y);else{parent.$['scrollLeft']+=x;parent.$['scrollTop']+=y;}}
function screenPos(element,refWin){var pos={x:0,y:0};if(!(element.is(isQuirks?'body':'html'))){var box=element.$.getBoundingClientRect();pos.x=box.left,pos.y=box.top;}
var win=element.getWindow();if(!win.equals(refWin)){var outerPos=screenPos(CKEDITOR.dom.element.get(win.$.frameElement),refWin);pos.x+=outerPos.x,pos.y+=outerPos.y;}
return pos;}
function margin(element,side){return parseInt(element.getComputedStyle('margin-'+side)||0,10)||0;}
var win=parent.getWindow();var thisPos=screenPos(this,win),parentPos=screenPos(parent,win),eh=this.$.offsetHeight,ew=this.$.offsetWidth,ch=parent.$.clientHeight,cw=parent.$.clientWidth,lt,br;lt={x:thisPos.x-margin(this,'left')-parentPos.x||0,y:thisPos.y-margin(this,'top')-parentPos.y||0};br={x:thisPos.x+ew+margin(this,'right')-((parentPos.x)+cw)||0,y:thisPos.y+eh+margin(this,'bottom')-((parentPos.y)+ch)||0};if(lt.y<0||br.y>0)
scrollBy(0,alignToTop===true?lt.y:alignToTop===false?br.y:lt.y<0?lt.y:br.y);if(hscroll&&(lt.x<0||br.x>0))
scrollBy(lt.x<0?lt.x:br.x,0);},setState:function(state,base,useAria){base=base||'cke';switch(state){case CKEDITOR.TRISTATE_ON:this.addClass(base+'_on');this.removeClass(base+'_off');this.removeClass(base+'_disabled');useAria&&this.setAttribute('aria-pressed',true);useAria&&this.removeAttribute('aria-disabled');break;case CKEDITOR.TRISTATE_DISABLED:this.addClass(base+'_disabled');this.removeClass(base+'_off');this.removeClass(base+'_on');useAria&&this.setAttribute('aria-disabled',true);useAria&&this.removeAttribute('aria-pressed');break;default:this.addClass(base+'_off');this.removeClass(base+'_on');this.removeClass(base+'_disabled');useAria&&this.removeAttribute('aria-pressed');useAria&&this.removeAttribute('aria-disabled');break;}},getFrameDocument:function(){var $=this.$;try{$.contentWindow.document;}catch(e){$.src=$.src;}
return $&&new CKEDITOR.dom.document($.contentWindow.document);},copyAttributes:function(dest,skipAttributes){var attributes=this.$.attributes;skipAttributes=skipAttributes||{};for(var n=0;n<attributes.length;n++){var attribute=attributes[n];var attrName=attribute.nodeName.toLowerCase(),attrValue;if(attrName in skipAttributes)
continue;if(attrName=='checked'&&(attrValue=this.getAttribute(attrName)))
dest.setAttribute(attrName,attrValue);else if(attribute.specified||(CKEDITOR.env.ie&&attribute.nodeValue&&attrName=='value')){attrValue=this.getAttribute(attrName);if(attrValue===null)
attrValue=attribute.nodeValue;dest.setAttribute(attrName,attrValue);}}
if(this.$.style.cssText!=='')
dest.$.style.cssText=this.$.style.cssText;},renameNode:function(newTag){if(this.getName()==newTag)
return;var doc=this.getDocument();var newNode=new CKEDITOR.dom.element(newTag,doc);this.copyAttributes(newNode);this.moveChildren(newNode);this.getParent()&&this.$.parentNode.replaceChild(newNode.$,this.$);newNode.$['data-cke-expando']=this.$['data-cke-expando'];this.$=newNode.$;},getChild:(function(){function getChild(rawNode,index){var childNodes=rawNode.childNodes;if(index>=0&&index<childNodes.length)
return childNodes[index];}
return function(indices){var rawNode=this.$;if(!indices.slice)
rawNode=getChild(rawNode,indices);else{while(indices.length>0&&rawNode)
rawNode=getChild(rawNode,indices.shift());}
return rawNode?new CKEDITOR.dom.node(rawNode):null;};})(),getChildCount:function(){return this.$.childNodes.length;},disableContextMenu:function(){this.on('contextmenu',function(event){if(!event.data.getTarget().hasClass('cke_enable_context_menu'))
event.data.preventDefault();});},getDirection:function(useComputed){if(useComputed){return this.getComputedStyle('direction')||this.getDirection()||this.getParent()&&this.getParent().getDirection(1)||this.getDocument().$.dir||'ltr';}
else
return this.getStyle('direction')||this.getAttribute('dir');},data:function(name,value){name='data-'+name;if(value===undefined)
return this.getAttribute(name);else if(value===false)
this.removeAttribute(name);else
this.setAttribute(name,value);return null;},getEditor:function(){var instances=CKEDITOR.instances,name,instance;for(name in instances){instance=instances[name];if(instance.element.equals(this)&&instance.elementMode!=CKEDITOR.ELEMENT_MODE_APPENDTO)
return instance;}
return null;},find:function(selector){var removeTmpId=createTmpId(this),list=new CKEDITOR.dom.nodeList(this.$.querySelectorAll(getContextualizedSelector(this,selector)));removeTmpId();return list;},findOne:function(selector){var removeTmpId=createTmpId(this),found=this.$.querySelector(getContextualizedSelector(this,selector));removeTmpId();return found?new CKEDITOR.dom.element(found):null;},forEach:function(callback,type,skipRoot){if(!skipRoot&&(!type||this.type==type))
var ret=callback(this);if(ret===false)
return;var children=this.getChildren(),node,i=0;for(;i<children.count();i++){node=children.getItem(i);if(node.type==CKEDITOR.NODE_ELEMENT)
node.forEach(callback,type);else if(!type||node.type==type)
callback(node);}}});function createTmpId(element){var hadId=true;if(!element.$.id){element.$.id='cke_tmp_'+CKEDITOR.tools.getNextNumber();hadId=false;}
return function(){if(!hadId)
element.removeAttribute('id');};}
function getContextualizedSelector(element,selector){return'#'+element.$.id+' '+selector.split(/,\s*/).join(', #'+element.$.id+' ');}
var sides={width:['border-left-width','border-right-width','padding-left','padding-right'],height:['border-top-width','border-bottom-width','padding-top','padding-bottom']};function expandedRules(style){var sides=['top','left','right','bottom'],components;if(style=='border')
components=['color','style','width'];var styles=[];for(var i=0;i<sides.length;i++){if(components){for(var j=0;j<components.length;j++)
styles.push([style,sides[i],components[j]].join('-'));}
else
styles.push([style,sides[i]].join('-'));}
return styles;}
function marginAndPaddingSize(type){var adjustment=0;for(var i=0,len=sides[type].length;i<len;i++)
adjustment+=parseInt(this.getComputedStyle(sides[type][i])||0,10)||0;return adjustment;}
CKEDITOR.dom.element.prototype.setSize=function(type,size,isBorderBox){if(typeof size=='number'){if(isBorderBox&&!(CKEDITOR.env.ie&&CKEDITOR.env.quirks))
size-=marginAndPaddingSize.call(this,type);this.setStyle(type,size+'px');}};CKEDITOR.dom.element.prototype.getSize=function(type,isBorderBox){var size=Math.max(this.$['offset'+CKEDITOR.tools.capitalize(type)],this.$['client'+CKEDITOR.tools.capitalize(type)])||0;if(isBorderBox)
size-=marginAndPaddingSize.call(this,type);return size;};})();