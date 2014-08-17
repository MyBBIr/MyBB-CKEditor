
(function(){CKEDITOR.htmlDataProcessor=function(editor){var dataFilter,htmlFilter,that=this;this.editor=editor;this.dataFilter=dataFilter=new CKEDITOR.htmlParser.filter();this.htmlFilter=htmlFilter=new CKEDITOR.htmlParser.filter();this.writer=new CKEDITOR.htmlParser.basicWriter();dataFilter.addRules(defaultDataFilterRulesEditableOnly);dataFilter.addRules(defaultDataFilterRulesForAll,{applyToAll:true});dataFilter.addRules(createBogusAndFillerRules(editor,'data'),{applyToAll:true});htmlFilter.addRules(defaultHtmlFilterRulesEditableOnly);htmlFilter.addRules(defaultHtmlFilterRulesForAll,{applyToAll:true});htmlFilter.addRules(createBogusAndFillerRules(editor,'html'),{applyToAll:true});editor.on('toHtml',function(evt){var evtData=evt.data,data=evtData.dataValue;data=protectSource(data,editor);data=protectElements(data,protectTextareaRegex);data=protectAttributes(data);data=protectElements(data,protectElementsRegex);data=protectElementsNames(data);data=protectSelfClosingElements(data);data=protectPreFormatted(data);var fixBin=evtData.context||editor.editable().getName(),isPre;if(CKEDITOR.env.ie&&CKEDITOR.env.version<9&&fixBin=='pre'){fixBin='div';data='<pre>'+data+'</pre>';isPre=1;}
var el=editor.document.createElement(fixBin);el.setHtml('a'+data);data=el.getHtml().substr(1);data=data.replace(new RegExp(' data-cke-'+CKEDITOR.rnd+'-','ig'),' ');isPre&&(data=data.replace(/^<pre>|<\/pre>$/gi,''));data=unprotectElementNames(data);data=unprotectElements(data);data=unprotectRealComments(data);evtData.dataValue=CKEDITOR.htmlParser.fragment.fromHtml(data,evtData.context,evtData.fixForBody===false?false:getFixBodyTag(evtData.enterMode,editor.config.autoParagraph));},null,null,5);editor.on('toHtml',function(evt){if(evt.data.filter.applyTo(evt.data.dataValue,true,evt.data.dontFilter,evt.data.enterMode))
editor.fire('dataFiltered');},null,null,6);editor.on('toHtml',function(evt){evt.data.dataValue.filterChildren(that.dataFilter,true);},null,null,10);editor.on('toHtml',function(evt){var evtData=evt.data,data=evtData.dataValue,writer=new CKEDITOR.htmlParser.basicWriter();data.writeChildrenHtml(writer);data=writer.getHtml(true);evtData.dataValue=protectRealComments(data);},null,null,15);editor.on('toDataFormat',function(evt){var data=evt.data.dataValue;if(evt.data.enterMode!=CKEDITOR.ENTER_BR)
data=data.replace(/^<br *\/?>/i,'');evt.data.dataValue=CKEDITOR.htmlParser.fragment.fromHtml(data,evt.data.context,getFixBodyTag(evt.data.enterMode,editor.config.autoParagraph));},null,null,5);editor.on('toDataFormat',function(evt){evt.data.dataValue.filterChildren(that.htmlFilter,true);},null,null,10);editor.on('toDataFormat',function(evt){evt.data.filter.applyTo(evt.data.dataValue,false,true);},null,null,11);editor.on('toDataFormat',function(evt){var data=evt.data.dataValue,writer=that.writer;writer.reset();data.writeChildrenHtml(writer);data=writer.getHtml(true);data=unprotectRealComments(data);data=unprotectSource(data,editor);evt.data.dataValue=data;},null,null,15);};CKEDITOR.htmlDataProcessor.prototype={toHtml:function(data,options,fixForBody,dontFilter){var editor=this.editor,context,filter,enterMode;if(options&&typeof options=='object'){context=options.context;fixForBody=options.fixForBody;dontFilter=options.dontFilter;filter=options.filter;enterMode=options.enterMode;}
else
context=options;if(!context&&context!==null)
context=editor.editable().getName();return editor.fire('toHtml',{dataValue:data,context:context,fixForBody:fixForBody,dontFilter:dontFilter,filter:filter||editor.filter,enterMode:enterMode||editor.enterMode}).dataValue;},toDataFormat:function(html,options){var context,filter,enterMode;if(options){context=options.context;filter=options.filter;enterMode=options.enterMode;}
if(!context&&context!==null)
context=this.editor.editable().getName();return this.editor.fire('toDataFormat',{dataValue:html,filter:filter||this.editor.filter,context:context,enterMode:enterMode||this.editor.enterMode}).dataValue;}};function createBogusAndFillerRules(editor,type){function createFiller(isOutput){return isOutput||CKEDITOR.env.needsNbspFiller?new CKEDITOR.htmlParser.text('\xa0'):new CKEDITOR.htmlParser.element('br',{'data-cke-bogus':1});}
function blockFilter(isOutput,fillEmptyBlock){return function(block){if(block.type==CKEDITOR.NODE_DOCUMENT_FRAGMENT)
return;cleanBogus(block);if(((CKEDITOR.env.opera&&!isOutput)||(typeof fillEmptyBlock=='function'?fillEmptyBlock(block)!==false:fillEmptyBlock))&&isEmptyBlockNeedFiller(block))
{block.add(createFiller(isOutput));}};}
function brFilter(isOutput){return function(br){if(br.parent.type==CKEDITOR.NODE_DOCUMENT_FRAGMENT)
return;var attrs=br.attributes;if('data-cke-bogus'in attrs||'data-cke-eol'in attrs){delete attrs['data-cke-bogus'];return;}
var next=getNext(br),previous=getPrevious(br);if(!next&&isBlockBoundary(br.parent))
append(br.parent,createFiller(isOutput));else if(isBlockBoundary(next)&&previous&&!isBlockBoundary(previous))
createFiller(isOutput).insertBefore(next);};}
function maybeBogus(node,atBlockEnd){if(!(isOutput&&!CKEDITOR.env.needsBrFiller)&&node.type==CKEDITOR.NODE_ELEMENT&&node.name=='br'&&!node.attributes['data-cke-eol'])
return true;var match;if(node.type==CKEDITOR.NODE_TEXT&&(match=node.value.match(tailNbspRegex)))
{if(match.index){(new CKEDITOR.htmlParser.text(node.value.substring(0,match.index))).insertBefore(node);node.value=match[0];}
if(!CKEDITOR.env.needsBrFiller&&isOutput&&(!atBlockEnd||node.parent.name in textBlockTags))
return true;if(!isOutput){var previous=node.previous;if(previous&&previous.name=='br')
return true;if(!previous||isBlockBoundary(previous))
return true;}}
return false;}
function cleanBogus(block){var bogus=[];var last=getLast(block),node,previous;if(last){maybeBogus(last,1)&&bogus.push(last);while(last){if(isBlockBoundary(last)&&(node=getPrevious(last))&&maybeBogus(node))
{if((previous=getPrevious(node))&&!isBlockBoundary(previous))
bogus.push(node);else{createFiller(isOutput).insertAfter(node);node.remove();}}
last=last.previous;}}
for(var i=0;i<bogus.length;i++)
bogus[i].remove();}
function isEmptyBlockNeedFiller(block){if(!isOutput&&!CKEDITOR.env.needsBrFiller&&block.type==CKEDITOR.NODE_DOCUMENT_FRAGMENT)
return false;if(!isOutput&&!CKEDITOR.env.needsBrFiller&&(document.documentMode>7||block.name in CKEDITOR.dtd.tr||block.name in CKEDITOR.dtd.$listItem)){return false;}
var last=getLast(block);return!last||block.name=='form'&&last.name=='input';}
var rules={elements:{}};var isOutput=type=='html';var textBlockTags=CKEDITOR.tools.extend({},blockLikeTags);for(var i in textBlockTags){if(!('#'in dtd[i]))
delete textBlockTags[i];}
for(i in textBlockTags)
rules.elements[i]=blockFilter(isOutput,editor.config.fillEmptyBlocks!==false);rules.root=blockFilter(isOutput);rules.elements.br=brFilter(isOutput);return rules;}
function getFixBodyTag(enterMode,autoParagraph){return(enterMode!=CKEDITOR.ENTER_BR&&autoParagraph!==false)?enterMode==CKEDITOR.ENTER_DIV?'div':'p':false;}
var tailNbspRegex=/(?:&nbsp;|\xa0)$/;var protectedSourceMarker='{cke_protected}';function getLast(node){var last=node.children[node.children.length-1];while(last&&isEmpty(last))
last=last.previous;return last;}
function getNext(node){var next=node.next;while(next&&isEmpty(next))
next=next.next;return next;}
function getPrevious(node){var previous=node.previous;while(previous&&isEmpty(previous))
previous=previous.previous;return previous;}
function isEmpty(node){return node.type==CKEDITOR.NODE_TEXT&&!CKEDITOR.tools.trim(node.value)||node.type==CKEDITOR.NODE_ELEMENT&&node.attributes['data-cke-bookmark'];}
function isBlockBoundary(node){return node&&(node.type==CKEDITOR.NODE_ELEMENT&&node.name in blockLikeTags||node.type==CKEDITOR.NODE_DOCUMENT_FRAGMENT);}
function append(parent,node){var last=parent.children[parent.children.length-1];parent.children.push(node);node.parent=parent;if(last){last.next=node;node.previous=last;}}
function getNodeIndex(node){return node.parent?node.getIndex():-1;}
var dtd=CKEDITOR.dtd,tableOrder=['caption','colgroup','col','thead','tfoot','tbody'],blockLikeTags=CKEDITOR.tools.extend({},dtd.$blockLimit,dtd.$block);var defaultDataFilterRulesEditableOnly={elements:{input:protectReadOnly,textarea:protectReadOnly}};var defaultDataFilterRulesForAll={attributeNames:[[(/^on/),'data-cke-pa-on'],[(/^data-cke-expando$/),'']]};function protectReadOnly(element){var attrs=element.attributes;if(attrs.contenteditable!='false')
attrs['data-cke-editable']=attrs.contenteditable?'true':1;attrs.contenteditable='false';}
var defaultHtmlFilterRulesEditableOnly={elements:{embed:function(element){var parent=element.parent;if(parent&&parent.name=='object'){var parentWidth=parent.attributes.width,parentHeight=parent.attributes.height;if(parentWidth)
element.attributes.width=parentWidth;if(parentHeight)
element.attributes.height=parentHeight;}},a:function(element){if(!(element.children.length||element.attributes.name||element.attributes['data-cke-saved-name']))
return false;}}};var defaultHtmlFilterRulesForAll={elementNames:[[(/^cke:/),''],[(/^\?xml:namespace$/),'']],attributeNames:[[(/^data-cke-(saved|pa)-/),''],[(/^data-cke-.*/),''],['hidefocus','']],elements:{$:function(element){var attribs=element.attributes;if(attribs){if(attribs['data-cke-temp'])
return false;var attributeNames=['name','href','src'],savedAttributeName;for(var i=0;i<attributeNames.length;i++){savedAttributeName='data-cke-saved-'+attributeNames[i];savedAttributeName in attribs&&(delete attribs[attributeNames[i]]);}}
return element;},table:function(element){var children=element.children.slice(0);children.sort(function(node1,node2){var index1,index2;if(node1.type==CKEDITOR.NODE_ELEMENT&&node2.type==node1.type){index1=CKEDITOR.tools.indexOf(tableOrder,node1.name);index2=CKEDITOR.tools.indexOf(tableOrder,node2.name);}
if(!(index1>-1&&index2>-1&&index1!=index2)){index1=getNodeIndex(node1);index2=getNodeIndex(node2);}
return index1>index2?1:-1;});},param:function(param){param.children=[];param.isEmpty=true;return param;},span:function(element){if(element.attributes['class']=='Apple-style-span')
delete element.name;},html:function(element){delete element.attributes.contenteditable;delete element.attributes['class'];},body:function(element){delete element.attributes.spellcheck;delete element.attributes.contenteditable;},style:function(element){var child=element.children[0];if(child&&child.value)
child.value=CKEDITOR.tools.trim(child.value);if(!element.attributes.type)
element.attributes.type='text/css';},title:function(element){var titleText=element.children[0];!titleText&&append(element,titleText=new CKEDITOR.htmlParser.text());titleText.value=element.attributes['data-cke-title']||'';},input:unprotectReadyOnly,textarea:unprotectReadyOnly},attributes:{'class':function(value,element){return CKEDITOR.tools.ltrim(value.replace(/(?:^|\s+)cke_[^\s]*/g,''))||false;}}};if(CKEDITOR.env.ie){defaultHtmlFilterRulesForAll.attributes.style=function(value,element){return value.replace(/(^|;)([^\:]+)/g,function(match){return match.toLowerCase();});};}
function unprotectReadyOnly(element){var attrs=element.attributes;switch(attrs['data-cke-editable']){case'true':attrs.contenteditable='true';break;case'1':delete attrs.contenteditable;break;}}
var protectElementRegex=/<(a|area|img|input|source)\b([^>]*)>/gi,protectAttributeRegex=/\s(on\w+|href|src|name)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi;var protectElementsRegex=/(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi,protectTextareaRegex=/(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi,encodedElementsRegex=/<cke:encoded>([^<]*)<\/cke:encoded>/gi;var protectElementNamesRegex=/(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi,unprotectElementNamesRegex=/(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi;var protectSelfClosingRegex=/<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi;function protectAttributes(html){return html.replace(protectElementRegex,function(element,tag,attributes){return'<'+tag+attributes.replace(protectAttributeRegex,function(fullAttr,attrName){if(!(/^on/).test(attrName)&&attributes.indexOf('data-cke-saved-'+attrName)==-1){fullAttr=fullAttr.slice(1);return' data-cke-saved-'+fullAttr+' data-cke-'+CKEDITOR.rnd+'-'+fullAttr;}
return fullAttr;})+'>';});}
function protectElements(html,regex){return html.replace(regex,function(match,tag,content){if(match.indexOf('<textarea')===0)
match=tag+unprotectRealComments(content).replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</textarea>';return'<cke:encoded>'+encodeURIComponent(match)+'</cke:encoded>';});}
function unprotectElements(html){return html.replace(encodedElementsRegex,function(match,encoded){return decodeURIComponent(encoded);});}
function protectElementsNames(html){return html.replace(protectElementNamesRegex,'$1cke:$2');}
function unprotectElementNames(html){return html.replace(unprotectElementNamesRegex,'$1$2');}
function protectSelfClosingElements(html){return html.replace(protectSelfClosingRegex,'<cke:$1$2></cke:$1>');}
function protectPreFormatted(html){return CKEDITOR.env.opera?html:html.replace(/(<pre\b[^>]*>)(\r\n|\n)/g,'$1$2$2');}
function protectRealComments(html){return html.replace(/<!--(?!{cke_protected})[\s\S]+?-->/g,function(match){return'<!--'+protectedSourceMarker+'{C}'+
encodeURIComponent(match).replace(/--/g,'%2D%2D')+'-->';});}
function unprotectRealComments(html){return html.replace(/<!--\{cke_protected\}\{C\}([\s\S]+?)-->/g,function(match,data){return decodeURIComponent(data);});}
function unprotectSource(html,editor){var store=editor._.dataStore;return html.replace(/<!--\{cke_protected\}([\s\S]+?)-->/g,function(match,data){return decodeURIComponent(data);}).replace(/\{cke_protected_(\d+)\}/g,function(match,id){return store&&store[id]||'';});}
function protectSource(data,editor){var protectedHtml=[],protectRegexes=editor.config.protectedSource,store=editor._.dataStore||(editor._.dataStore={id:1}),tempRegex=/<\!--\{cke_temp(comment)?\}(\d*?)-->/g;var regexes=[(/<script[\s\S]*?<\/script>/gi),/<noscript[\s\S]*?<\/noscript>/gi].concat(protectRegexes);data=data.replace((/<!--[\s\S]*?-->/g),function(match){return'<!--{cke_tempcomment}'+(protectedHtml.push(match)-1)+'-->';});for(var i=0;i<regexes.length;i++){data=data.replace(regexes[i],function(match){match=match.replace(tempRegex,function($,isComment,id){return protectedHtml[id];});return(/cke_temp(comment)?/).test(match)?match:'<!--{cke_temp}'+(protectedHtml.push(match)-1)+'-->';});}
data=data.replace(tempRegex,function($,isComment,id){return'<!--'+protectedSourceMarker+
(isComment?'{C}':'')+
encodeURIComponent(protectedHtml[id]).replace(/--/g,'%2D%2D')+'-->';});return data.replace(/(['"]).*?\1/g,function(match){return match.replace(/<!--\{cke_protected\}([\s\S]+?)-->/g,function(match,data){store[store.id]=decodeURIComponent(data);return'{cke_protected_'+(store.id++)+'}';});});}})();