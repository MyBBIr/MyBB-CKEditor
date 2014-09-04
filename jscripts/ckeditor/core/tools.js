
(function(){var functions=[],cssVendorPrefix=CKEDITOR.env.gecko?'-moz-':CKEDITOR.env.webkit?'-webkit-':CKEDITOR.env.opera?'-o-':CKEDITOR.env.ie?'-ms-':'';CKEDITOR.on('reset',function(){functions=[];});CKEDITOR.tools={arrayCompare:function(arrayA,arrayB){if(!arrayA&&!arrayB)
return true;if(!arrayA||!arrayB||arrayA.length!=arrayB.length)
return false;for(var i=0;i<arrayA.length;i++){if(arrayA[i]!=arrayB[i])
return false;}
return true;},clone:function(obj){var clone;if(obj&&(obj instanceof Array)){clone=[];for(var i=0;i<obj.length;i++)
clone[i]=CKEDITOR.tools.clone(obj[i]);return clone;}
if(obj===null||(typeof(obj)!='object')||(obj instanceof String)||(obj instanceof Number)||(obj instanceof Boolean)||(obj instanceof Date)||(obj instanceof RegExp))
return obj;clone=new obj.constructor();for(var propertyName in obj){var property=obj[propertyName];clone[propertyName]=CKEDITOR.tools.clone(property);}
return clone;},capitalize:function(str,keepCase){return str.charAt(0).toUpperCase()+(keepCase?str.slice(1):str.slice(1).toLowerCase());},extend:function(target){var argsLength=arguments.length,overwrite,propertiesList;if(typeof(overwrite=arguments[argsLength-1])=='boolean')
argsLength--;else if(typeof(overwrite=arguments[argsLength-2])=='boolean'){propertiesList=arguments[argsLength-1];argsLength-=2;}
for(var i=1;i<argsLength;i++){var source=arguments[i];for(var propertyName in source){if(overwrite===true||target[propertyName]==undefined){if(!propertiesList||(propertyName in propertiesList))
target[propertyName]=source[propertyName];}}}
return target;},prototypedCopy:function(source){var copy=function(){};copy.prototype=source;return new copy();},copy:function(source){var obj={},name;for(name in source)
obj[name]=source[name];return obj;},isArray:function(object){return Object.prototype.toString.call(object)=='[object Array]';},isEmpty:function(object){for(var i in object){if(object.hasOwnProperty(i))
return false;}
return true;},cssVendorPrefix:function(property,value,asString){if(asString)
return cssVendorPrefix+property+':'+value+';'+property+':'+value;var ret={};ret[property]=value;ret[cssVendorPrefix+property]=value;return ret;},cssStyleToDomStyle:(function(){var test=document.createElement('div').style;var cssFloat=(typeof test.cssFloat!='undefined')?'cssFloat':(typeof test.styleFloat!='undefined')?'styleFloat':'float';return function(cssName){if(cssName=='float')
return cssFloat;else{return cssName.replace(/-./g,function(match){return match.substr(1).toUpperCase();});}};})(),buildStyleHtml:function(css){css=[].concat(css);var item,retval=[];for(var i=0;i<css.length;i++){if((item=css[i])){if(/@import|[{}]/.test(item))
retval.push('<style>'+item+'</style>');else
retval.push('<link type="text/css" rel=stylesheet href="'+item+'">');}}
return retval.join('');},htmlEncode:function(text){return String(text).replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;');},htmlEncodeAttr:function(text){return text.replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');},htmlDecodeAttr:function(text){return text.replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');},getNextNumber:(function(){var last=0;return function(){return++last;};})(),getNextId:function(){return'cke_'+this.getNextNumber();},override:function(originalFunction,functionBuilder){var newFn=functionBuilder(originalFunction);newFn.prototype=originalFunction.prototype;return newFn;},setTimeout:function(func,milliseconds,scope,args,ownerWindow){if(!ownerWindow)
ownerWindow=window;if(!scope)
scope=ownerWindow;return ownerWindow.setTimeout(function(){if(args)
func.apply(scope,[].concat(args));else
func.apply(scope);},milliseconds||0);},trim:(function(){var trimRegex=/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;return function(str){return str.replace(trimRegex,'');};})(),ltrim:(function(){var trimRegex=/^[ \t\n\r]+/g;return function(str){return str.replace(trimRegex,'');};})(),rtrim:(function(){var trimRegex=/[ \t\n\r]+$/g;return function(str){return str.replace(trimRegex,'');};})(),indexOf:function(array,value){if(typeof value=='function'){for(var i=0,len=array.length;i<len;i++){if(value(array[i]))
return i;}}else if(array.indexOf)
return array.indexOf(value);else{for(i=0,len=array.length;i<len;i++){if(array[i]===value)
return i;}}
return-1;},search:function(array,value){var index=CKEDITOR.tools.indexOf(array,value);return index>=0?array[index]:null;},bind:function(func,obj){return function(){return func.apply(obj,arguments);};},createClass:function(definition){var $=definition.$,baseClass=definition.base,privates=definition.privates||definition._,proto=definition.proto,statics=definition.statics;!$&&($=function(){baseClass&&this.base.apply(this,arguments);});if(privates){var originalConstructor=$;$=function(){var _=this._||(this._={});for(var privateName in privates){var priv=privates[privateName];_[privateName]=(typeof priv=='function')?CKEDITOR.tools.bind(priv,this):priv;}
originalConstructor.apply(this,arguments);};}
if(baseClass){$.prototype=this.prototypedCopy(baseClass.prototype);$.prototype.constructor=$;$.base=baseClass;$.baseProto=baseClass.prototype;$.prototype.base=function(){this.base=baseClass.prototype.base;baseClass.apply(this,arguments);this.base=arguments.callee;};}
if(proto)
this.extend($.prototype,proto,true);if(statics)
this.extend($,statics,true);return $;},addFunction:function(fn,scope){return functions.push(function(){return fn.apply(scope||this,arguments);})-1;},removeFunction:function(ref){functions[ref]=null;},callFunction:function(ref){var fn=functions[ref];return fn&&fn.apply(window,Array.prototype.slice.call(arguments,1));},cssLength:(function(){var pixelRegex=/^-?\d+\.?\d*px$/,lengthTrimmed;return function(length){lengthTrimmed=CKEDITOR.tools.trim(length+'')+'px';if(pixelRegex.test(lengthTrimmed))
return lengthTrimmed;else
return length||'';};})(),convertToPx:(function(){var calculator;return function(cssLength){if(!calculator){calculator=CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;'+'top:-9999px;margin:0px;padding:0px;border:0px;"'+'></div>',CKEDITOR.document);CKEDITOR.document.getBody().append(calculator);}
if(!(/%$/).test(cssLength)){calculator.setStyle('width',cssLength);return calculator.$.clientWidth;}
return cssLength;};})(),repeat:function(str,times){return new Array(times+1).join(str);},tryThese:function(){var returnValue;for(var i=0,length=arguments.length;i<length;i++){var lambda=arguments[i];try{returnValue=lambda();break;}catch(e){}}
return returnValue;},genKey:function(){return Array.prototype.slice.call(arguments).join('-');},defer:function(fn){return function(){var args=arguments,self=this;window.setTimeout(function(){fn.apply(self,args);},0);};},normalizeCssText:function(styleText,nativeNormalize){var props=[],name,parsedProps=CKEDITOR.tools.parseCssText(styleText,true,nativeNormalize);for(name in parsedProps)
props.push(name+':'+parsedProps[name]);props.sort();return props.length?(props.join(';')+';'):'';},convertRgbToHex:function(styleText){return styleText.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi,function(match,red,green,blue){var color=[red,green,blue];for(var i=0;i<3;i++)
color[i]=('0'+parseInt(color[i],10).toString(16)).slice(-2);return'#'+color.join('');});},parseCssText:function(styleText,normalize,nativeNormalize){var retval={};if(nativeNormalize){var temp=new CKEDITOR.dom.element('span');temp.setAttribute('style',styleText);styleText=CKEDITOR.tools.convertRgbToHex(temp.getAttribute('style')||'');}
if(!styleText||styleText==';')
return retval;styleText.replace(/&quot;/g,'"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g,function(match,name,value){if(normalize){name=name.toLowerCase();if(name=='font-family')
value=value.toLowerCase().replace(/["']/g,'').replace(/\s*,\s*/g,',');value=CKEDITOR.tools.trim(value);}
retval[name]=value;});return retval;},writeCssText:function(styles,sort){var name,stylesArr=[];for(name in styles)
stylesArr.push(name+':'+styles[name]);if(sort)
stylesArr.sort();return stylesArr.join('; ');},objectCompare:function(left,right,onlyLeft){var name;if(!left&&!right)
return true;if(!left||!right)
return false;for(name in left){if(left[name]!=right[name])
return false;}
if(!onlyLeft){for(name in right){if(left[name]!=right[name])
return false;}}
return true;},objectKeys:function(obj){var keys=[];for(var i in obj)
keys.push(i);return keys;},convertArrayToObject:function(arr,fillWith){var obj={};if(arguments.length==1)
fillWith=true;for(var i=0,l=arr.length;i<l;++i)
obj[arr[i]]=fillWith;return obj;},fixDomain:function(){var domain;while(1){try{domain=window.parent.document.domain;break;}catch(e){domain=domain?domain.replace(/.+?(?:\.|$)/,''):document.domain;if(!domain)
break;document.domain=domain;}}
return!!domain;},eventsBuffer:function(minInterval,output){var scheduled,lastOutput=0;function triggerOutput(){lastOutput=(new Date()).getTime();scheduled=false;output();}
return{input:function(){if(scheduled)
return;var diff=(new Date()).getTime()-lastOutput;if(diff<minInterval)
scheduled=setTimeout(triggerOutput,minInterval-diff);else
triggerOutput();},reset:function(){if(scheduled)
clearTimeout(scheduled);scheduled=lastOutput=0;}};},enableHtml5Elements:function(doc,withAppend){var els='abbr,article,aside,audio,bdi,canvas,data,datalist,details,figcaption,figure,footer,header,hgroup,mark,meter,nav,output,progress,section,summary,time,video'.split(','),i=els.length,el;while(i--){el=doc.createElement(els[i]);if(withAppend)
doc.appendChild(el);}}};})();