(function(){'use strict';var DTD=CKEDITOR.dtd,copy=CKEDITOR.tools.copy,trim=CKEDITOR.tools.trim,TEST_VALUE='cke-test',enterModeTags=['','p','br','div'];CKEDITOR.filter=function(editorOrRules){this.allowedContent=[];this.disabled=false;this.editor=null;this.id=CKEDITOR.tools.getNextNumber();this._={rules:{},transformations:{},cachedTests:{}};CKEDITOR.filter.instances[this.id]=this;if(editorOrRules instanceof CKEDITOR.editor){var editor=this.editor=editorOrRules;this.customConfig=true;var allowedContent=editor.config.allowedContent;if(allowedContent===true){this.disabled=true;return;}
if(!allowedContent)
this.customConfig=false;this.allow(allowedContent,'config',1);this.allow(editor.config.extraAllowedContent,'extra',1);this.allow(enterModeTags[editor.enterMode]+' '+enterModeTags[editor.shiftEnterMode],'default',1);}
else{this.customConfig=false;this.allow(editorOrRules,'default',1);}};CKEDITOR.filter.instances={};CKEDITOR.filter.prototype={allow:function(newRules,featureName,overrideCustom){if(this.disabled)
return false;if(this.customConfig&&!overrideCustom)
return false;if(!newRules)
return false;this._.cachedChecks={};var i,ret;if(typeof newRules=='string')
newRules=parseRulesString(newRules);else if(newRules instanceof CKEDITOR.style)
newRules=convertStyleToRules(newRules);else if(CKEDITOR.tools.isArray(newRules)){for(i=0;i<newRules.length;++i)
ret=this.allow(newRules[i],featureName,overrideCustom);return ret;}
var groupName,rule,rulesToOptimize=[];for(groupName in newRules){rule=newRules[groupName];if(typeof rule=='boolean')
rule={};else if(typeof rule=='function')
rule={match:rule};else
rule=copy(rule);if(groupName.charAt(0)!='$')
rule.elements=groupName;if(featureName)
rule.featureName=featureName.toLowerCase();standardizeRule(rule);this.allowedContent.push(rule);rulesToOptimize.push(rule);}
optimizeRules(this._.rules,rulesToOptimize);return true;},applyTo:function(fragment,toHtml,transformOnly,enterMode){if(this.disabled)
return false;var toBeRemoved=[],rules=!transformOnly&&this._.rules,transformations=this._.transformations,filterFn=getFilterFunction(this),protectedRegexs=this.editor&&this.editor.config.protectedSource,isModified=false;fragment.forEach(function(el){if(el.type==CKEDITOR.NODE_ELEMENT){if(el.attributes['data-cke-filter']=='off')
return false;if(toHtml&&el.name=='span'&&~CKEDITOR.tools.objectKeys(el.attributes).join('|').indexOf('data-cke-'))
return;if(filterFn(el,rules,transformations,toBeRemoved,toHtml))
isModified=true;}
else if(el.type==CKEDITOR.NODE_COMMENT&&el.value.match(/^\{cke_protected\}(?!\{C\})/)){if(!filterProtectedElement(el,protectedRegexs,filterFn,rules,transformations,toHtml))
toBeRemoved.push(el);}},null,true);if(toBeRemoved.length)
isModified=true;var node,element,check,toBeChecked=[],enterTag=enterModeTags[enterMode||(this.editor?this.editor.enterMode:CKEDITOR.ENTER_P)];while((node=toBeRemoved.pop())){if(node.type==CKEDITOR.NODE_ELEMENT)
removeElement(node,enterTag,toBeChecked);else
node.remove();}
while((check=toBeChecked.pop())){element=check.el;if(!element.parent)
continue;switch(check.check){case'it':if(DTD.$removeEmpty[element.name]&&!element.children.length)
removeElement(element,enterTag,toBeChecked);else if(!validateElement(element))
removeElement(element,enterTag,toBeChecked);break;case'el-up':if(element.parent.type!=CKEDITOR.NODE_DOCUMENT_FRAGMENT&&!DTD[element.parent.name][element.name])
removeElement(element,enterTag,toBeChecked);break;case'parent-down':if(element.parent.type!=CKEDITOR.NODE_DOCUMENT_FRAGMENT&&!DTD[element.parent.name][element.name])
removeElement(element.parent,enterTag,toBeChecked);break;}}
return isModified;},checkFeature:function(feature){if(this.disabled)
return true;if(!feature)
return true;if(feature.toFeature)
feature=feature.toFeature(this.editor);return!feature.requiredContent||this.check(feature.requiredContent);},disable:function(){this.disabled=true;},addContentForms:function(forms){if(this.disabled)
return;if(!forms)
return;var i,form,transfGroups=[],preferredForm;for(i=0;i<forms.length&&!preferredForm;++i){form=forms[i];if((typeof form=='string'||form instanceof CKEDITOR.style)&&this.check(form))
preferredForm=form;}
if(!preferredForm)
return;for(i=0;i<forms.length;++i)
transfGroups.push(getContentFormTransformationGroup(forms[i],preferredForm));this.addTransformations(transfGroups);},addFeature:function(feature){if(this.disabled)
return true;if(!feature)
return true;if(feature.toFeature)
feature=feature.toFeature(this.editor);this.allow(feature.allowedContent,feature.name);this.addTransformations(feature.contentTransformations);this.addContentForms(feature.contentForms);if(this.customConfig&&feature.requiredContent)
return this.check(feature.requiredContent);return true;},addTransformations:function(transformations){if(this.disabled)
return;if(!transformations)
return;var optimized=this._.transformations,group,i;for(i=0;i<transformations.length;++i){group=optimizeTransformationsGroup(transformations[i]);if(!optimized[group.name])
optimized[group.name]=[];optimized[group.name].push(group.rules);}},check:function(test,applyTransformations,strictCheck){if(this.disabled)
return true;if(CKEDITOR.tools.isArray(test)){for(var i=test.length;i--;){if(this.check(test[i],applyTransformations,strictCheck))
return true;}
return false;}
var element,result,cacheKey;if(typeof test=='string'){cacheKey=test+'<'+(applyTransformations===false?'0':'1')+(strictCheck?'1':'0')+'>';if(cacheKey in this._.cachedChecks)
return this._.cachedChecks[cacheKey];element=mockElementFromString(test);}else
element=mockElementFromStyle(test);var clone=CKEDITOR.tools.clone(element),toBeRemoved=[],transformations;if(applyTransformations!==false&&(transformations=this._.transformations[element.name])){for(i=0;i<transformations.length;++i)
applyTransformationsGroup(this,element,transformations[i]);updateAttributes(element);}
getFilterFunction(this)(clone,this._.rules,applyTransformations===false?false:this._.transformations,toBeRemoved,false,!strictCheck,!strictCheck);if(toBeRemoved.length>0)
result=false;else if(!CKEDITOR.tools.objectCompare(element.attributes,clone.attributes,true))
result=false;else
result=true;if(typeof test=='string')
this._.cachedChecks[cacheKey]=result;return result;},getAllowedEnterMode:(function(){var tagsToCheck=['p','div','br'],enterModes={p:CKEDITOR.ENTER_P,div:CKEDITOR.ENTER_DIV,br:CKEDITOR.ENTER_BR};return function(defaultMode,reverse){var tags=tagsToCheck.slice(),tag;if(this.check(enterModeTags[defaultMode]))
return defaultMode;if(!reverse)
tags=tags.reverse();while((tag=tags.pop())){if(this.check(tag))
return enterModes[tag];}
return CKEDITOR.ENTER_BR;};})()};function applyRule(rule,element,status,isSpecific,skipRequired){var name=element.name;if(!isSpecific&&typeof rule.elements=='function'&&!rule.elements(name))
return;if(rule.match){if(!rule.match(element))
return;}
if(!skipRequired&&!hasAllRequired(rule,element))
return;if(!rule.propertiesOnly)
status.valid=true;if(!status.allAttributes)
status.allAttributes=applyRuleToHash(rule.attributes,element.attributes,status.validAttributes);if(!status.allStyles)
status.allStyles=applyRuleToHash(rule.styles,element.styles,status.validStyles);if(!status.allClasses)
status.allClasses=applyRuleToArray(rule.classes,element.classes,status.validClasses);}
function applyRuleToArray(itemsRule,items,validItems){if(!itemsRule)
return false;if(itemsRule===true)
return true;for(var i=0,l=items.length,item;i<l;++i){item=items[i];if(!validItems[item])
validItems[item]=itemsRule(item);}
return false;}
function applyRuleToHash(itemsRule,items,validItems){if(!itemsRule)
return false;if(itemsRule===true)
return true;for(var name in items){if(!validItems[name])
validItems[name]=itemsRule(name,items[name]);}
return false;}
function convertStyleToRules(style){var styleDef=style.getDefinition(),rules={},rule,attrs=styleDef.attributes;rules[styleDef.element]=rule={styles:styleDef.styles,requiredStyles:styleDef.styles&&CKEDITOR.tools.objectKeys(styleDef.styles)};if(attrs){attrs=copy(attrs);rule.classes=attrs['class']?attrs['class'].split(/\s+/):null;rule.requiredClasses=rule.classes;delete attrs['class'];rule.attributes=attrs;rule.requiredAttributes=attrs&&CKEDITOR.tools.objectKeys(attrs);}
return rules;}
function convertValidatorToHash(validator,delimiter){if(!validator)
return false;if(validator===true)
return validator;if(typeof validator=='string'){validator=trim(validator);if(validator=='*')
return true;else
return CKEDITOR.tools.convertArrayToObject(validator.split(delimiter));}
else if(CKEDITOR.tools.isArray(validator)){if(validator.length)
return CKEDITOR.tools.convertArrayToObject(validator);else
return false;}
else{var obj={},len=0;for(var i in validator){obj[i]=validator[i];len++;}
return len?obj:false;}}
function extractRequired(required,all){var unbang=[],empty=true,i;if(required)
empty=false;else
required={};for(i in all){if(i.charAt(0)=='!'){i=i.slice(1);unbang.push(i);required[i]=true;empty=false;}}
while((i=unbang.pop())){all[i]=all['!'+i];delete all['!'+i];}
return empty?false:required;}
function filterProtectedElement(comment,protectedRegexs,filterFn,rules,transformations,toHtml){var source=decodeURIComponent(comment.value.replace(/^\{cke_protected\}/,'')),protectedFrag,toBeRemoved=[],node,i,match;if(protectedRegexs){for(i=0;i<protectedRegexs.length;++i){if((match=source.match(protectedRegexs[i]))&&match[0].length==source.length)
return true;}}
protectedFrag=CKEDITOR.htmlParser.fragment.fromHtml(source);if(protectedFrag.children.length==1&&(node=protectedFrag.children[0]).type==CKEDITOR.NODE_ELEMENT)
filterFn(node,rules,transformations,toBeRemoved,toHtml);return!toBeRemoved.length;}
function getFilterFunction(that){if(that._.filterFunction)
return that._.filterFunction;var unprotectElementsNamesRegexp=/^cke:(object|embed|param)$/,protectElementsNamesRegexp=/^(object|embed|param)$/;return that._.filterFunction=function(element,optimizedRules,transformations,toBeRemoved,toHtml,skipRequired,skipFinalValidation){var name=element.name,i,l,trans,isModified=false;if(toHtml)
element.name=name=name.replace(unprotectElementsNamesRegexp,'$1');if((transformations=transformations&&transformations[name])){populateProperties(element);for(i=0;i<transformations.length;++i)
applyTransformationsGroup(that,element,transformations[i]);updateAttributes(element);}
if(optimizedRules){name=element.name;var rules=optimizedRules.elements[name],genericRules=optimizedRules.generic,status={valid:false,validAttributes:{},validClasses:{},validStyles:{},allAttributes:false,allClasses:false,allStyles:false};if(!rules&&!genericRules){toBeRemoved.push(element);return true;}
populateProperties(element);if(rules){for(i=0,l=rules.length;i<l;++i)
applyRule(rules[i],element,status,true,skipRequired);}
if(genericRules){for(i=0,l=genericRules.length;i<l;++i)
applyRule(genericRules[i],element,status,false,skipRequired);}
if(!status.valid){toBeRemoved.push(element);return true;}
if(updateElement(element,status))
isModified=true;if(!skipFinalValidation&&!validateElement(element)){toBeRemoved.push(element);return true;}}
if(toHtml)
element.name=element.name.replace(protectElementsNamesRegexp,'cke:$1');return isModified;};}
function hasAllRequired(rule,element){if(rule.nothingRequired)
return true;var i,reqs,existing;if((reqs=rule.requiredClasses)){existing=element.classes;for(i=0;i<reqs.length;++i){if(CKEDITOR.tools.indexOf(existing,reqs[i])==-1)
return false;}}
return hasAllRequiredInHash(element.styles,rule.requiredStyles)&&hasAllRequiredInHash(element.attributes,rule.requiredAttributes);}
function hasAllRequiredInHash(existing,required){if(!required)
return true;for(var i=0;i<required.length;++i){if(!(required[i]in existing))
return false;}
return true;}
function mockElementFromString(str){var element=parseRulesString(str)['$1'],styles=element.styles,classes=element.classes;element.name=element.elements;element.classes=classes=(classes?classes.split(/\s*,\s*/):[]);element.styles=mockHash(styles);element.attributes=mockHash(element.attributes);element.children=[];if(classes.length)
element.attributes['class']=classes.join(' ');if(styles)
element.attributes.style=CKEDITOR.tools.writeCssText(element.styles);return element;}
function mockElementFromStyle(style){var styleDef=style.getDefinition(),styles=styleDef.styles,attrs=styleDef.attributes||{};if(styles){styles=copy(styles);attrs.style=CKEDITOR.tools.writeCssText(styles,true);}else
styles={};var el={name:styleDef.element,attributes:attrs,classes:attrs['class']?attrs['class'].split(/\s+/):[],styles:styles,children:[]};return el;}
function mockHash(str){if(!str)
return{};var keys=str.split(/\s*,\s*/).sort(),obj={};while(keys.length)
obj[keys.shift()]=TEST_VALUE;return obj;}
var validators={styles:1,attributes:1,classes:1},validatorsRequired={styles:'requiredStyles',attributes:'requiredAttributes',classes:'requiredClasses'};function optimizeRule(rule){var i;for(i in validators)
rule[i]=validatorFunction(rule[i]);var nothingRequired=true;for(i in validatorsRequired){i=validatorsRequired[i];rule[i]=CKEDITOR.tools.objectKeys(rule[i]);if(rule[i])
nothingRequired=false;}
rule.nothingRequired=nothingRequired;}
function optimizeRules(optimizedRules,rules){var elementsRules=optimizedRules.elements||{},genericRules=optimizedRules.generic||[],i,l,j,rule,element,priority;for(i=0,l=rules.length;i<l;++i){rule=copy(rules[i]);priority=rule.classes===true||rule.styles===true||rule.attributes===true;optimizeRule(rule);if(rule.elements===true||rule.elements===null){rule.elements=validatorFunction(rule.elements);genericRules[priority?'unshift':'push'](rule);}
else{var elements=rule.elements;delete rule.elements;for(element in elements){if(!elementsRules[element])
elementsRules[element]=[rule];else
elementsRules[element][priority?'unshift':'push'](rule);}}}
optimizedRules.elements=elementsRules;optimizedRules.generic=genericRules.length?genericRules:null;}
var rulePattern=/^([a-z0-9*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i,groupsPatterns={styles:/{([^}]+)}/,attrs:/\[([^\]]+)\]/,classes:/\(([^\)]+)\)/};function parseRulesString(input){var match,props,styles,attrs,classes,rules={},groupNum=1;input=trim(input);while((match=input.match(rulePattern))){if((props=match[2])){styles=parseProperties(props,'styles');attrs=parseProperties(props,'attrs');classes=parseProperties(props,'classes');}else
styles=attrs=classes=null;rules['$'+groupNum++]={elements:match[1],classes:classes,styles:styles,attributes:attrs};input=input.slice(match[0].length);}
return rules;}
function parseProperties(properties,groupName){var group=properties.match(groupsPatterns[groupName]);return group?trim(group[1]):null;}
function populateProperties(element){if(!element.styles)
element.styles=CKEDITOR.tools.parseCssText(element.attributes.style||'',1);if(!element.classes)
element.classes=element.attributes['class']?element.attributes['class'].split(/\s+/):[];}
function standardizeRule(rule){rule.elements=convertValidatorToHash(rule.elements,/\s+/)||null;rule.propertiesOnly=rule.propertiesOnly||(rule.elements===true);var delim=/\s*,\s*/,i;for(i in validators){rule[i]=convertValidatorToHash(rule[i],delim)||null;rule[validatorsRequired[i]]=extractRequired(convertValidatorToHash(rule[validatorsRequired[i]],delim),rule[i])||null;}
rule.match=rule.match||null;}
function updateAttributes(element){var attrs=element.attributes,stylesArr=[],name,styles;delete attrs.style;delete attrs['class'];if((styles=CKEDITOR.tools.writeCssText(element.styles,true)))
attrs.style=styles;if(element.classes.length)
attrs['class']=element.classes.sort().join(' ');}
function updateElement(element,status){var validAttrs=status.validAttributes,validStyles=status.validStyles,validClasses=status.validClasses,attrs=element.attributes,styles=element.styles,origClasses=attrs['class'],origStyles=attrs.style,name,origName,stylesArr=[],classesArr=[],internalAttr=/^data-cke-/,isModified=false;delete attrs.style;delete attrs['class'];if(!status.allAttributes){for(name in attrs){if(!validAttrs[name]){if(internalAttr.test(name)){if(name!=(origName=name.replace(/^data-cke-saved-/,''))&&!validAttrs[origName]){delete attrs[name];isModified=true;}}else{delete attrs[name];isModified=true;}}}}
if(!status.allStyles){for(name in styles){if(validStyles[name])
stylesArr.push(name+':'+styles[name]);else
isModified=true;}
if(stylesArr.length)
attrs.style=stylesArr.sort().join('; ');}
else if(origStyles)
attrs.style=origStyles;if(!status.allClasses){for(name in validClasses){if(validClasses[name])
classesArr.push(name);}
if(classesArr.length)
attrs['class']=classesArr.sort().join(' ');if(origClasses&&classesArr.length<origClasses.split(/\s+/).length)
isModified=true;}
else if(origClasses)
attrs['class']=origClasses;return isModified;}
function validateElement(element){var attrs;switch(element.name){case'a':if(!(element.children.length||element.attributes.name))
return false;break;case'img':if(!element.attributes.src)
return false;break;}
return true;}
function validatorFunction(validator){if(!validator)
return false;if(validator===true)
return true;return function(value){return value in validator;};}
function allowedIn(node,parentDtd){if(node.type==CKEDITOR.NODE_ELEMENT)
return parentDtd[node.name];if(node.type==CKEDITOR.NODE_TEXT)
return parentDtd['#'];return true;}
function checkChildren(children,newParentName){var allowed=DTD[newParentName];for(var i=0,l=children.length,child;i<l;++i){child=children[i];if(child.type==CKEDITOR.NODE_ELEMENT&&!allowed[child.name])
return false;}
return true;}
function createBr(){return new CKEDITOR.htmlParser.element('br');}
function inlineNode(node){return node.type==CKEDITOR.NODE_TEXT||node.type==CKEDITOR.NODE_ELEMENT&&DTD.$inline[node.name];}
function isBrOrBlock(node){return node.type==CKEDITOR.NODE_ELEMENT&&(node.name=='br'||DTD.$block[node.name]);}
function removeElement(element,enterTag,toBeChecked){var name=element.name;if(DTD.$empty[name]||!element.children.length){if(name=='hr'&&enterTag=='br')
element.replaceWith(createBr());else{if(element.parent)
toBeChecked.push({check:'it',el:element.parent});element.remove();}}else if(DTD.$block[name]||name=='tr'){if(enterTag=='br')
stripBlockBr(element,toBeChecked);else
stripBlock(element,enterTag,toBeChecked);}
else if(name=='style')
element.remove();else{if(element.parent)
toBeChecked.push({check:'it',el:element.parent});element.replaceWithChildren();}}
function stripBlock(element,enterTag,toBeChecked){var children=element.children;if(checkChildren(children,enterTag)){element.name=enterTag;element.attributes={};toBeChecked.push({check:'parent-down',el:element});return;}
var parent=element.parent,shouldAutoP=parent.type==CKEDITOR.NODE_DOCUMENT_FRAGMENT||parent.name=='body',i,j,child,p,node,toBeRemoved=[];for(i=children.length;i>0;){child=children[--i];if(shouldAutoP&&inlineNode(child)){if(!p){p=new CKEDITOR.htmlParser.element(enterTag);p.insertAfter(element);toBeChecked.push({check:'parent-down',el:p});}
p.add(child,0);}
else{p=null;child.insertAfter(element);if(parent.type!=CKEDITOR.NODE_DOCUMENT_FRAGMENT&&child.type==CKEDITOR.NODE_ELEMENT&&!DTD[parent.name][child.name])
toBeChecked.push({check:'el-up',el:child});}}
element.remove();}
function stripBlockBr(element,toBeChecked){var br;if(element.previous&&!isBrOrBlock(element.previous)){br=createBr();br.insertBefore(element);}
if(element.next&&!isBrOrBlock(element.next)){br=createBr();br.insertAfter(element);}
element.replaceWithChildren();}
function applyTransformationsGroup(filter,element,group){var i,rule;for(i=0;i<group.length;++i){rule=group[i];if((!rule.check||filter.check(rule.check,false))&&(!rule.left||rule.left(element))){rule.right(element,transformationsTools);return;}}}
function elementMatchesStyle(element,style){var def=style.getDefinition(),defAttrs=def.attributes,defStyles=def.styles,attrName,styleName,classes,classPattern,cl;if(element.name!=def.element)
return false;for(attrName in defAttrs){if(attrName=='class'){classes=defAttrs[attrName].split(/\s+/);classPattern=element.classes.join('|');while((cl=classes.pop())){if(classPattern.indexOf(cl)==-1)
return false;}}else{if(element.attributes[attrName]!=defAttrs[attrName])
return false;}}
for(styleName in defStyles){if(element.styles[styleName]!=defStyles[styleName])
return false;}
return true;}
function getContentFormTransformationGroup(form,preferredForm){var element,left;if(typeof form=='string')
element=form;else if(form instanceof CKEDITOR.style)
left=form;else{element=form[0];left=form[1];}
return[{element:element,left:left,right:function(el,tools){tools.transform(el,preferredForm);}}];}
function getElementNameForTransformation(rule,check){if(rule.element)
return rule.element;if(check)
return check.match(/^([a-z0-9]+)/i)[0];return rule.left.getDefinition().element;}
function getMatchStyleFn(style){return function(el){return elementMatchesStyle(el,style);};}
function getTransformationFn(toolName){return function(el,tools){tools[toolName](el);};}
function optimizeTransformationsGroup(rules){var groupName,i,rule,check,left,right,optimizedRules=[];for(i=0;i<rules.length;++i){rule=rules[i];if(typeof rule=='string'){rule=rule.split(/\s*:\s*/);check=rule[0];left=null;right=rule[1];}else{check=rule.check;left=rule.left;right=rule.right;}
if(!groupName)
groupName=getElementNameForTransformation(rule,check);if(left instanceof CKEDITOR.style)
left=getMatchStyleFn(left);optimizedRules.push({check:check==groupName?null:check,left:left,right:typeof right=='string'?getTransformationFn(right):right});}
return{name:groupName,rules:optimizedRules};}
var transformationsTools=CKEDITOR.filter.transformationsTools={sizeToStyle:function(element){this.lengthToStyle(element,'width');this.lengthToStyle(element,'height');},sizeToAttribute:function(element){this.lengthToAttribute(element,'width');this.lengthToAttribute(element,'height');},lengthToStyle:function(element,attrName,styleName){styleName=styleName||attrName;if(!(styleName in element.styles)){var value=element.attributes[attrName];if(value){if((/^\d+$/).test(value))
value+='px';element.styles[styleName]=value;}}
delete element.attributes[attrName];},lengthToAttribute:function(element,styleName,attrName){attrName=attrName||styleName;if(!(attrName in element.attributes)){var value=element.styles[styleName],match=value&&value.match(/^(\d+)(?:\.\d*)?px$/);if(match)
element.attributes[attrName]=match[1];else if(value==TEST_VALUE)
element.attributes[attrName]=TEST_VALUE;}
delete element.styles[styleName];},alignmentToStyle:function(element){if(!('float'in element.styles)){var value=element.attributes.align;if(value=='left'||value=='right')
element.styles['float']=value;}
delete element.attributes.align;},alignmentToAttribute:function(element){if(!('align'in element.attributes)){var value=element.styles['float'];if(value=='left'||value=='right')
element.attributes.align=value;}
delete element.styles['float'];},matchesStyle:elementMatchesStyle,transform:function(el,form){if(typeof form=='string')
el.name=form;else{var def=form.getDefinition(),defStyles=def.styles,defAttrs=def.attributes,attrName,styleName,existingClassesPattern,defClasses,cl;el.name=def.element;for(attrName in defAttrs){if(attrName=='class'){existingClassesPattern=el.classes.join('|');defClasses=defAttrs[attrName].split(/\s+/);while((cl=defClasses.pop())){if(existingClassesPattern.indexOf(cl)==-1)
el.classes.push(cl);}}else
el.attributes[attrName]=defAttrs[attrName];}
for(styleName in defStyles){el.styles[styleName]=defStyles[styleName];}}}};})();