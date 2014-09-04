
(function(){var defaultToPixel=CKEDITOR.tools.cssLength;var commitValue=function(data){var id=this.id;if(!data.info)
data.info={};data.info[id]=this.getValue();};function tableColumns(table){var cols=0,maxCols=0;for(var i=0,row,rows=table.$.rows.length;i<rows;i++){row=table.$.rows[i],cols=0;for(var j=0,cell,cells=row.cells.length;j<cells;j++){cell=row.cells[j];cols+=cell.colSpan;}
cols>maxCols&&(maxCols=cols);}
return maxCols;}
function validatorNum(msg){return function(){var value=this.getValue(),pass=!!(CKEDITOR.dialog.validate.integer()(value)&&value>0);if(!pass){alert(msg);this.select();}
return pass;};}
function tableDialog(editor,command){var makeElement=function(name){return new CKEDITOR.dom.element(name,editor.document);};var editable=editor.editable();var dialogadvtab=editor.plugins.dialogadvtab;return{title:editor.lang.table.title,minWidth:100,minHeight:CKEDITOR.env.ie?130:100,onLoad:function(){var dialog=this;var styles=dialog.getContentElement('advanced','advStyles');if(styles){styles.on('change',function(evt){var width=this.getStyle('width',''),txtWidth=dialog.getContentElement('info','txtWidth');txtWidth&&txtWidth.setValue(width,true);var height=this.getStyle('height',''),txtHeight=dialog.getContentElement('info','txtHeight');txtHeight&&txtHeight.setValue(height,true);});}},onShow:function(){var selection=editor.getSelection(),ranges=selection.getRanges(),table;var rowsInput=this.getContentElement('info','txtRows'),colsInput=this.getContentElement('info','txtCols'),widthInput=this.getContentElement('info','txtWidth'),heightInput=this.getContentElement('info','txtHeight');if(command=='tableProperties'){var selected=selection.getSelectedElement();if(selected&&selected.is('table'))
table=selected;else if(ranges.length>0){if(CKEDITOR.env.webkit)
ranges[0].shrink(CKEDITOR.NODE_ELEMENT);table=editor.elementPath(ranges[0].getCommonAncestor(true)).contains('table',1);}
this._.selectedElement=table;}
if(table){this.setupContent(table);rowsInput&&rowsInput.disable();colsInput&&colsInput.disable();}else{rowsInput&&rowsInput.enable();colsInput&&colsInput.enable();}
widthInput&&widthInput.onChange();heightInput&&heightInput.onChange();},onOk:function(){if(editor.mode=='source')
{var table=this._.selectedElement||makeElement('table'),me=this,data={};this.commitContent(data,table);var rowsInput=data.info.txtRows,colsInput=data.info.txtCols;var text='[table]';for(var i=0;i<rowsInput;i++)
{text+='[tr]';for(var j=0;j<colsInput;j++)
{text+='[td]\n[/td]';}
text+="[/tr]";}
text+='[/table]';CKEDITOR.performInsert(text);return;}
var selection=editor.getSelection(),bms=this._.selectedElement&&selection.createBookmarks();var table=this._.selectedElement||makeElement('table'),me=this,data={};this.commitContent(data,table);if(data.info){var info=data.info;if(!this._.selectedElement){var tbody=table.append(makeElement('tbody')),rows=parseInt(info.txtRows,10)||0,cols=parseInt(info.txtCols,10)||0;for(var i=0;i<rows;i++){var row=tbody.append(makeElement('tr'));for(var j=0;j<cols;j++){var cell=row.append(makeElement('td'));cell.appendBogus();}}}
var headers=info.selHeaders;if(!table.$.tHead&&(headers=='row'||headers=='both')){var thead=new CKEDITOR.dom.element(table.$.createTHead());tbody=table.getElementsByTag('tbody').getItem(0);var theRow=tbody.getElementsByTag('tr').getItem(0);for(i=0;i<theRow.getChildCount();i++){var th=theRow.getChild(i);if(th.type==CKEDITOR.NODE_ELEMENT&&!th.data('cke-bookmark')){th.renameNode('th');th.setAttribute('scope','col');}}
thead.append(theRow.remove());}
if(table.$.tHead!==null&&!(headers=='row'||headers=='both')){thead=new CKEDITOR.dom.element(table.$.tHead);tbody=table.getElementsByTag('tbody').getItem(0);var previousFirstRow=tbody.getFirst();while(thead.getChildCount()>0){theRow=thead.getFirst();for(i=0;i<theRow.getChildCount();i++){var newCell=theRow.getChild(i);if(newCell.type==CKEDITOR.NODE_ELEMENT){newCell.renameNode('td');newCell.removeAttribute('scope');}}
theRow.insertBefore(previousFirstRow);}
thead.remove();}
if(!this.hasColumnHeaders&&(headers=='col'||headers=='both')){for(row=0;row<table.$.rows.length;row++){newCell=new CKEDITOR.dom.element(table.$.rows[row].cells[0]);newCell.renameNode('th');newCell.setAttribute('scope','row');}}
if((this.hasColumnHeaders)&&!(headers=='col'||headers=='both')){for(i=0;i<table.$.rows.length;i++){row=new CKEDITOR.dom.element(table.$.rows[i]);if(row.getParent().getName()=='tbody'){newCell=new CKEDITOR.dom.element(row.$.cells[0]);newCell.renameNode('td');newCell.removeAttribute('scope');}}}
info.txtHeight?table.setStyle('height',info.txtHeight):table.removeStyle('height');info.txtWidth?table.setStyle('width',info.txtWidth):table.removeStyle('width');if(!table.getAttribute('style'))
table.removeAttribute('style');}
if(!this._.selectedElement){editor.insertElement(table);setTimeout(function(){var firstCell=new CKEDITOR.dom.element(table.$.rows[0].cells[0]);var range=editor.createRange();range.moveToPosition(firstCell,CKEDITOR.POSITION_AFTER_START);range.select();},0);}
else
try{selection.selectBookmarks(bms);}catch(er){}},contents:[{id:'info',label:editor.lang.table.title,elements:[{type:'hbox',widths:[null,null],styles:['vertical-align:top'],children:[{type:'vbox',padding:0,children:[{type:'text',id:'txtRows','default':3,label:editor.lang.table.rows,required:true,validate:validatorNum(editor.lang.table.invalidRows),setup:function(selectedElement){this.setValue(selectedElement.$.rows.length);},commit:commitValue},{type:'text',id:'txtCols','default':2,label:editor.lang.table.columns,required:true,validate:validatorNum(editor.lang.table.invalidCols),setup:function(selectedTable){this.setValue(tableColumns(selectedTable));},commit:commitValue}]},]},]},dialogadvtab&&dialogadvtab.createAdvancedTab(editor,null,'table')]};}
CKEDITOR.dialog.add('table',function(editor){return tableDialog(editor,'table');});CKEDITOR.dialog.add('tableProperties',function(editor){return tableDialog(editor,'tableProperties');});})();