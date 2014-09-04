
CKEDITOR.scriptLoader=(function(){var uniqueScripts={},waitingList={};return{load:function(scriptUrl,callback,scope,showBusy){var isString=(typeof scriptUrl=='string');if(isString)
scriptUrl=[scriptUrl];if(!scope)
scope=CKEDITOR;var scriptCount=scriptUrl.length,completed=[],failed=[];var doCallback=function(success){if(callback){if(isString)
callback.call(scope,success);else
callback.call(scope,completed,failed);}};if(scriptCount===0){doCallback(true);return;}
var checkLoaded=function(url,success){(success?completed:failed).push(url);if(--scriptCount<=0){showBusy&&CKEDITOR.document.getDocumentElement().removeStyle('cursor');doCallback(success);}};var onLoad=function(url,success){uniqueScripts[url]=1;var waitingInfo=waitingList[url];delete waitingList[url];for(var i=0;i<waitingInfo.length;i++)
waitingInfo[i](url,success);};var loadScript=function(url){if(uniqueScripts[url]){checkLoaded(url,true);return;}
var waitingInfo=waitingList[url]||(waitingList[url]=[]);waitingInfo.push(checkLoaded);if(waitingInfo.length>1)
return;var script=new CKEDITOR.dom.element('script');script.setAttributes({type:'text/javascript',src:url});if(callback){if(CKEDITOR.env.ie&&CKEDITOR.env.version<11){script.$.onreadystatechange=function(){if(script.$.readyState=='loaded'||script.$.readyState=='complete'){script.$.onreadystatechange=null;onLoad(url,true);}};}else{script.$.onload=function(){setTimeout(function(){onLoad(url,true);},0);};script.$.onerror=function(){onLoad(url,false);};}}
script.appendTo(CKEDITOR.document.getHead());CKEDITOR.fire('download',url);};showBusy&&CKEDITOR.document.getDocumentElement().setStyle('cursor','wait');for(var i=0;i<scriptCount;i++){loadScript(scriptUrl[i]);}},queue:(function(){var pending=[];function loadNext(){var script;if((script=pending[0]))
this.load(script.scriptUrl,script.callback,CKEDITOR,0);}
return function(scriptUrl,callback){var that=this;function callbackWrapper(){callback&&callback.apply(this,arguments);pending.shift();loadNext.call(that);}
pending.push({scriptUrl:scriptUrl,callback:callbackWrapper});if(pending.length==1)
loadNext.call(this);};})()};})();