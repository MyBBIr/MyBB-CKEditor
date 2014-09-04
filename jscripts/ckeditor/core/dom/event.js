
CKEDITOR.dom.event=function(domEvent){this.$=domEvent;};CKEDITOR.dom.event.prototype={getKey:function(){return this.$.keyCode||this.$.which;},getKeystroke:function(){var keystroke=this.getKey();if(this.$.ctrlKey||this.$.metaKey)
keystroke+=CKEDITOR.CTRL;if(this.$.shiftKey)
keystroke+=CKEDITOR.SHIFT;if(this.$.altKey)
keystroke+=CKEDITOR.ALT;return keystroke;},preventDefault:function(stopPropagation){var $=this.$;if($.preventDefault)
$.preventDefault();else
$.returnValue=false;if(stopPropagation)
this.stopPropagation();},stopPropagation:function(){var $=this.$;if($.stopPropagation)
$.stopPropagation();else
$.cancelBubble=true;},getTarget:function(){var rawNode=this.$.target||this.$.srcElement;return rawNode?new CKEDITOR.dom.node(rawNode):null;},getPhase:function(){return this.$.eventPhase||2;},getPageOffset:function(){var doc=this.getTarget().getDocument().$;var pageX=this.$.pageX||this.$.clientX+(doc.documentElement.scrollLeft||doc.body.scrollLeft);var pageY=this.$.pageY||this.$.clientY+(doc.documentElement.scrollTop||doc.body.scrollTop);return{x:pageX,y:pageY};}};CKEDITOR.CTRL=0x110000;CKEDITOR.SHIFT=0x220000;CKEDITOR.ALT=0x440000;CKEDITOR.EVENT_PHASE_CAPTURING=1;CKEDITOR.EVENT_PHASE_AT_TARGET=2;CKEDITOR.EVENT_PHASE_BUBBLING=3;