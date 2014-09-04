'use strict';CKEDITOR.htmlParser.comment=function(value){this.value=value;this._={isBlockLike:false};};CKEDITOR.htmlParser.comment.prototype=CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node(),{type:CKEDITOR.NODE_COMMENT,filter:function(filter,context){var comment=this.value;if(!(comment=filter.onComment(context,comment,this))){this.remove();return false;}
if(typeof comment!='string'){this.replaceWith(comment);return false;}
this.value=comment;return true;},writeHtml:function(writer,filter){if(filter)
this.filter(filter);writer.comment(this.value);}});