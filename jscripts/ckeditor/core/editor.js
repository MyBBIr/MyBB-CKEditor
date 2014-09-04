
(function(){Editor.prototype=CKEDITOR.editor.prototype;CKEDITOR.editor=Editor;function Editor(instanceConfig,element,mode){CKEDITOR.event.call(this);instanceConfig=instanceConfig&&CKEDITOR.tools.clone(instanceConfig);if(element!==undefined){if(!(element instanceof CKEDITOR.dom.element))
throw new Error('Expect element of type CKEDITOR.dom.element.');else if(!mode)
throw new Error('One of the element modes must be specified.');if(CKEDITOR.env.ie&&CKEDITOR.env.quirks&&mode==CKEDITOR.ELEMENT_MODE_INLINE)
throw new Error('Inline element mode is not supported on IE quirks.');if(!isSupportedElement(element,mode))
throw new Error('The specified element mode is not supported on element: "'+element.getName()+'".');this.element=element;this.elementMode=mode;this.name=(this.elementMode!=CKEDITOR.ELEMENT_MODE_APPENDTO)&&(element.getId()||element.getNameAtt());}
else
this.elementMode=CKEDITOR.ELEMENT_MODE_NONE;this._={};this.commands={};this.templates={};this.name=this.name||genEditorName();this.id=CKEDITOR.tools.getNextId();this.status='unloaded';this.config=CKEDITOR.tools.prototypedCopy(CKEDITOR.config);this.ui=new CKEDITOR.ui(this);this.focusManager=new CKEDITOR.focusManager(this);this.keystrokeHandler=new CKEDITOR.keystrokeHandler(this);this.on('readOnly',updateCommands);this.on('selectionChange',function(evt){updateCommandsContext(this,evt.data.path);});this.on('activeFilterChange',function(evt){updateCommandsContext(this,this.elementPath(),true);});this.on('mode',updateCommands);this.on('instanceReady',function(event){this.config.startupFocus&&this.focus();});CKEDITOR.fire('instanceCreated',null,this);CKEDITOR.add(this);CKEDITOR.tools.setTimeout(function(){initConfig(this,instanceConfig);},0,this);}
var nameCounter=0;function genEditorName(){do{var name='editor'+(++nameCounter);}
while(CKEDITOR.instances[name])
return name;}
function isSupportedElement(element,mode){if(mode==CKEDITOR.ELEMENT_MODE_INLINE)
return element.is(CKEDITOR.dtd.$editable)||element.is('textarea');else if(mode==CKEDITOR.ELEMENT_MODE_REPLACE)
return!element.is(CKEDITOR.dtd.$nonBodyContent);return 1;}
function updateCommands(){var commands=this.commands,name;for(name in commands)
updateCommand(this,commands[name]);}
function updateCommand(editor,cmd){cmd[cmd.startDisabled?'disable':editor.readOnly&&!cmd.readOnly?'disable':cmd.modes[editor.mode]?'enable':'disable']();}
function updateCommandsContext(editor,path,forceRefresh){if(!path)
return;var command,name,commands=editor.commands;for(name in commands){command=commands[name];if(forceRefresh||command.contextSensitive)
command.refresh(editor,path);}}
var loadConfigLoaded={};function loadConfig(editor){var customConfig=editor.config.customConfig;if(!customConfig)
return false;customConfig=CKEDITOR.getUrl(customConfig);var loadedConfig=loadConfigLoaded[customConfig]||(loadConfigLoaded[customConfig]={});if(loadedConfig.fn){loadedConfig.fn.call(editor,editor.config);if(CKEDITOR.getUrl(editor.config.customConfig)==customConfig||!loadConfig(editor))
editor.fireOnce('customConfigLoaded');}else{CKEDITOR.scriptLoader.queue(customConfig,function(){if(CKEDITOR.editorConfig)
loadedConfig.fn=CKEDITOR.editorConfig;else
loadedConfig.fn=function(){};loadConfig(editor);});}
return true;}
function initConfig(editor,instanceConfig){editor.on('customConfigLoaded',function(){if(instanceConfig){if(instanceConfig.on){for(var eventName in instanceConfig.on){editor.on(eventName,instanceConfig.on[eventName]);}}
CKEDITOR.tools.extend(editor.config,instanceConfig,true);delete editor.config.on;}
onConfigLoaded(editor);});if(instanceConfig&&instanceConfig.customConfig!=undefined)
editor.config.customConfig=instanceConfig.customConfig;if(!loadConfig(editor))
editor.fireOnce('customConfigLoaded');}
function onConfigLoaded(editor){var config=editor.config;editor.readOnly=!!(config.readOnly||(editor.elementMode==CKEDITOR.ELEMENT_MODE_INLINE?editor.element.is('textarea')?editor.element.hasAttribute('disabled'):editor.element.isReadOnly():editor.elementMode==CKEDITOR.ELEMENT_MODE_REPLACE?editor.element.hasAttribute('disabled'):false));editor.blockless=editor.elementMode==CKEDITOR.ELEMENT_MODE_INLINE?!(editor.element.is('textarea')||CKEDITOR.dtd[editor.element.getName()]['p']):false;editor.tabIndex=config.tabIndex||editor.element&&editor.element.getAttribute('tabindex')||0;editor.activeEnterMode=editor.enterMode=validateEnterMode(editor,config.enterMode);editor.activeShiftEnterMode=editor.shiftEnterMode=validateEnterMode(editor,config.shiftEnterMode);if(config.skin)
CKEDITOR.skinName=config.skin;editor.fireOnce('configLoaded');initComponents(editor);}
function initComponents(editor){editor.dataProcessor=new CKEDITOR.htmlDataProcessor(editor);editor.filter=editor.activeFilter=new CKEDITOR.filter(editor);loadSkin(editor);}
function loadSkin(editor){CKEDITOR.skin.loadPart('editor',function(){loadLang(editor);});}
function loadLang(editor){CKEDITOR.lang.load(editor.config.language,editor.config.defaultLanguage,function(languageCode,lang){var configTitle=editor.config.title;editor.langCode=languageCode;editor.lang=CKEDITOR.tools.prototypedCopy(lang);editor.title=typeof configTitle=='string'||configTitle===false?configTitle:[editor.lang.editor,editor.name].join(', ');if(CKEDITOR.env.gecko&&CKEDITOR.env.version<10900&&editor.lang.dir=='rtl')
editor.lang.dir='ltr';if(!editor.config.contentsLangDirection){editor.config.contentsLangDirection=editor.elementMode==CKEDITOR.ELEMENT_MODE_INLINE?editor.element.getDirection(1):editor.lang.dir;}
editor.fire('langLoaded');preloadStylesSet(editor);});}
function preloadStylesSet(editor){editor.getStylesSet(function(styles){editor.once('loaded',function(){editor.fire('stylesSet',{styles:styles});},null,null,1);loadPlugins(editor);});}
function loadPlugins(editor){var config=editor.config,plugins=config.plugins,extraPlugins=config.extraPlugins,removePlugins=config.removePlugins;if(extraPlugins){var extraRegex=new RegExp('(?:^|,)(?:'+extraPlugins.replace(/\s*,\s*/g,'|')+')(?=,|$)','g');plugins=plugins.replace(extraRegex,'');plugins+=','+extraPlugins;}
if(removePlugins){var removeRegex=new RegExp('(?:^|,)(?:'+removePlugins.replace(/\s*,\s*/g,'|')+')(?=,|$)','g');plugins=plugins.replace(removeRegex,'');}
CKEDITOR.env.air&&(plugins+=',adobeair');CKEDITOR.plugins.load(plugins.split(','),function(plugins){var pluginsArray=[];var languageCodes=[];var languageFiles=[];editor.plugins=plugins;for(var pluginName in plugins){var plugin=plugins[pluginName],pluginLangs=plugin.lang,lang=null,requires=plugin.requires,match,name;if(CKEDITOR.tools.isArray(requires))
requires=requires.join(',');if(requires&&(match=requires.match(removeRegex))){while((name=match.pop())){CKEDITOR.tools.setTimeout(function(name,pluginName){throw new Error('Plugin "'+name.replace(',','')+'" cannot be removed from the plugins list, because it\'s required by "'+pluginName+'" plugin.');},0,null,[name,pluginName]);}}
if(pluginLangs&&!editor.lang[pluginName]){if(pluginLangs.split)
pluginLangs=pluginLangs.split(',');if(CKEDITOR.tools.indexOf(pluginLangs,editor.langCode)>=0)
lang=editor.langCode;else{var langPart=editor.langCode.replace(/-.*/,'');if(langPart!=editor.langCode&&CKEDITOR.tools.indexOf(pluginLangs,langPart)>=0)
lang=langPart;else if(CKEDITOR.tools.indexOf(pluginLangs,'en')>=0)
lang='en';else
lang=pluginLangs[0];}
if(!plugin.langEntries||!plugin.langEntries[lang]){languageFiles.push(CKEDITOR.getUrl(plugin.path+'lang/'+lang+'.js'));}else{editor.lang[pluginName]=plugin.langEntries[lang];lang=null;}}
languageCodes.push(lang);pluginsArray.push(plugin);}
CKEDITOR.scriptLoader.load(languageFiles,function(){var methods=['beforeInit','init','afterInit'];for(var m=0;m<methods.length;m++){for(var i=0;i<pluginsArray.length;i++){var plugin=pluginsArray[i];if(m===0&&languageCodes[i]&&plugin.lang&&plugin.langEntries)
editor.lang[plugin.name]=plugin.langEntries[languageCodes[i]];if(plugin[methods[m]])
plugin[methods[m]](editor);}}
editor.fireOnce('pluginsLoaded');config.keystrokes&&editor.setKeystroke(editor.config.keystrokes);for(i=0;i<editor.config.blockedKeystrokes.length;i++)
editor.keystrokeHandler.blockedKeystrokes[editor.config.blockedKeystrokes[i]]=1;editor.status='loaded';editor.fireOnce('loaded');CKEDITOR.fire('instanceLoaded',null,editor);});});}
function updateEditorElement(){var element=this.element;if(element&&this.elementMode!=CKEDITOR.ELEMENT_MODE_APPENDTO){var data=this.getData();if(this.config.htmlEncodeOutput)
data=CKEDITOR.tools.htmlEncode(data);if(element.is('textarea'))
element.setValue(data);else
element.setHtml(data);return true;}
return false;}
function validateEnterMode(editor,enterMode){return editor.blockless?CKEDITOR.ENTER_BR:enterMode;}
CKEDITOR.tools.extend(CKEDITOR.editor.prototype,{addCommand:function(commandName,commandDefinition){commandDefinition.name=commandName.toLowerCase();var cmd=new CKEDITOR.command(this,commandDefinition);if(this.mode)
updateCommand(this,cmd);return this.commands[commandName]=cmd;},_attachToForm:function(){var editor=this,element=editor.element,form=new CKEDITOR.dom.element(element.$.form);if(element.is('textarea')){if(form){function onSubmit(evt){editor.updateElement();if(editor._.required&&!element.getValue()&&editor.fire('required')===false){evt.data.preventDefault();}}
form.on('submit',onSubmit);function isFunction(f){return!!(f&&f.call&&f.apply);}
if(isFunction(form.$.submit)){form.$.submit=CKEDITOR.tools.override(form.$.submit,function(originalSubmit){return function(){onSubmit();if(originalSubmit.apply)
originalSubmit.apply(this);else
originalSubmit();};});}
editor.on('destroy',function(){form.removeListener('submit',onSubmit);});}}},destroy:function(noUpdate){this.fire('beforeDestroy');!noUpdate&&updateEditorElement.call(this);this.editable(null);this.status='destroyed';this.fire('destroy');this.removeAllListeners();CKEDITOR.remove(this);CKEDITOR.fire('instanceDestroyed',null,this);},elementPath:function(startNode){startNode=startNode||this.getSelection().getStartElement();return startNode?new CKEDITOR.dom.elementPath(startNode,this.editable()):null;},createRange:function(){var editable=this.editable();return editable?new CKEDITOR.dom.range(editable):null;},execCommand:function(commandName,data){var command=this.getCommand(commandName);var eventData={name:commandName,commandData:data,command:command};if(command&&command.state!=CKEDITOR.TRISTATE_DISABLED){if(this.fire('beforeCommandExec',eventData)!==true){eventData.returnValue=command.exec(eventData.commandData);if(!command.async&&this.fire('afterCommandExec',eventData)!==true)
return eventData.returnValue;}}
return false;},getCommand:function(commandName){return this.commands[commandName];},getData:function(noEvents){!noEvents&&this.fire('beforeGetData');var eventData=this._.data;if(typeof eventData!='string'){var element=this.element;if(element&&this.elementMode==CKEDITOR.ELEMENT_MODE_REPLACE)
eventData=element.is('textarea')?element.getValue():element.getHtml();else
eventData='';}
eventData={dataValue:eventData};!noEvents&&this.fire('getData',eventData);return eventData.dataValue;},getSnapshot:function(){var data=this.fire('getSnapshot');if(typeof data!='string'){var element=this.element;if(element&&this.elementMode==CKEDITOR.ELEMENT_MODE_REPLACE)
data=element.is('textarea')?element.getValue():element.getHtml();}
return data;},loadSnapshot:function(snapshot){this.fire('loadSnapshot',snapshot);},setData:function(data,callback,internal){if(callback){this.on('dataReady',function(evt){evt.removeListener();callback.call(evt.editor);});}
var eventData={dataValue:data};!internal&&this.fire('setData',eventData);this._.data=eventData.dataValue;!internal&&this.fire('afterSetData',eventData);},setReadOnly:function(isReadOnly){isReadOnly=(isReadOnly==undefined)||isReadOnly;if(this.readOnly!=isReadOnly){this.readOnly=isReadOnly;this.keystrokeHandler.blockedKeystrokes[8]=+isReadOnly;this.editable().setReadOnly(isReadOnly);this.fire('readOnly');}},insertHtml:function(html,mode){this.fire('insertHtml',{dataValue:html,mode:mode});},insertText:function(text){this.fire('insertText',text);},insertElement:function(element){this.fire('insertElement',element);},focus:function(){this.fire('beforeFocus');},checkDirty:function(){return this.status=='ready'&&this._.previousValue!==this.getSnapshot();},resetDirty:function(){this._.previousValue=this.getSnapshot();},updateElement:function(){return updateEditorElement.call(this);},setKeystroke:function(){var keystrokes=this.keystrokeHandler.keystrokes,newKeystrokes=CKEDITOR.tools.isArray(arguments[0])?arguments[0]:[[].slice.call(arguments,0)],keystroke,behavior;for(var i=newKeystrokes.length;i--;){keystroke=newKeystrokes[i];behavior=0;if(CKEDITOR.tools.isArray(keystroke)){behavior=keystroke[1];keystroke=keystroke[0];}
if(behavior)
keystrokes[keystroke]=behavior;else
delete keystrokes[keystroke];}},addFeature:function(feature){return this.filter.addFeature(feature);},setActiveFilter:function(filter){if(!filter)
filter=this.filter;if(this.activeFilter!==filter){this.activeFilter=filter;this.fire('activeFilterChange');if(filter===this.filter)
this.setActiveEnterMode(null,null);else
this.setActiveEnterMode(filter.getAllowedEnterMode(this.enterMode),filter.getAllowedEnterMode(this.shiftEnterMode,true));}},setActiveEnterMode:function(enterMode,shiftEnterMode){enterMode=enterMode?validateEnterMode(this,enterMode):this.enterMode;shiftEnterMode=shiftEnterMode?validateEnterMode(this,shiftEnterMode):this.shiftEnterMode;if(this.activeEnterMode!=enterMode||this.activeShiftEnterMode!=shiftEnterMode){this.activeEnterMode=enterMode;this.activeShiftEnterMode=shiftEnterMode;this.fire('activeEnterModeChange');}}});})();CKEDITOR.ELEMENT_MODE_NONE=0;CKEDITOR.ELEMENT_MODE_REPLACE=1;CKEDITOR.ELEMENT_MODE_APPENDTO=2;CKEDITOR.ELEMENT_MODE_INLINE=3;