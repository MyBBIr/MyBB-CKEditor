
(function(){if(CKEDITOR.env.webkit)
CKEDITOR.env.hc=false;else{var hcDetect=CKEDITOR.dom.element.createFromHtml('<div style="width:0;height:0;position:absolute;left:-10000px;'+'border:1px solid;border-color:red blue"></div>',CKEDITOR.document);hcDetect.appendTo(CKEDITOR.document.getHead());try{var top=hcDetect.getComputedStyle('border-top-color'),right=hcDetect.getComputedStyle('border-right-color');CKEDITOR.env.hc=!!(top&&top==right);}catch(e){CKEDITOR.env.hc=false;}
hcDetect.remove();}
if(CKEDITOR.env.hc)
CKEDITOR.env.cssClass+=' cke_hc';CKEDITOR.document.appendStyleText('.cke{visibility:hidden;}');CKEDITOR.status='loaded';CKEDITOR.fireOnce('loaded');var pending=CKEDITOR._.pending;if(pending){delete CKEDITOR._.pending;for(var i=0;i<pending.length;i++){CKEDITOR.editor.prototype.constructor.apply(pending[i][0],pending[i][1]);CKEDITOR.add(pending[i][0]);}}})();