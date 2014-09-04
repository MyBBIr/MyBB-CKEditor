
if(!CKEDITOR.event){CKEDITOR.event=function(){};CKEDITOR.event.implementOn=function(targetObject){var eventProto=CKEDITOR.event.prototype;for(var prop in eventProto){if(targetObject[prop]==undefined)
targetObject[prop]=eventProto[prop];}};CKEDITOR.event.prototype=(function(){var getPrivate=function(obj){var _=(obj.getPrivate&&obj.getPrivate())||obj._||(obj._={});return _.events||(_.events={});};var eventEntry=function(eventName){this.name=eventName;this.listeners=[];};eventEntry.prototype={getListenerIndex:function(listenerFunction){for(var i=0,listeners=this.listeners;i<listeners.length;i++){if(listeners[i].fn==listenerFunction)
return i;}
return-1;}};function getEntry(name){var events=getPrivate(this);return events[name]||(events[name]=new eventEntry(name));}
return{define:function(name,meta){var entry=getEntry.call(this,name);CKEDITOR.tools.extend(entry,meta,true);},on:function(eventName,listenerFunction,scopeObj,listenerData,priority){function listenerFirer(editor,publisherData,stopFn,cancelFn){var ev={name:eventName,sender:this,editor:editor,data:publisherData,listenerData:listenerData,stop:stopFn,cancel:cancelFn,removeListener:removeListener};var ret=listenerFunction.call(scopeObj,ev);return ret===false?false:ev.data;}
function removeListener(){me.removeListener(eventName,listenerFunction);}
var event=getEntry.call(this,eventName);if(event.getListenerIndex(listenerFunction)<0){var listeners=event.listeners;if(!scopeObj)
scopeObj=this;if(isNaN(priority))
priority=10;var me=this;listenerFirer.fn=listenerFunction;listenerFirer.priority=priority;for(var i=listeners.length-1;i>=0;i--){if(listeners[i].priority<=priority){listeners.splice(i+1,0,listenerFirer);return{removeListener:removeListener};}}
listeners.unshift(listenerFirer);}
return{removeListener:removeListener};},once:function(){var fn=arguments[1];arguments[1]=function(evt){evt.removeListener();return fn.apply(this,arguments);};return this.on.apply(this,arguments);},capture:function(){CKEDITOR.event.useCapture=1;var retval=this.on.apply(this,arguments);CKEDITOR.event.useCapture=0;return retval;},fire:(function(){var stopped=0;var stopEvent=function(){stopped=1;};var canceled=0;var cancelEvent=function(){canceled=1;};return function(eventName,data,editor){var event=getPrivate(this)[eventName];var previousStopped=stopped,previousCancelled=canceled;stopped=canceled=0;if(event){var listeners=event.listeners;if(listeners.length){listeners=listeners.slice(0);var retData;for(var i=0;i<listeners.length;i++){if(event.errorProof){try{retData=listeners[i].call(this,editor,data,stopEvent,cancelEvent);}catch(er){}}else
retData=listeners[i].call(this,editor,data,stopEvent,cancelEvent);if(retData===false)
canceled=1;else if(typeof retData!='undefined')
data=retData;if(stopped||canceled)
break;}}}
var ret=canceled?false:(typeof data=='undefined'?true:data);stopped=previousStopped;canceled=previousCancelled;return ret;};})(),fireOnce:function(eventName,data,editor){var ret=this.fire(eventName,data,editor);delete getPrivate(this)[eventName];return ret;},removeListener:function(eventName,listenerFunction){var event=getPrivate(this)[eventName];if(event){var index=event.getListenerIndex(listenerFunction);if(index>=0)
event.listeners.splice(index,1);}},removeAllListeners:function(){var events=getPrivate(this);for(var i in events)
delete events[i];},hasListeners:function(eventName){var event=getPrivate(this)[eventName];return(event&&event.listeners.length>0);}};})();}