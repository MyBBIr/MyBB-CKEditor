'use strict';CKEDITOR.htmlParser.fragment=function(){this.children=[];this.parent=null;this._={isBlockLike:true,hasInlineStarted:false};};(function(){var nonBreakingBlocks=CKEDITOR.tools.extend({table:1,ul:1,ol:1,dl:1},CKEDITOR.dtd.table,CKEDITOR.dtd.ul,CKEDITOR.dtd.ol,CKEDITOR.dtd.dl);var listBlocks={ol:1,ul:1};var rootDtd=CKEDITOR.tools.extend({},{html:1},CKEDITOR.dtd.html,CKEDITOR.dtd.body,CKEDITOR.dtd.head,{style:1,script:1});function isRemoveEmpty(node){if(node.attributes['data-cke-survive'])
return false;return node.name=='a'&&node.attributes.href||CKEDITOR.dtd.$removeEmpty[node.name];}
CKEDITOR.htmlParser.fragment.fromHtml=function(fragmentHtml,parent,fixingBlock){var parser=new CKEDITOR.htmlParser();var root=parent instanceof CKEDITOR.htmlParser.element?parent:typeof parent=='string'?new CKEDITOR.htmlParser.element(parent):new CKEDITOR.htmlParser.fragment();var pendingInline=[],pendingBRs=[],currentNode=root,inTextarea=root.name=='textarea',inPre=root.name=='pre';function checkPending(newTagName){var pendingBRsSent;if(pendingInline.length>0){for(var i=0;i<pendingInline.length;i++){var pendingElement=pendingInline[i],pendingName=pendingElement.name,pendingDtd=CKEDITOR.dtd[pendingName],currentDtd=currentNode.name&&CKEDITOR.dtd[currentNode.name];if((!currentDtd||currentDtd[pendingName])&&(!newTagName||!pendingDtd||pendingDtd[newTagName]||!CKEDITOR.dtd[newTagName])){if(!pendingBRsSent){sendPendingBRs();pendingBRsSent=1;}
pendingElement=pendingElement.clone();pendingElement.parent=currentNode;currentNode=pendingElement;pendingInline.splice(i,1);i--;}else{if(pendingName==currentNode.name)
addElement(currentNode,currentNode.parent,1),i--;}}}}
function sendPendingBRs(){while(pendingBRs.length)
addElement(pendingBRs.shift(),currentNode);}
function removeTailWhitespace(element){if(element._.isBlockLike&&element.name!='pre'&&element.name!='textarea'){var length=element.children.length,lastChild=element.children[length-1],text;if(lastChild&&lastChild.type==CKEDITOR.NODE_TEXT){if(!(text=CKEDITOR.tools.rtrim(lastChild.value)))
element.children.length=length-1;else
lastChild.value=text;}}}
function addElement(element,target,moveCurrent){target=target||currentNode||root;var savedCurrent=currentNode;if(element.previous===undefined){if(checkAutoParagraphing(target,element)){currentNode=target;parser.onTagOpen(fixingBlock,{});element.returnPoint=target=currentNode;}
removeTailWhitespace(element);if(!(isRemoveEmpty(element)&&!element.children.length))
target.add(element);if(element.name=='pre')
inPre=false;if(element.name=='textarea')
inTextarea=false;}
if(element.returnPoint){currentNode=element.returnPoint;delete element.returnPoint;}else
currentNode=moveCurrent?target:savedCurrent;}
function checkAutoParagraphing(parent,node){if((parent==root||parent.name=='body')&&fixingBlock&&(!parent.name||CKEDITOR.dtd[parent.name][fixingBlock]))
{var name,realName;if(node.attributes&&(realName=node.attributes['data-cke-real-element-type']))
name=realName;else
name=node.name;return name&&name in CKEDITOR.dtd.$inline&&!(name in CKEDITOR.dtd.head)&&!node.isOrphan||node.type==CKEDITOR.NODE_TEXT;}}
function possiblySibling(tag1,tag2){if(tag1 in CKEDITOR.dtd.$listItem||tag1 in CKEDITOR.dtd.$tableContent)
return tag1==tag2||tag1=='dt'&&tag2=='dd'||tag1=='dd'&&tag2=='dt';return false;}
parser.onTagOpen=function(tagName,attributes,selfClosing,optionalClose){var element=new CKEDITOR.htmlParser.element(tagName,attributes);if(element.isUnknown&&selfClosing)
element.isEmpty=true;element.isOptionalClose=optionalClose;if(isRemoveEmpty(element)){pendingInline.push(element);return;}else if(tagName=='pre')
inPre=true;else if(tagName=='br'&&inPre){currentNode.add(new CKEDITOR.htmlParser.text('\n'));return;}else if(tagName=='textarea')
inTextarea=true;if(tagName=='br'){pendingBRs.push(element);return;}
while(1){var currentName=currentNode.name;var currentDtd=currentName?(CKEDITOR.dtd[currentName]||(currentNode._.isBlockLike?CKEDITOR.dtd.div:CKEDITOR.dtd.span)):rootDtd;if(!element.isUnknown&&!currentNode.isUnknown&&!currentDtd[tagName]){if(currentNode.isOptionalClose)
parser.onTagClose(currentName);else if(tagName in listBlocks&&currentName in listBlocks){var children=currentNode.children,lastChild=children[children.length-1];if(!(lastChild&&lastChild.name=='li'))
addElement((lastChild=new CKEDITOR.htmlParser.element('li')),currentNode);!element.returnPoint&&(element.returnPoint=currentNode);currentNode=lastChild;}
else if(tagName in CKEDITOR.dtd.$listItem&&!possiblySibling(tagName,currentName)){parser.onTagOpen(tagName=='li'?'ul':'dl',{},0,1);}
else if(currentName in nonBreakingBlocks&&!possiblySibling(tagName,currentName)){!element.returnPoint&&(element.returnPoint=currentNode);currentNode=currentNode.parent;}else{if(currentName in CKEDITOR.dtd.$inline)
pendingInline.unshift(currentNode);if(currentNode.parent)
addElement(currentNode,currentNode.parent,1);else{element.isOrphan=1;break;}}}else
break;}
checkPending(tagName);sendPendingBRs();element.parent=currentNode;if(element.isEmpty)
addElement(element);else
currentNode=element;};parser.onTagClose=function(tagName){for(var i=pendingInline.length-1;i>=0;i--){if(tagName==pendingInline[i].name){pendingInline.splice(i,1);return;}}
var pendingAdd=[],newPendingInline=[],candidate=currentNode;while(candidate!=root&&candidate.name!=tagName){if(!candidate._.isBlockLike)
newPendingInline.unshift(candidate);pendingAdd.push(candidate);candidate=candidate.returnPoint||candidate.parent;}
if(candidate!=root){for(i=0;i<pendingAdd.length;i++){var node=pendingAdd[i];addElement(node,node.parent);}
currentNode=candidate;if(candidate._.isBlockLike)
sendPendingBRs();addElement(candidate,candidate.parent);if(candidate==currentNode)
currentNode=currentNode.parent;pendingInline=pendingInline.concat(newPendingInline);}
if(tagName=='body')
fixingBlock=false;};parser.onText=function(text){if((!currentNode._.hasInlineStarted||pendingBRs.length)&&!inPre&&!inTextarea){text=CKEDITOR.tools.ltrim(text);if(text.length===0)
return;}
var currentName=currentNode.name,currentDtd=currentName?(CKEDITOR.dtd[currentName]||(currentNode._.isBlockLike?CKEDITOR.dtd.div:CKEDITOR.dtd.span)):rootDtd;if(!inTextarea&&!currentDtd['#']&&currentName in nonBreakingBlocks){parser.onTagOpen(currentName in listBlocks?'li':currentName=='dl'?'dd':currentName=='table'?'tr':currentName=='tr'?'td':'');parser.onText(text);return;}
sendPendingBRs();checkPending();if(!inPre&&!inTextarea)
text=text.replace(/[\t\r\n ]{2,}|[\t\r\n]/g,' ');text=new CKEDITOR.htmlParser.text(text);if(checkAutoParagraphing(currentNode,text))
this.onTagOpen(fixingBlock,{},0,1);currentNode.add(text);};parser.onCDATA=function(cdata){currentNode.add(new CKEDITOR.htmlParser.cdata(cdata));};parser.onComment=function(comment){sendPendingBRs();checkPending();currentNode.add(new CKEDITOR.htmlParser.comment(comment));};parser.parse(fragmentHtml);sendPendingBRs();while(currentNode!=root)
addElement(currentNode,currentNode.parent,1);removeTailWhitespace(root);return root;};CKEDITOR.htmlParser.fragment.prototype={type:CKEDITOR.NODE_DOCUMENT_FRAGMENT,add:function(node,index){isNaN(index)&&(index=this.children.length);var previous=index>0?this.children[index-1]:null;if(previous){if(node._.isBlockLike&&previous.type==CKEDITOR.NODE_TEXT){previous.value=CKEDITOR.tools.rtrim(previous.value);if(previous.value.length===0){this.children.pop();this.add(node);return;}}
previous.next=node;}
node.previous=previous;node.parent=this;this.children.splice(index,0,node);if(!this._.hasInlineStarted)
this._.hasInlineStarted=node.type==CKEDITOR.NODE_TEXT||(node.type==CKEDITOR.NODE_ELEMENT&&!node._.isBlockLike);},filter:function(filter,context){context=this.getFilterContext(context);filter.onRoot(context,this);this.filterChildren(filter,false,context);},filterChildren:function(filter,filterRoot,context){if(this.childrenFilteredBy==filter.id)
return;context=this.getFilterContext(context);if(filterRoot&&!this.parent)
filter.onRoot(context,this);this.childrenFilteredBy=filter.id;for(var i=0;i<this.children.length;i++){if(this.children[i].filter(filter,context)===false)
i--;}},writeHtml:function(writer,filter){if(filter)
this.filter(filter);this.writeChildrenHtml(writer);},writeChildrenHtml:function(writer,filter,filterRoot){var context=this.getFilterContext();if(filterRoot&&!this.parent&&filter)
filter.onRoot(context,this);if(filter)
this.filterChildren(filter,false,context);for(var i=0,children=this.children,l=children.length;i<l;i++)
children[i].writeHtml(writer);},forEach:function(callback,type,skipRoot){if(!skipRoot&&(!type||this.type==type))
var ret=callback(this);if(ret===false)
return;var children=this.children,node,i=0;for(;i<children.length;i++){node=children[i];if(node.type==CKEDITOR.NODE_ELEMENT)
node.forEach(callback,type);else if(!type||node.type==type)
callback(node);}},getFilterContext:function(context){return context||{};}};})();