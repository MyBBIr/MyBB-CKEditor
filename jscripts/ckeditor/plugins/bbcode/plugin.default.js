
var codeblocks={};var BBCODEparser_custom_first=function(str)
{str=str.replace(/\[list\]([^\"]*?)\[\/list\]/gi,"<ul>$1</ul>");str=str.replace(/\[list=1\]([^\"]*?)\[\/list\]/gi,"<ol>$1</ol>");str=str.replace(/\[\*\]/g,'</li><li>');str=str.replace(/<ul>\n<\li>/g,'<ul>');str=str.replace(/<ol>\n<\li>/g,'<ol>');return str;};(function(){CKEDITOR.on('dialogDefinition',function(ev){var tab,name=ev.data.name,definition=ev.data.definition;if(name=='link'){definition.removeContents('target');definition.removeContents('upload');definition.removeContents('advanced');tab=definition.getContents('info');tab.remove('emailBody');}else if(name=='image'){definition.removeContents('advanced');tab=definition.getContents('Link');tab.remove('cmbTarget');tab=definition.getContents('info');tab.remove('txtAlt');tab.remove('basic');}});var bbcodeMap={b:'strong',u:'u',i:'em',s:'strike',color:'span',size:'span',font:'span',align:'div',quote:'blockquote',code:'pre',php:'pre',url:'a',email:'span',img:'span','*':'li',list:'ol',hr:'hr'},convertMap={strong:'b',b:'b',u:'u',em:'i',i:'i',s:'s',strike:'s',pre:'code',li:'*'},tagnameMap={strong:'b',em:'i',u:'u',strike:'s',li:'*',ul:'list',ol:'list',pre:'code',a:'link',img:'img',blockquote:'quote',hr:'hr'},stylesMap={color:'color',size:'font-size',font:'font-family',align:'text-align'},attributesMap={url:'href',email:'mailhref',quote:'cite',list:'listType',code:'codeblock',php:'phpblock'};var dtd=CKEDITOR.dtd,blockLikeTags=CKEDITOR.tools.extend({table:1},dtd.$block,dtd.$listItem,dtd.$tableContent,dtd.$list);var semicolonFixRegex=/\s*(?:;\s*|$)/;function serializeStyleText(stylesObject){var styleText='';for(var style in stylesObject){var styleVal=stylesObject[style],text=(style+':'+styleVal).replace(semicolonFixRegex,';');styleText+=text;}
return styleText;}
var smileyMap=smiliesmap,smileyReverseMap={},smileyRegExp=[];for(var i in smileyMap){smileyReverseMap[smileyMap[i]]=i;smileyRegExp.push(smileyMap[i].replace(/\(|\)|\:|\/|\*|\-|\|/g,function(match){return'\\'+match;}));}
smileyRegExp=new RegExp(smileyRegExp.join('|'),'g');var decodeHtml=(function(){var regex=[],entities={nbsp:'\u00A0',shy:'\u00AD',gt:'\u003E',lt:'\u003C'};for(var entity in entities)
regex.push(entity);regex=new RegExp('&('+regex.join('|')+');','g');return function(html){return html.replace(regex,function(match,entity){return entities[entity];});};})();CKEDITOR.BBCodeParser=function(){this._={bbcPartsRegex:/(?:\[([^\/\]=]*?)(?:=([^\]]*?))?\])|(?:\[\/([a-z]{1,16})\])/ig};};CKEDITOR.BBCodeParser.prototype={parse:function(bbcode){var parts,part,lastIndex=0;while((parts=this._.bbcPartsRegex.exec(bbcode))){var tagIndex=parts.index;if(tagIndex>lastIndex){var text=bbcode.substring(lastIndex,tagIndex);this.onText(text,1);}
lastIndex=this._.bbcPartsRegex.lastIndex;part=(parts[1]||parts[3]||'').toLowerCase();if(part&&!bbcodeMap[part]){this.onText(parts[0]);continue;}
if(parts[1]){var tagName=bbcodeMap[part],attribs={},styles={},optionPart=parts[2];if(attributesMap[part]){if(part=='code'){attribs['class']='prettyprint codeblock';}else if(part=='php'){attribs['class']='prettyprint phpblock';}
attribs[attributesMap[part]]=optionPart;}
if(optionPart){if(part=='list'){if(!isNaN(optionPart))
optionPart='decimal';else if(/^[a-z]+$/.test(optionPart))
optionPart='lower-alpha';else if(/^[A-Z]+$/.test(optionPart))
optionPart='upper-alpha';}
if(stylesMap[part]){if(part=='size'){if(optionPart=='xx-small'||optionPart=='x-small'||optionPart=='small'||optionPart=='medium'||optionPart=='large'||optionPart=='x-large'||optionPart=='xx-large'){}
else{optionPart=parseInt(optionPart)+10;if(optionPart>50){optionPart=50;}
optionPart+='pt';}}
styles[stylesMap[part]]=optionPart;attribs.style=serializeStyleText(styles);}}
if(part=='email'||part=='img'){attribs['bbcode']=part;}
this.onTagOpen(tagName,attribs,CKEDITOR.dtd.$empty[tagName]);}
else if(parts[3])
this.onTagClose(bbcodeMap[part]);}
if(bbcode.length>lastIndex)
this.onText(bbcode.substring(lastIndex,bbcode.length),1);}};CKEDITOR.htmlParser.fragment.fromBBCode=function(source){var parser=new CKEDITOR.BBCodeParser(),fragment=new CKEDITOR.htmlParser.fragment(),pendingInline=[],pendingBrs=0,currentNode=fragment,returnPoint;function checkPending(newTagName){if(pendingInline.length>0){for(var i=0;i<pendingInline.length;i++){var pendingElement=pendingInline[i],pendingName=pendingElement.name,pendingDtd=CKEDITOR.dtd[pendingName],currentDtd=currentNode.name&&CKEDITOR.dtd[currentNode.name];if((!currentDtd||currentDtd[pendingName])&&(!newTagName||!pendingDtd||pendingDtd[newTagName]||!CKEDITOR.dtd[newTagName])){pendingElement=pendingElement.clone();pendingElement.parent=currentNode;currentNode=pendingElement;pendingInline.splice(i,1);i--;}}}}
function checkPendingBrs(tagName,closing){var len=currentNode.children.length,previous=len>0&&currentNode.children[len-1],lineBreakParent=!previous&&writer.getRule(tagnameMap[currentNode.name],'breakAfterOpen'),lineBreakPrevious=previous&&previous.type==CKEDITOR.NODE_ELEMENT&&writer.getRule(tagnameMap[previous.name],'breakAfterClose'),lineBreakCurrent=tagName&&writer.getRule(tagnameMap[tagName],closing?'breakBeforeClose':'breakBeforeOpen');if(pendingBrs&&(lineBreakParent||lineBreakPrevious||lineBreakCurrent))
pendingBrs--;if(pendingBrs&&tagName in blockLikeTags)
pendingBrs++;while(pendingBrs&&pendingBrs--)
currentNode.children.push(previous=new CKEDITOR.htmlParser.element('br'));}
function addElement(node,target){checkPendingBrs(node.name,1);target=target||currentNode||fragment;var len=target.children.length,previous=len>0&&target.children[len-1]||null;node.previous=previous;node.parent=target;target.children.push(node);if(node.returnPoint){currentNode=node.returnPoint;delete node.returnPoint;}}
parser.onTagOpen=function(tagName,attributes,selfClosing){var element=new CKEDITOR.htmlParser.element(tagName,attributes);if(CKEDITOR.dtd.$removeEmpty[tagName]){pendingInline.push(element);return;}
var currentName=currentNode.name;var currentDtd=currentName&&(CKEDITOR.dtd[currentName]||(currentNode._.isBlockLike?CKEDITOR.dtd.div:CKEDITOR.dtd.span));if(currentDtd&&!currentDtd[tagName]){var reApply=false,addPoint;if(tagName==currentName)
addElement(currentNode,currentNode.parent);else if(tagName in CKEDITOR.dtd.$listItem){parser.onTagOpen('ul',{});addPoint=currentNode;reApply=true;}else{addElement(currentNode,currentNode.parent);pendingInline.unshift(currentNode);reApply=true;}
if(addPoint)
currentNode=addPoint;else
currentNode=currentNode.returnPoint||currentNode.parent;if(reApply){parser.onTagOpen.apply(this,arguments);return;}}
checkPending(tagName);checkPendingBrs(tagName);element.parent=currentNode;element.returnPoint=returnPoint;returnPoint=0;if(element.isEmpty)
addElement(element);else
currentNode=element;};parser.onTagClose=function(tagName){for(var i=pendingInline.length-1;i>=0;i--){if(tagName==pendingInline[i].name){pendingInline.splice(i,1);return;}}
var pendingAdd=[],newPendingInline=[],candidate=currentNode;while(candidate.type&&candidate.name!=tagName){if(!candidate._.isBlockLike)
newPendingInline.unshift(candidate);pendingAdd.push(candidate);candidate=candidate.parent;}
if(candidate.type){for(i=0;i<pendingAdd.length;i++){var node=pendingAdd[i];addElement(node,node.parent);}
currentNode=candidate;addElement(candidate,candidate.parent);if(candidate==currentNode)
currentNode=currentNode.parent;pendingInline=pendingInline.concat(newPendingInline);}};parser.onText=function(text){var currentDtd=CKEDITOR.dtd[currentNode.name];if(!currentDtd||currentDtd['#']){checkPendingBrs();checkPending();text.replace(/(\r\n|[\r\n])|[^\r\n]*/g,function(piece,lineBreak){if(lineBreak!==undefined&&lineBreak.length)
pendingBrs++;else if(piece.length){var lastIndex=0;piece.replace(smileyRegExp,function(match,index){addElement(new CKEDITOR.htmlParser.text(piece.substring(lastIndex,index)),currentNode);addElement(new CKEDITOR.htmlParser.element('smiley',{desc:smileyReverseMap[match]}),currentNode);lastIndex=index+match.length;});if(lastIndex!=piece.length)
addElement(new CKEDITOR.htmlParser.text(piece.substring(lastIndex,piece.length)),currentNode);}});}};parser.parse(CKEDITOR.tools.htmlEncode(source));while(currentNode.type!=CKEDITOR.NODE_DOCUMENT_FRAGMENT){var parent=currentNode.parent,node=currentNode;addElement(node,parent);currentNode=parent;}
return fragment;};var BBCodeWriter=CKEDITOR.tools.createClass({$:function(){this._={output:[],rules:[]};this.setRules('list',{breakBeforeOpen:1,breakAfterOpen:1,breakBeforeClose:1,breakAfterClose:1});this.setRules('*',{breakBeforeOpen:1,breakAfterOpen:0,breakBeforeClose:1,breakAfterClose:0});this.setRules('quote',{breakBeforeOpen:1,breakAfterOpen:0,breakBeforeClose:0,breakAfterClose:1});},proto:{setRules:function(tagName,rules){var currentRules=this._.rules[tagName];if(currentRules)
CKEDITOR.tools.extend(currentRules,rules,true);else
this._.rules[tagName]=rules;},getRule:function(tagName,ruleName){return this._.rules[tagName]&&this._.rules[tagName][ruleName];},openTag:function(tag){if(tag in bbcodeMap){if(this.getRule(tag,'breakBeforeOpen'))
this.lineBreak(1);this.write('[',tag);}},openTagClose:function(tag){if(tag=='br')
this._.output.push('\n');else if(tag in bbcodeMap){this.write(']');if(this.getRule(tag,'breakAfterOpen'))
this.lineBreak(1);}},attribute:function(name,val){if(name=='option'){if(typeof val=='string')
val=val.replace(/&amp;/g,'&');this.write('=',val);}},closeTag:function(tag){if(tag in bbcodeMap){if(this.getRule(tag,'breakBeforeClose'))
this.lineBreak(1);tag!='*'&&this.write('[/',tag,']');if(this.getRule(tag,'breakAfterClose'))
this.lineBreak(1);}},text:function(text){this.write(text);},comment:function(){},lineBreak:function(){if(!this._.hasLineBreak&&this._.output.length){this.write('\n');this._.hasLineBreak=1;}},write:function(){this._.hasLineBreak=0;var data=Array.prototype.join.call(arguments,'');this._.output.push(data);},reset:function(){this._.output=[];this._.hasLineBreak=0;},getHtml:function(reset){var bbcode=this._.output.join('');if(reset)
this.reset();return decodeHtml(bbcode);}}});var writer=new BBCodeWriter();CKEDITOR.plugins.add('bbcode',{requires:'entities',beforeInit:function(editor){var config=editor.config;CKEDITOR.tools.extend(config,{enterMode:CKEDITOR.ENTER_BR,basicEntities:false,entities:false,fillEmptyBlocks:false},true);editor.filter.disable();editor.activeEnterMode=editor.enterMode=CKEDITOR.ENTER_BR;},init:function(editor){var config=editor.config;function BBCodeToHtml(code){var fragment=CKEDITOR.htmlParser.fragment.fromBBCode(code),writer=new CKEDITOR.htmlParser.basicWriter();fragment.writeHtml(writer,bbcodeFilter);return writer.getHtml(true);}
var bbcodeFilter=new CKEDITOR.htmlParser.filter();bbcodeFilter.addRules({elements:{blockquote:function(element){var quoted=new CKEDITOR.htmlParser.element('div');quoted.children=element.children;element.children=[quoted];var citeText=element.attributes.cite;if(citeText){var cite=new CKEDITOR.htmlParser.element('cite');cite.add(new CKEDITOR.htmlParser.text(citeText.replace(/^"|"$/g,'')));delete element.attributes.cite;element.children.unshift(cite);}},span:function(element){var bbcode;if((bbcode=element.attributes.bbcode)){if(bbcode=='img'){element.name='img';element.attributes.src=element.children[0].value;element.children=[];}else if(bbcode=='email'){element.name='a';element.attributes.href='mailto:'+element.children[0].value;}
delete element.attributes.bbcode;}},ol:function(element){if(element.attributes.listType){if(element.attributes.listType!='decimal')
element.attributes.style='list-style-type:'+element.attributes.listType;}else
element.name='ul';delete element.attributes.listType;},a:function(element){if(!element.attributes.href)
element.attributes.href=element.children[0].value;},smiley:function(element){element.name='img';var description=element.attributes.desc,image=config.smiley_images[CKEDITOR.tools.indexOf(config.smiley_descriptions,description)],src=CKEDITOR.tools.htmlEncode(image);element.attributes={src:src,'data-cke-saved-src':src,title:description,alt:description};}}});editor.dataProcessor.htmlFilter.addRules({elements:{$:function(element){var attributes=element.attributes,style=CKEDITOR.tools.parseCssText(attributes.style,1),value;var tagName=element.name;if(tagName in convertMap)
tagName=convertMap[tagName];else if(tagName=='span'){if((value=style.color)){tagName='color';value=CKEDITOR.tools.convertRgbToHex(value);}else if((value=style['font-size'])){if(value=='xx-small'||value=='x-small'||value=='small'||value=='medium'||value=='large'||value=='x-large'||value=='xx-large'){tagName='size';}else{percentValue=value.match(/(\d+)px$/);if(percentValue){value=parseInt(percentValue[1])-10;tagName='size';}else{percentValue=value.match(/(\d+)pt$/);if(percentValue){value=parseInt(percentValue[1])-10;tagName='size';}}}}else if((value=style['font-family'])){tagName='font'}}else if(tagName=='div'){if((value=style['text-align'])){tagName='align'}}else if(tagName=='ol'||tagName=='ul'){if((value=style['list-style-type'])){switch(value){case'lower-alpha':value='a';break;case'upper-alpha':value='A';break;}}else if(tagName=='ol')
value=1;tagName='list';}else if(tagName=='blockquote'){try{var cite=element.children[0],quoted=element.children[1],citeText=cite.name=='cite'&&cite.children[0].value;if(citeText){value=citeText;element.children=quoted.children;}}catch(er){}
tagName='quote';}else if(tagName=='a'){if((value=attributes.href)){if(value.indexOf('mailto:')!==-1){value=value.replace('mailto:','');var singleton=element.children.length==1&&element.children[0];if(singleton&&singleton.type==CKEDITOR.NODE_TEXT&&singleton.value==value)
value='';tagName='email';}else{var singleton=element.children.length==1&&element.children[0];if(singleton&&singleton.type==CKEDITOR.NODE_TEXT&&singleton.value==value)
value='';tagName='url';}}}else if(tagName=='img'){element.isEmpty=0;var src=attributes['data-cke-saved-src']||attributes.src,alt=attributes.alt;if(src&&alt&&smileyMap[alt]!=null)
return new CKEDITOR.htmlParser.text(smileyMap[alt]);else
element.children=[new CKEDITOR.htmlParser.text(src)];}
if(tagName=='code'){if(attributes['class']=='prettyprint phpblock'){tagName='php';}else{tagName='code';}}
element.name=tagName;value&&(element.attributes.option=value);return null;},br:function(element){var next=element.next;if(next&&next.name in blockLikeTags)
return false;}}},1);editor.dataProcessor.writer=writer;function onSetData(evt){var bbcode=evt.data.dataValue;bbcode=BBCODEparser_custom_first(bbcode);evt.data.dataValue=bbcodeParser.bbcodeToHtml(bbcode);evt.data.dataValue=evt.data.dataValue.replace(/\n/g,'<br>');}
if(editor.elementMode==CKEDITOR.ELEMENT_MODE_INLINE)
editor.once('contentDom',function(){editor.on('setData',onSetData);});else
editor.on('setData',onSetData);},afterInit:function(editor){var filters;if(editor._.elementsPath){if((filters=editor._.elementsPath.filters)){filters.push(function(element){var htmlName=element.getName(),name=tagnameMap[htmlName]||false;if(name=='link'&&element.getAttribute('href').indexOf('mailto:')===0)
name='email';else if(htmlName=='span'){if(element.getStyle('font-size'))
name='size';else if(element.getStyle('font-family'))
name='font';else if(element.getStyle('color'))
name='color';}else if(htmlName=='div'){if(element.getStyle('text-align'))
name='size';}else if(name=='img'){var src=element.data('cke-saved-src')||element.getAttribute('src');if(src&&typeof smiliesmap[element.getAttribute('alt')]!='undefined')
name='smiley';}else if(htmlName=='pre'){if(element.getAttribute('class').match(/phpblock/)){name='php';}else{name='code';}}
return name;});}}}});})();