
CKEDITOR.command=function(editor,commandDefinition){this.uiItems=[];this.exec=function(data){if(this.state==CKEDITOR.TRISTATE_DISABLED||!this.checkAllowed())
return false;if(this.editorFocus)
editor.focus();if(this.fire('exec')===false)
return true;return(commandDefinition.exec.call(this,editor,data)!==false);};this.refresh=function(editor,path){if(!this.readOnly&&editor.readOnly)
return true;if(this.context&&!path.isContextFor(this.context)){this.disable();return true;}
if(!this.checkAllowed(true)){this.disable();return true;}
if(!this.startDisabled)
this.enable();if(this.modes&&!this.modes[editor.mode])
this.disable();if(this.fire('refresh',{editor:editor,path:path})===false)
return true;return(commandDefinition.refresh&&commandDefinition.refresh.apply(this,arguments)!==false);};var allowed;this.checkAllowed=function(noCache){if(!noCache&&typeof allowed=='boolean')
return allowed;return allowed=editor.activeFilter.checkFeature(this);};CKEDITOR.tools.extend(this,commandDefinition,{modes:{wysiwyg:1},editorFocus:1,contextSensitive:!!commandDefinition.context,state:CKEDITOR.TRISTATE_DISABLED});CKEDITOR.event.call(this);};CKEDITOR.command.prototype={enable:function(){if(this.state==CKEDITOR.TRISTATE_DISABLED&&this.checkAllowed())
this.setState((!this.preserveState||(typeof this.previousState=='undefined'))?CKEDITOR.TRISTATE_OFF:this.previousState);},disable:function(){this.setState(CKEDITOR.TRISTATE_DISABLED);},setState:function(newState){if(this.state==newState)
return false;if(newState!=CKEDITOR.TRISTATE_DISABLED&&!this.checkAllowed())
return false;this.previousState=this.state;this.state=newState;this.fire('state');return true;},toggleState:function(){if(this.state==CKEDITOR.TRISTATE_OFF)
this.setState(CKEDITOR.TRISTATE_ON);else if(this.state==CKEDITOR.TRISTATE_ON)
this.setState(CKEDITOR.TRISTATE_OFF);}};CKEDITOR.event.implementOn(CKEDITOR.command.prototype);