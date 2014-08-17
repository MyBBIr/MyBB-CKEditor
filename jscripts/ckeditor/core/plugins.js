
CKEDITOR.plugins=new CKEDITOR.resourceManager('plugins/','plugin');CKEDITOR.plugins.load=CKEDITOR.tools.override(CKEDITOR.plugins.load,function(originalLoad){var initialized={};return function(name,callback,scope){var allPlugins={};var loadPlugins=function(names){originalLoad.call(this,names,function(plugins){CKEDITOR.tools.extend(allPlugins,plugins);var requiredPlugins=[];for(var pluginName in plugins){var plugin=plugins[pluginName],requires=plugin&&plugin.requires;if(!initialized[pluginName]){if(plugin.icons){var icons=plugin.icons.split(',');for(var ic=icons.length;ic--;){CKEDITOR.skin.addIcon(icons[ic],plugin.path+'icons/'+
(CKEDITOR.env.hidpi&&plugin.hidpi?'hidpi/':'')+
icons[ic]+'.png');}}
initialized[pluginName]=1;}
if(requires){if(requires.split)
requires=requires.split(',');for(var i=0;i<requires.length;i++){if(!allPlugins[requires[i]])
requiredPlugins.push(requires[i]);}}}
if(requiredPlugins.length)
loadPlugins.call(this,requiredPlugins);else{for(pluginName in allPlugins){plugin=allPlugins[pluginName];if(plugin.onLoad&&!plugin.onLoad._called){if(plugin.onLoad()===false)
delete allPlugins[pluginName];plugin.onLoad._called=1;}}
if(callback)
callback.call(scope||window,allPlugins);}},this);};loadPlugins.call(this,name);};});CKEDITOR.plugins.setLang=function(pluginName,languageCode,languageEntries){var plugin=this.get(pluginName),pluginLangEntries=plugin.langEntries||(plugin.langEntries={}),pluginLang=plugin.lang||(plugin.lang=[]);if(pluginLang.split)
pluginLang=pluginLang.split(',');if(CKEDITOR.tools.indexOf(pluginLang,languageCode)==-1)
pluginLang.push(languageCode);pluginLangEntries[languageCode]=languageEntries;};