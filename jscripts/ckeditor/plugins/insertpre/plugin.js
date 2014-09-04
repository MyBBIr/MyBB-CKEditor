CKEDITOR.plugins.add('insertpre',{requires:'dialog',lang:'en,fa',icons:'insertpre',onLoad:function()
{myalign='left';if(CKEDITOR.config.direction=='rtl'){myalign='right';}
CKEDITOR.addCss('pre.'+CKEDITOR.config.insertpre_class+' {'+
CKEDITOR.config.insertpre_style+'}'+'pre.codeblock:before { '+"display: block; margin-bottom:1px; border-bottom: 1px solid #ccc;direction: "+CKEDITOR.config.direction+";text-align: "+myalign+" ; "+' } '+'pre.phpblock:before { '+"display: block; margin-bottom:1px; border-bottom: 1px solid #ccc;direction: "+CKEDITOR.config.direction+";text-align: "+myalign+" ; "+' } ');},init:function(editor)
{if(CKEDITOR.config.insertpre_class)
{CKEDITOR.addCss('pre.codeblock:before { '+"content: '"+editor.lang.insertpre.codeblock+"';"+' } '+'pre.phpblock:before { '+"content: '"+editor.lang.insertpre.phpblock+"';"+' } ');}
var required=CKEDITOR.config.insertpre_class?('pre( '+CKEDITOR.config.insertpre_class+' )'):'pre';command=editor.addCommand('insertpre',new CKEDITOR.dialogCommand('insertpre',{allowedContent:required,requiredContent:required}));command.modes={wysiwyg:1,source:1};command=editor.addCommand('insertprephp',new CKEDITOR.dialogCommand('insertprephp',{allowedContent:required,requiredContent:required}));command.modes={wysiwyg:1,source:1};editor.ui.addButton&&editor.ui.addButton('InsertPHP',{label:editor.lang.insertpre.titlephp,icon:this.path+'icons/insertprephp.png',command:'insertprephp',toolbar:'insert,99'});editor.ui.addButton&&editor.ui.addButton('InsertCode',{label:editor.lang.insertpre.title,icon:this.path+'icons/insertprecode.png',command:'insertpre',toolbar:'insert,99'});if(editor.contextMenu)
{editor.addMenuGroup('code');editor.addMenuItem('insertpre',{label:editor.lang.insertpre.edit,icon:this.path+'icons/insertprecode.png',command:'insertpre',group:'code'});editor.addMenuItem('insertprephp',{label:editor.lang.insertpre.edit,icon:this.path+'icons/insertprephp.png',command:'insertprephp',group:'code'});editor.contextMenu.addListener(function(element)
{if(element)
element=element.getAscendant('pre',true);if(element&&!element.isReadOnly()&&element.hasClass(editor.config.insertpre_class)&&element.hasClass('codeblock'))
return{insertpre:CKEDITOR.TRISTATE_OFF};if(element&&!element.isReadOnly()&&element.hasClass(editor.config.insertpre_class)&&element.hasClass('phpblock'))
return{insertprephp:CKEDITOR.TRISTATE_OFF};return null;});}
CKEDITOR.dialog.add('insertpre',function(editor)
{return{title:editor.lang.insertpre.title,minWidth:540,minHeight:380,contents:[{id:'general',label:editor.lang.insertpre.code,elements:[{type:'textarea',id:'contents',label:editor.lang.insertpre.code,cols:140,rows:22,validate:CKEDITOR.dialog.validate.notEmpty(editor.lang.insertpre.notEmpty),required:true,setup:function(element)
{var html=element.getHtml();if(html)
{var div=document.createElement('div');div.innerHTML=html;this.setValue(div.firstChild.nodeValue);}},commit:function(element)
{element.setHtml(CKEDITOR.tools.htmlEncode(this.getValue()));}}]}],onShow:function()
{if(editor.mode=='source'){CKEDITOR.performInsert('[code]','[/code]',false);this.hide();return;}
var sel=editor.getSelection(),element=sel.getStartElement();if(element)
element=element.getAscendant('pre',true);if(!element||element.getName()!='pre'||!element.hasClass(editor.config.insertpre_class))
{element=editor.document.createElement('pre');this.insertMode=true;}
else
this.insertMode=false;this.pre=element;this.setupContent(this.pre);},onOk:function()
{if(editor.config.insertpre_class)
this.pre.setAttribute('class',editor.config.insertpre_class+' codeblock');if(this.insertMode)
editor.insertElement(this.pre);this.commitContent(this.pre);}};});CKEDITOR.dialog.add('insertprephp',function(editor)
{return{title:editor.lang.insertpre.title,minWidth:540,minHeight:380,contents:[{id:'general',label:editor.lang.insertpre.code,elements:[{type:'textarea',id:'contents',label:editor.lang.insertpre.code,cols:140,rows:22,validate:CKEDITOR.dialog.validate.notEmpty(editor.lang.insertpre.notEmpty),required:true,setup:function(element)
{var html=element.getHtml();if(html)
{var div=document.createElement('div');div.innerHTML=html;this.setValue(div.firstChild.nodeValue);}},commit:function(element)
{element.setHtml(CKEDITOR.tools.htmlEncode(this.getValue()));}}]}],onShow:function()
{if(editor.mode=='source'){CKEDITOR.performInsert('[php]','[/php]',false);this.hide();return;}
var sel=editor.getSelection(),element=sel.getStartElement();if(element)
element=element.getAscendant('pre',true);if(!element||element.getName()!='pre'||!element.hasClass(editor.config.insertpre_class))
{element=editor.document.createElement('pre');this.insertMode=true;}
else
this.insertMode=false;this.pre=element;this.setupContent(this.pre);},onOk:function()
{if(editor.config.insertpre_class)
this.pre.setAttribute('class',editor.config.insertpre_class+' phpblock');if(this.insertMode)
editor.insertElement(this.pre);this.commitContent(this.pre);}};});}});if(typeof(CKEDITOR.config.insertpre_style)=='undefined')
CKEDITOR.config.insertpre_style='background-color:#f7f7f7;border:1px solid #DDD;padding:10px;direction:ltr;text-align:left;';if(typeof(CKEDITOR.config.insertpre_class)=='undefined')
CKEDITOR.config.insertpre_class='prettyprint';