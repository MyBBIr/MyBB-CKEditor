
CKEDITOR.htmlParser=function(){this._={htmlPartsRegex:new RegExp('<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)-->)|(?:([^\\s>]+)\\s*((?:(?:"[^"]*")|(?:\'[^\']*\')|[^"\'>])*)\\/?>))','g')};};(function(){var attribsRegex=/([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,emptyAttribs={checked:1,compact:1,declare:1,defer:1,disabled:1,ismap:1,multiple:1,nohref:1,noresize:1,noshade:1,nowrap:1,readonly:1,selected:1};CKEDITOR.htmlParser.prototype={onTagOpen:function(){},onTagClose:function(){},onText:function(){},onCDATA:function(){},onComment:function(){},parse:function(html){var parts,tagName,nextIndex=0,cdata;while((parts=this._.htmlPartsRegex.exec(html))){var tagIndex=parts.index;if(tagIndex>nextIndex){var text=html.substring(nextIndex,tagIndex);if(cdata)
cdata.push(text);else
this.onText(text);}
nextIndex=this._.htmlPartsRegex.lastIndex;if((tagName=parts[1])){tagName=tagName.toLowerCase();if(cdata&&CKEDITOR.dtd.$cdata[tagName]){this.onCDATA(cdata.join(''));cdata=null;}
if(!cdata){this.onTagClose(tagName);continue;}}
if(cdata){cdata.push(parts[0]);continue;}
if((tagName=parts[3])){tagName=tagName.toLowerCase();if(/="/.test(tagName))
continue;var attribs={},attribMatch,attribsPart=parts[4],selfClosing=!!(attribsPart&&attribsPart.charAt(attribsPart.length-1)=='/');if(attribsPart){while((attribMatch=attribsRegex.exec(attribsPart))){var attName=attribMatch[1].toLowerCase(),attValue=attribMatch[2]||attribMatch[3]||attribMatch[4]||'';if(!attValue&&emptyAttribs[attName])
attribs[attName]=attName;else
attribs[attName]=CKEDITOR.tools.htmlDecodeAttr(attValue);}}
this.onTagOpen(tagName,attribs,selfClosing);if(!cdata&&CKEDITOR.dtd.$cdata[tagName])
cdata=[];continue;}
if((tagName=parts[2]))
this.onComment(tagName);}
if(html.length>nextIndex)
this.onText(html.substring(nextIndex,html.length));}};})();