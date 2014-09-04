
CKEDITOR.dom.comment=function(comment,ownerDocument){if(typeof comment=='string')
comment=(ownerDocument?ownerDocument.$:document).createComment(comment);CKEDITOR.dom.domObject.call(this,comment);};CKEDITOR.dom.comment.prototype=new CKEDITOR.dom.node();CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype,{type:CKEDITOR.NODE_COMMENT,getOuterHtml:function(){return'<!--'+this.$.nodeValue+'-->';}});