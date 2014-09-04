
CKEDITOR.dom.text=function(text,ownerDocument){if(typeof text=='string')
text=(ownerDocument?ownerDocument.$:document).createTextNode(text);this.$=text;};CKEDITOR.dom.text.prototype=new CKEDITOR.dom.node();CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype,{type:CKEDITOR.NODE_TEXT,getLength:function(){return this.$.nodeValue.length;},getText:function(){return this.$.nodeValue;},setText:function(text){this.$.nodeValue=text;},split:function(offset){var parent=this.$.parentNode,count=parent.childNodes.length,length=this.getLength();var doc=this.getDocument();var retval=new CKEDITOR.dom.text(this.$.splitText(offset),doc);if(parent.childNodes.length==count)
{if(offset>=length)
{retval=doc.createText('');retval.insertAfter(this);}
else
{var workaround=doc.createText('');workaround.insertAfter(retval);workaround.remove();}}
return retval;},substring:function(indexA,indexB){if(typeof indexB!='number')
return this.$.nodeValue.substr(indexA);else
return this.$.nodeValue.substring(indexA,indexB);}});