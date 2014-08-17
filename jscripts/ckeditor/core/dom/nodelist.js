
CKEDITOR.dom.nodeList=function(nativeList){this.$=nativeList;};CKEDITOR.dom.nodeList.prototype={count:function(){return this.$.length;},getItem:function(index){if(index<0||index>=this.$.length)
return null;var $node=this.$[index];return $node?new CKEDITOR.dom.node($node):null;}};