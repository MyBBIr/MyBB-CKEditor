
if(!CKEDITOR.editor){CKEDITOR.editor=function(){CKEDITOR._.pending.push([this,arguments]);CKEDITOR.event.call(this);};CKEDITOR.editor.prototype.fire=function(eventName,data){if(eventName in{instanceReady:1,loaded:1})
this[eventName]=true;return CKEDITOR.event.prototype.fire.call(this,eventName,data,this);};CKEDITOR.editor.prototype.fireOnce=function(eventName,data){if(eventName in{instanceReady:1,loaded:1})
this[eventName]=true;return CKEDITOR.event.prototype.fireOnce.call(this,eventName,data,this);};CKEDITOR.event.implementOn(CKEDITOR.editor.prototype);}