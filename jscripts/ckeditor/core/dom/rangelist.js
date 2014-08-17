
(function(){CKEDITOR.dom.rangeList=function(ranges){if(ranges instanceof CKEDITOR.dom.rangeList)
return ranges;if(!ranges)
ranges=[];else if(ranges instanceof CKEDITOR.dom.range)
ranges=[ranges];return CKEDITOR.tools.extend(ranges,mixins);};var mixins={createIterator:function(){var rangeList=this,bookmark=CKEDITOR.dom.walker.bookmark(),guard=function(node){return!(node.is&&node.is('tr'));},bookmarks=[],current;return{getNextRange:function(mergeConsequent){current=current==undefined?0:current+1;var range=rangeList[current];if(range&&rangeList.length>1){if(!current){for(var i=rangeList.length-1;i>=0;i--)
bookmarks.unshift(rangeList[i].createBookmark(true));}
if(mergeConsequent){var mergeCount=0;while(rangeList[current+mergeCount+1]){var doc=range.document,found=0,left=doc.getById(bookmarks[mergeCount].endNode),right=doc.getById(bookmarks[mergeCount+1].startNode),next;while(1){next=left.getNextSourceNode(false);if(!right.equals(next)){if(bookmark(next)||(next.type==CKEDITOR.NODE_ELEMENT&&next.isBlockBoundary())){left=next;continue;}}else
found=1;break;}
if(!found)
break;mergeCount++;}}
range.moveToBookmark(bookmarks.shift());while(mergeCount--){next=rangeList[++current];next.moveToBookmark(bookmarks.shift());range.setEnd(next.endContainer,next.endOffset);}}
return range;}};},createBookmarks:function(serializable){var retval=[],bookmark;for(var i=0;i<this.length;i++){retval.push(bookmark=this[i].createBookmark(serializable,true));for(var j=i+1;j<this.length;j++){this[j]=updateDirtyRange(bookmark,this[j]);this[j]=updateDirtyRange(bookmark,this[j],true);}}
return retval;},createBookmarks2:function(normalized){var bookmarks=[];for(var i=0;i<this.length;i++)
bookmarks.push(this[i].createBookmark2(normalized));return bookmarks;},moveToBookmarks:function(bookmarks){for(var i=0;i<this.length;i++)
this[i].moveToBookmark(bookmarks[i]);}};function updateDirtyRange(bookmark,dirtyRange,checkEnd){var serializable=bookmark.serializable,container=dirtyRange[checkEnd?'endContainer':'startContainer'],offset=checkEnd?'endOffset':'startOffset';var bookmarkStart=serializable?dirtyRange.document.getById(bookmark.startNode):bookmark.startNode;var bookmarkEnd=serializable?dirtyRange.document.getById(bookmark.endNode):bookmark.endNode;if(container.equals(bookmarkStart.getPrevious())){dirtyRange.startOffset=dirtyRange.startOffset-container.getLength()-bookmarkEnd.getPrevious().getLength();container=bookmarkEnd.getNext();}else if(container.equals(bookmarkEnd.getPrevious())){dirtyRange.startOffset=dirtyRange.startOffset-container.getLength();container=bookmarkEnd.getNext();}
container.equals(bookmarkStart.getParent())&&dirtyRange[offset]++;container.equals(bookmarkEnd.getParent())&&dirtyRange[offset]++;dirtyRange[checkEnd?'endContainer':'startContainer']=container;return dirtyRange;}})();