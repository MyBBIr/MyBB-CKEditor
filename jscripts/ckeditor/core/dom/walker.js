(function(){function iterate(rtl,breakOnFalse){var range=this.range;if(this._.end)
return null;if(!this._.start){this._.start=1;if(range.collapsed){this.end();return null;}
range.optimize();}
var node,startCt=range.startContainer,endCt=range.endContainer,startOffset=range.startOffset,endOffset=range.endOffset,guard,userGuard=this.guard,type=this.type,getSourceNodeFn=(rtl?'getPreviousSourceNode':'getNextSourceNode');if(!rtl&&!this._.guardLTR){var limitLTR=endCt.type==CKEDITOR.NODE_ELEMENT?endCt:endCt.getParent();var blockerLTR=endCt.type==CKEDITOR.NODE_ELEMENT?endCt.getChild(endOffset):endCt.getNext();this._.guardLTR=function(node,movingOut){return((!movingOut||!limitLTR.equals(node))&&(!blockerLTR||!node.equals(blockerLTR))&&(node.type!=CKEDITOR.NODE_ELEMENT||!movingOut||!node.equals(range.root)));};}
if(rtl&&!this._.guardRTL){var limitRTL=startCt.type==CKEDITOR.NODE_ELEMENT?startCt:startCt.getParent();var blockerRTL=startCt.type==CKEDITOR.NODE_ELEMENT?startOffset?startCt.getChild(startOffset-1):null:startCt.getPrevious();this._.guardRTL=function(node,movingOut){return((!movingOut||!limitRTL.equals(node))&&(!blockerRTL||!node.equals(blockerRTL))&&(node.type!=CKEDITOR.NODE_ELEMENT||!movingOut||!node.equals(range.root)));};}
var stopGuard=rtl?this._.guardRTL:this._.guardLTR;if(userGuard){guard=function(node,movingOut){if(stopGuard(node,movingOut)===false)
return false;return userGuard(node,movingOut);};}else
guard=stopGuard;if(this.current)
node=this.current[getSourceNodeFn](false,type,guard);else{if(rtl){node=endCt;if(node.type==CKEDITOR.NODE_ELEMENT){if(endOffset>0)
node=node.getChild(endOffset-1);else
node=(guard(node,true)===false)?null:node.getPreviousSourceNode(true,type,guard);}}else{node=startCt;if(node.type==CKEDITOR.NODE_ELEMENT){if(!(node=node.getChild(startOffset)))
node=(guard(startCt,true)===false)?null:startCt.getNextSourceNode(true,type,guard);}}
if(node&&guard(node)===false)
node=null;}
while(node&&!this._.end){this.current=node;if(!this.evaluator||this.evaluator(node)!==false){if(!breakOnFalse)
return node;}else if(breakOnFalse&&this.evaluator)
return false;node=node[getSourceNodeFn](false,type,guard);}
this.end();return this.current=null;}
function iterateToLast(rtl){var node,last=null;while((node=iterate.call(this,rtl)))
last=node;return last;}
CKEDITOR.dom.walker=CKEDITOR.tools.createClass({$:function(range){this.range=range;this._={};},proto:{end:function(){this._.end=1;},next:function(){return iterate.call(this);},previous:function(){return iterate.call(this,1);},checkForward:function(){return iterate.call(this,0,1)!==false;},checkBackward:function(){return iterate.call(this,1,1)!==false;},lastForward:function(){return iterateToLast.call(this);},lastBackward:function(){return iterateToLast.call(this,1);},reset:function(){delete this.current;this._={};}}});var blockBoundaryDisplayMatch={block:1,'list-item':1,table:1,'table-row-group':1,'table-header-group':1,'table-footer-group':1,'table-row':1,'table-column-group':1,'table-column':1,'table-cell':1,'table-caption':1},outOfFlowPositions={absolute:1,fixed:1};CKEDITOR.dom.element.prototype.isBlockBoundary=function(customNodeNames){var inPageFlow=this.getComputedStyle('float')=='none'&&!(this.getComputedStyle('position')in outOfFlowPositions);if(inPageFlow&&blockBoundaryDisplayMatch[this.getComputedStyle('display')])
return true;return!!(this.is(CKEDITOR.dtd.$block)||customNodeNames&&this.is(customNodeNames));};CKEDITOR.dom.walker.blockBoundary=function(customNodeNames){return function(node,type){return!(node.type==CKEDITOR.NODE_ELEMENT&&node.isBlockBoundary(customNodeNames));};};CKEDITOR.dom.walker.listItemBoundary=function(){return this.blockBoundary({br:1});};CKEDITOR.dom.walker.bookmark=function(contentOnly,isReject){function isBookmarkNode(node){return(node&&node.getName&&node.getName()=='span'&&node.data('cke-bookmark'));}
return function(node){var isBookmark,parent;isBookmark=(node&&node.type!=CKEDITOR.NODE_ELEMENT&&(parent=node.getParent())&&isBookmarkNode(parent));isBookmark=contentOnly?isBookmark:isBookmark||isBookmarkNode(node);return!!(isReject^isBookmark);};};CKEDITOR.dom.walker.whitespaces=function(isReject){return function(node){var isWhitespace;if(node&&node.type==CKEDITOR.NODE_TEXT){isWhitespace=!CKEDITOR.tools.trim(node.getText())||CKEDITOR.env.webkit&&node.getText()=='\u200b';}
return!!(isReject^isWhitespace);};};CKEDITOR.dom.walker.invisible=function(isReject){var whitespace=CKEDITOR.dom.walker.whitespaces();return function(node){var invisible;if(whitespace(node))
invisible=1;else{if(node.type==CKEDITOR.NODE_TEXT)
node=node.getParent();invisible=!node.$.offsetHeight;}
return!!(isReject^invisible);};};CKEDITOR.dom.walker.nodeType=function(type,isReject){return function(node){return!!(isReject^(node.type==type));};};CKEDITOR.dom.walker.bogus=function(isReject){function nonEmpty(node){return!isWhitespaces(node)&&!isBookmark(node);}
return function(node){var isBogus=CKEDITOR.env.needsBrFiller?node.is&&node.is('br'):node.getText&&tailNbspRegex.test(node.getText());if(isBogus){var parent=node.getParent(),next=node.getNext(nonEmpty);isBogus=parent.isBlockBoundary()&&(!next||next.type==CKEDITOR.NODE_ELEMENT&&next.isBlockBoundary());}
return!!(isReject^isBogus);};};CKEDITOR.dom.walker.temp=function(isReject){return function(node){if(node.type!=CKEDITOR.NODE_ELEMENT)
node=node.getParent();var isTemp=node&&node.hasAttribute('data-cke-temp');return!!(isReject^isTemp);};};var tailNbspRegex=/^[\t\r\n ]*(?:&nbsp;|\xa0)$/,isWhitespaces=CKEDITOR.dom.walker.whitespaces(),isBookmark=CKEDITOR.dom.walker.bookmark(),isTemp=CKEDITOR.dom.walker.temp(),toSkip=function(node){return isBookmark(node)||isWhitespaces(node)||node.type==CKEDITOR.NODE_ELEMENT&&node.is(CKEDITOR.dtd.$inline)&&!node.is(CKEDITOR.dtd.$empty);};CKEDITOR.dom.walker.ignored=function(isReject){return function(node){var isIgnored=isWhitespaces(node)||isBookmark(node)||isTemp(node);return!!(isReject^isIgnored);};};var isIgnored=CKEDITOR.dom.walker.ignored();function isEmpty(node){var i=0,l=node.getChildCount();for(;i<l;++i){if(!isIgnored(node.getChild(i)))
return false;}
return true;}
function filterTextContainers(dtd){var hash={},name;for(name in dtd){if(CKEDITOR.dtd[name]['#'])
hash[name]=1;}
return hash;}
var dtdTextBlock=filterTextContainers(CKEDITOR.dtd.$block);function isEditable(node){if(isIgnored(node))
return false;if(node.type==CKEDITOR.NODE_TEXT)
return true;if(node.type==CKEDITOR.NODE_ELEMENT){if(node.is(CKEDITOR.dtd.$inline)||node.getAttribute('contenteditable')=='false')
return true;if(!CKEDITOR.env.needsBrFiller&&node.is(dtdTextBlock)&&isEmpty(node))
return true;}
return false;}
CKEDITOR.dom.walker.editable=function(isReject){return function(node){return!!(isReject^isEditable(node));};};CKEDITOR.dom.element.prototype.getBogus=function(){var tail=this;do{tail=tail.getPreviousSourceNode();}
while(toSkip(tail))
if(tail&&(CKEDITOR.env.needsBrFiller?tail.is&&tail.is('br'):tail.getText&&tailNbspRegex.test(tail.getText())))
return tail;return false;};})();