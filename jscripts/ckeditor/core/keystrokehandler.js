
CKEDITOR.keystrokeHandler=function(editor){if(editor.keystrokeHandler)
return editor.keystrokeHandler;this.keystrokes={};this.blockedKeystrokes={};this._={editor:editor};return this;};(function(){var cancel;var onKeyDown=function(event){event=event.data;var keyCombination=event.getKeystroke();var command=this.keystrokes[keyCombination];var editor=this._.editor;cancel=(editor.fire('key',{keyCode:keyCombination})===false);if(!cancel){if(command){var data={from:'keystrokeHandler'};cancel=(editor.execCommand(command,data)!==false);}
if(!cancel)
cancel=!!this.blockedKeystrokes[keyCombination];}
if(cancel)
event.preventDefault(true);return!cancel;};var onKeyPress=function(event){if(cancel){cancel=false;event.data.preventDefault(true);}};CKEDITOR.keystrokeHandler.prototype={attach:function(domObject){domObject.on('keydown',onKeyDown,this);if(CKEDITOR.env.opera||(CKEDITOR.env.gecko&&CKEDITOR.env.mac))
domObject.on('keypress',onKeyPress,this);}};})();