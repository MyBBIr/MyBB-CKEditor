
if(!window.CKEDITOR){window.CKEDITOR=(function(){var CKEDITOR={timestamp:'',version:'%VERSION%',revision:'%REV%',rnd:Math.floor(Math.random()*(999-100+1))+100,_:{pending:[]},status:'unloaded',basePath:(function(){var path=window.CKEDITOR_BASEPATH||'';if(!path){var scripts=document.getElementsByTagName('script');for(var i=0;i<scripts.length;i++){var match=scripts[i].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);if(match){path=match[1];break;}}}
if(path.indexOf(':/')==-1&&path.slice(0,2)!='//'){if(path.indexOf('/')===0)
path=location.href.match(/^.*?:\/\/[^\/]*/)[0]+path;else
path=location.href.match(/^[^\?]*\/(?:)/)[0]+path;}
if(!path)
throw'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';return path;})(),getUrl:function(resource){if(resource.indexOf(':/')==-1&&resource.indexOf('/')!==0)
resource=this.basePath+resource;if(this.timestamp&&resource.charAt(resource.length-1)!='/'&&!(/[&?]t=/).test(resource))
resource+=(resource.indexOf('?')>=0?'&':'?')+'t='+this.timestamp;return resource;},domReady:(function(){var callbacks=[];function onReady(){try{if(document.addEventListener){document.removeEventListener('DOMContentLoaded',onReady,false);executeCallbacks();}
else if(document.attachEvent&&document.readyState==='complete'){document.detachEvent('onreadystatechange',onReady);executeCallbacks();}}catch(er){}}
function executeCallbacks(){var i;while((i=callbacks.shift()))
i();}
return function(fn){callbacks.push(fn);if(document.readyState==='complete')
setTimeout(onReady,1);if(callbacks.length!=1)
return;if(document.addEventListener){document.addEventListener('DOMContentLoaded',onReady,false);window.addEventListener('load',onReady,false);}
else if(document.attachEvent){document.attachEvent('onreadystatechange',onReady);window.attachEvent('onload',onReady);var toplevel=false;try{toplevel=!window.frameElement;}catch(e){}
if(document.documentElement.doScroll&&toplevel){function scrollCheck(){try{document.documentElement.doScroll('left');}catch(e){setTimeout(scrollCheck,1);return;}
onReady();}
scrollCheck();}}};})()};var newGetUrl=window.CKEDITOR_GETURL;if(newGetUrl){var originalGetUrl=CKEDITOR.getUrl;CKEDITOR.getUrl=function(resource){return newGetUrl.call(CKEDITOR,resource)||originalGetUrl.call(CKEDITOR,resource);};}
return CKEDITOR;})();}