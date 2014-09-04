
CKEDITOR.dom.node=function(domNode){if(domNode){var type=domNode.nodeType==CKEDITOR.NODE_DOCUMENT?'document':domNode.nodeType==CKEDITOR.NODE_ELEMENT?'element':domNode.nodeType==CKEDITOR.NODE_TEXT?'text':domNode.nodeType==CKEDITOR.NODE_COMMENT?'comment':domNode.nodeType==CKEDITOR.NODE_DOCUMENT_FRAGMENT?'documentFragment':'domObject';return new CKEDITOR.dom[type](domNode);}
return this;};CKEDITOR.dom.node.prototype=new CKEDITOR.dom.domObject();CKEDITOR.NODE_ELEMENT=1;CKEDITOR.NODE_DOCUMENT=9;CKEDITOR.NODE_TEXT=3;CKEDITOR.NODE_COMMENT=8;CKEDITOR.NODE_DOCUMENT_FRAGMENT=11;CKEDITOR.POSITION_IDENTICAL=0;CKEDITOR.POSITION_DISCONNECTED=1;CKEDITOR.POSITION_FOLLOWING=2;CKEDITOR.POSITION_PRECEDING=4;CKEDITOR.POSITION_IS_CONTAINED=8;CKEDITOR.POSITION_CONTAINS=16;CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype,{appendTo:function(element,toStart){element.append(this,toStart);return element;},clone:function(includeChildren,cloneId){var $clone=this.$.cloneNode(includeChildren);var removeIds=function(node){if(node['data-cke-expando'])
node['data-cke-expando']=false;if(node.nodeType!=CKEDITOR.NODE_ELEMENT)
return;if(!cloneId)
node.removeAttribute('id',false);if(includeChildren){var childs=node.childNodes;for(var i=0;i<childs.length;i++)
removeIds(childs[i]);}};removeIds($clone);return new CKEDITOR.dom.node($clone);},hasPrevious:function(){return!!this.$.previousSibling;},hasNext:function(){return!!this.$.nextSibling;},insertAfter:function(node){node.$.parentNode.insertBefore(this.$,node.$.nextSibling);return node;},insertBefore:function(node){node.$.parentNode.insertBefore(this.$,node.$);return node;},insertBeforeMe:function(node){this.$.parentNode.insertBefore(node.$,this.$);return node;},getAddress:function(normalized){var address=[];var $documentElement=this.getDocument().$.documentElement;var node=this.$;while(node&&node!=$documentElement){var parentNode=node.parentNode;if(parentNode){address.unshift(this.getIndex.call({$:node},normalized));}
node=parentNode;}
return address;},getDocument:function(){return new CKEDITOR.dom.document(this.$.ownerDocument||this.$.parentNode.ownerDocument);},getIndex:function(normalized){var current=this.$,index=-1,isNormalizing;if(!this.$.parentNode)
return index;do{if(normalized&&current!=this.$&&current.nodeType==CKEDITOR.NODE_TEXT&&(isNormalizing||!current.nodeValue))
continue;index++;isNormalizing=current.nodeType==CKEDITOR.NODE_TEXT;}
while((current=current.previousSibling))
return index;},getNextSourceNode:function(startFromSibling,nodeType,guard){if(guard&&!guard.call){var guardNode=guard;guard=function(node){return!node.equals(guardNode);};}
var node=(!startFromSibling&&this.getFirst&&this.getFirst()),parent;if(!node){if(this.type==CKEDITOR.NODE_ELEMENT&&guard&&guard(this,true)===false)
return null;node=this.getNext();}
while(!node&&(parent=(parent||this).getParent())){if(guard&&guard(parent,true)===false)
return null;node=parent.getNext();}
if(!node)
return null;if(guard&&guard(node)===false)
return null;if(nodeType&&nodeType!=node.type)
return node.getNextSourceNode(false,nodeType,guard);return node;},getPreviousSourceNode:function(startFromSibling,nodeType,guard){if(guard&&!guard.call){var guardNode=guard;guard=function(node){return!node.equals(guardNode);};}
var node=(!startFromSibling&&this.getLast&&this.getLast()),parent;if(!node){if(this.type==CKEDITOR.NODE_ELEMENT&&guard&&guard(this,true)===false)
return null;node=this.getPrevious();}
while(!node&&(parent=(parent||this).getParent())){if(guard&&guard(parent,true)===false)
return null;node=parent.getPrevious();}
if(!node)
return null;if(guard&&guard(node)===false)
return null;if(nodeType&&node.type!=nodeType)
return node.getPreviousSourceNode(false,nodeType,guard);return node;},getPrevious:function(evaluator){var previous=this.$,retval;do{previous=previous.previousSibling;retval=previous&&previous.nodeType!=10&&new CKEDITOR.dom.node(previous);}
while(retval&&evaluator&&!evaluator(retval))
return retval;},getNext:function(evaluator){var next=this.$,retval;do{next=next.nextSibling;retval=next&&new CKEDITOR.dom.node(next);}
while(retval&&evaluator&&!evaluator(retval))
return retval;},getParent:function(allowFragmentParent){var parent=this.$.parentNode;return(parent&&(parent.nodeType==CKEDITOR.NODE_ELEMENT||allowFragmentParent&&parent.nodeType==CKEDITOR.NODE_DOCUMENT_FRAGMENT))?new CKEDITOR.dom.node(parent):null;},getParents:function(closerFirst){var node=this;var parents=[];do{parents[closerFirst?'push':'unshift'](node);}
while((node=node.getParent()))
return parents;},getCommonAncestor:function(node){if(node.equals(this))
return this;if(node.contains&&node.contains(this))
return node;var start=this.contains?this:this.getParent();do{if(start.contains(node))return start;}
while((start=start.getParent()));return null;},getPosition:function(otherNode){var $=this.$;var $other=otherNode.$;if($.compareDocumentPosition)
return $.compareDocumentPosition($other);if($==$other)
return CKEDITOR.POSITION_IDENTICAL;if(this.type==CKEDITOR.NODE_ELEMENT&&otherNode.type==CKEDITOR.NODE_ELEMENT){if($.contains){if($.contains($other))
return CKEDITOR.POSITION_CONTAINS+CKEDITOR.POSITION_PRECEDING;if($other.contains($))
return CKEDITOR.POSITION_IS_CONTAINED+CKEDITOR.POSITION_FOLLOWING;}
if('sourceIndex'in $)
return($.sourceIndex<0||$other.sourceIndex<0)?CKEDITOR.POSITION_DISCONNECTED:($.sourceIndex<$other.sourceIndex)?CKEDITOR.POSITION_PRECEDING:CKEDITOR.POSITION_FOLLOWING;}
var addressOfThis=this.getAddress(),addressOfOther=otherNode.getAddress(),minLevel=Math.min(addressOfThis.length,addressOfOther.length);for(var i=0;i<=minLevel-1;i++){if(addressOfThis[i]!=addressOfOther[i]){if(i<minLevel)
return addressOfThis[i]<addressOfOther[i]?CKEDITOR.POSITION_PRECEDING:CKEDITOR.POSITION_FOLLOWING;break;}}
return(addressOfThis.length<addressOfOther.length)?CKEDITOR.POSITION_CONTAINS+CKEDITOR.POSITION_PRECEDING:CKEDITOR.POSITION_IS_CONTAINED+CKEDITOR.POSITION_FOLLOWING;},getAscendant:function(reference,includeSelf){var $=this.$,name;if(!includeSelf)
$=$.parentNode;while($){if($.nodeName&&(name=$.nodeName.toLowerCase(),(typeof reference=='string'?name==reference:name in reference)))
return new CKEDITOR.dom.node($);try{$=$.parentNode;}catch(e){$=null;}}
return null;},hasAscendant:function(name,includeSelf){var $=this.$;if(!includeSelf)
$=$.parentNode;while($){if($.nodeName&&$.nodeName.toLowerCase()==name)
return true;$=$.parentNode;}
return false;},move:function(target,toStart){target.append(this.remove(),toStart);},remove:function(preserveChildren){var $=this.$;var parent=$.parentNode;if(parent){if(preserveChildren){for(var child;(child=$.firstChild);){parent.insertBefore($.removeChild(child),$);}}
parent.removeChild($);}
return this;},replace:function(nodeToReplace){this.insertBefore(nodeToReplace);nodeToReplace.remove();},trim:function(){this.ltrim();this.rtrim();},ltrim:function(){var child;while(this.getFirst&&(child=this.getFirst())){if(child.type==CKEDITOR.NODE_TEXT){var trimmed=CKEDITOR.tools.ltrim(child.getText()),originalLength=child.getLength();if(!trimmed){child.remove();continue;}else if(trimmed.length<originalLength){child.split(originalLength-trimmed.length);this.$.removeChild(this.$.firstChild);}}
break;}},rtrim:function(){var child;while(this.getLast&&(child=this.getLast())){if(child.type==CKEDITOR.NODE_TEXT){var trimmed=CKEDITOR.tools.rtrim(child.getText()),originalLength=child.getLength();if(!trimmed){child.remove();continue;}else if(trimmed.length<originalLength){child.split(trimmed.length);this.$.lastChild.parentNode.removeChild(this.$.lastChild);}}
break;}
if(CKEDITOR.env.needsBrFiller){child=this.$.lastChild;if(child&&child.type==1&&child.nodeName.toLowerCase()=='br'){child.parentNode.removeChild(child);}}},isReadOnly:function(){var element=this;if(this.type!=CKEDITOR.NODE_ELEMENT)
element=this.getParent();if(element&&typeof element.$.isContentEditable!='undefined')
return!(element.$.isContentEditable||element.data('cke-editable'));else{while(element){if(element.data('cke-editable'))
break;if(element.getAttribute('contentEditable')=='false')
return true;else if(element.getAttribute('contentEditable')=='true')
break;element=element.getParent();}
return!element;}}});