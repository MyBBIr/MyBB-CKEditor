(function(){"use strict";var supportsPlaceholder=('placeholder'in document.createElement('textarea'));function dataIsEmpty(data)
{if(!data)
return true;if(data.length>20)
return false;var value=data.replace(/[\n|\t]*/g,'').toLowerCase();if(!value||value=='<br>'||value=='<p>&nbsp;<br></p>'||value=='<p><br></p>'||value=='<p>&nbsp;</p>'||value=='&nbsp;'||value==' '||value=='&nbsp;<br>'||value==' <br>')
return true;return false;}
function addPlaceholder(ev){var editor=ev.editor;var root=(editor.editable?editor.editable():(editor.mode=='wysiwyg'?editor.document&&editor.document.getBody():editor.textarea));var placeholder=ev.listenerData;if(!root)
return;if(editor.mode=='wysiwyg')
{if(CKEDITOR.dialog._.currentTop)
return;if(!root)
return;if(dataIsEmpty(root.getHtml()))
{root.setHtml(placeholder);root.addClass('placeholder');}}
if(editor.mode=='source')
{if(supportsPlaceholder)
{if(ev.name=='mode')
{root.setAttribute('placeholder',placeholder);}
return;}
if(dataIsEmpty(root.getValue()))
{root.setValue(placeholder);root.addClass('placeholder');}}}
function removePlaceholder(ev){var editor=ev.editor;var root=(editor.editable?editor.editable():(editor.mode=='wysiwyg'?editor.document&&editor.document.getBody():editor.textarea));if(!root)
return;if(editor.mode=='wysiwyg')
{if(!root.hasClass('placeholder'))
return;root.removeClass('placeholder');if(CKEDITOR.dtd[root.getName()]['p'])
{root.setHtml('<p><br/></p>');var range=new CKEDITOR.dom.range(editor.document);range.moveToElementEditablePosition(root.getFirst(),true);editor.getSelection().selectRanges([range]);}
else
{root.setHtml(' ');}}
if(editor.mode=='source')
{if(!root.hasClass('placeholder'))
return;root.removeClass('placeholder');root.setValue('');}}
function getLang(element)
{if(!element)
return null;return element.getAttribute('lang')||getLang(element.getParent());}
CKEDITOR.plugins.add('confighelper',{getPlaceholderCss:function()
{return'.placeholder{ color: #999; }';},onLoad:function()
{if(CKEDITOR.addCss)
CKEDITOR.addCss(this.getPlaceholderCss());},init:function(editor)
{editor.on('mode',function(ev){ev.editor.focusManager.hasFocus=false;});var placeholder=editor.element.getAttribute('placeholder')||editor.config.placeholder;if(placeholder)
{if(editor.addCss)
editor.addCss(this.getPlaceholderCss());var node=CKEDITOR.document.getHead().append('style');node.setAttribute('type','text/css');var content='textarea.placeholder { color: #999; font-style: italic; }';if(CKEDITOR.env.ie&&CKEDITOR.env.version<11)
node.$.styleSheet.cssText=content;else
node.$.innerHTML=content;editor.on('getData',function(ev){var element=(editor.editable?editor.editable():(editor.mode=='wysiwyg'?editor.document&&editor.document.getBody():editor.textarea));if(element&&element.hasClass('placeholder'))
ev.data.dataValue='';});editor.on('setData',function(ev){if(CKEDITOR.dialog._.currentTop)
return;if(editor.mode=='source'&&supportsPlaceholder)
return;var root=(editor.editable?editor.editable():(editor.mode=='wysiwyg'?editor.document&&editor.document.getBody():editor.textarea));if(!root)
return;if(!dataIsEmpty(ev.data.dataValue))
{if(root.hasClass('placeholder'))
root.removeClass('placeholder');}
else
{addPlaceholder(ev);}});editor.on('blur',addPlaceholder,null,placeholder);editor.on('mode',addPlaceholder,null,placeholder);editor.on('focus',removePlaceholder);editor.on('beforeModeUnload',removePlaceholder);}
var lang=editor.config.contentsLanguage||getLang(editor.element);if(lang&&!editor.config.scayt_sLang)
{var map={'en':'en_US','en-us':'en_US','en-gb':'en_GB','pt-br':'pt_BR','da':'da_DK','da-dk':'da_DK','nl-nl':'nl_NL','en-ca':'en_CA','fi-fi':'fi_FI','fr':'fr_FR','fr-fr':'fr_FR','fr-ca':'fr_CA','de':'de_DE','de-de':'de_DE','el-gr':'el_GR','it':'it_IT','it-it':'it_IT','nb-no':'nb_NO','pt':'pt_PT','pt-pt':'pt_PT','es':'es_ES','es-es':'es_ES','sv-se':'sv_SE'};editor.config.scayt_sLang=map[lang.toLowerCase()];}
var parseDefinitionToObject=function(value)
{if(typeof value=='object')
return value;var contents=value.split(';'),tabsToProcess={},i;for(i=0;i<contents.length;i++)
{var parts=contents[i].split(':');if(parts.length==3)
{var dialogName=parts[0],tabName=parts[1],fieldName=parts[2];if(!tabsToProcess[dialogName])
tabsToProcess[dialogName]={};if(!tabsToProcess[dialogName][tabName])
tabsToProcess[dialogName][tabName]=[];tabsToProcess[dialogName][tabName].push(fieldName);}}
return tabsToProcess;};CKEDITOR.on('dialogDefinition',function(ev)
{if(editor!=ev.editor)
return;var dialogName=ev.data.name,dialogDefinition=ev.data.definition,tabsToProcess,i,name,fields,tab;if(dialogName=='tableProperties')
dialogName=='table';if(!('removeDialogFields'in editor._)&&editor.config.removeDialogFields)
editor._.removeDialogFields=parseDefinitionToObject(editor.config.removeDialogFields);if(editor._.removeDialogFields&&(tabsToProcess=editor._.removeDialogFields[dialogName]))
{for(name in tabsToProcess)
{fields=tabsToProcess[name];tab=dialogDefinition.getContents(name);for(i=0;i<fields.length;i++)
tab.remove(fields[i]);}}
if(!('hideDialogFields'in editor._)&&editor.config.hideDialogFields)
editor._.hideDialogFields=parseDefinitionToObject(editor.config.hideDialogFields);if(editor._.hideDialogFields&&(tabsToProcess=editor._.hideDialogFields[dialogName]))
{for(name in tabsToProcess)
{fields=tabsToProcess[name];tab=dialogDefinition.getContents(name);for(i=0;i<fields.length;i++)
tab.get(fields[i]).hidden=true;}}
if(editor.config.dialogFieldsDefaultValues&&(tabsToProcess=editor.config.dialogFieldsDefaultValues[dialogName]))
{for(name in tabsToProcess)
{fields=tabsToProcess[name];tab=dialogDefinition.getContents(name);for(var fieldName in fields)
{var dialogField=tab.get(fieldName);if(dialogField)
dialogField['default']=fields[fieldName];}}}});}});})();