'use strict';(function(){CKEDITOR.htmlParser.filter=CKEDITOR.tools.createClass({$:function(rules){this.id=CKEDITOR.tools.getNextNumber();this.elementNameRules=new filterRulesGroup();this.attributeNameRules=new filterRulesGroup();this.elementsRules={};this.attributesRules={};this.textRules=new filterRulesGroup();this.commentRules=new filterRulesGroup();this.rootRules=new filterRulesGroup();if(rules)
this.addRules(rules,10);},proto:{addRules:function(rules,options){var priority;if(typeof options=='number')
priority=options;else if(options&&('priority'in options))
priority=options.priority;if(typeof priority!='number')
priority=10;if(typeof options!='object')
options={};if(rules.elementNames)
this.elementNameRules.addMany(rules.elementNames,priority,options);if(rules.attributeNames)
this.attributeNameRules.addMany(rules.attributeNames,priority,options);if(rules.elements)
addNamedRules(this.elementsRules,rules.elements,priority,options);if(rules.attributes)
addNamedRules(this.attributesRules,rules.attributes,priority,options);if(rules.text)
this.textRules.add(rules.text,priority,options);if(rules.comment)
this.commentRules.add(rules.comment,priority,options);if(rules.root)
this.rootRules.add(rules.root,priority,options);},applyTo:function(node){node.filter(this);},onElementName:function(context,name){return this.elementNameRules.execOnName(context,name);},onAttributeName:function(context,name){return this.attributeNameRules.execOnName(context,name);},onText:function(context,text){return this.textRules.exec(context,text);},onComment:function(context,commentText,comment){return this.commentRules.exec(context,commentText,comment);},onRoot:function(context,element){return this.rootRules.exec(context,element);},onElement:function(context,element){var rulesGroups=[this.elementsRules['^'],this.elementsRules[element.name],this.elementsRules.$],rulesGroup,ret;for(var i=0;i<3;i++){rulesGroup=rulesGroups[i];if(rulesGroup){ret=rulesGroup.exec(context,element,this);if(ret===false)
return null;if(ret&&ret!=element)
return this.onNode(context,ret);if(element.parent&&!element.name)
break;}}
return element;},onNode:function(context,node){var type=node.type;return type==CKEDITOR.NODE_ELEMENT?this.onElement(context,node):type==CKEDITOR.NODE_TEXT?new CKEDITOR.htmlParser.text(this.onText(context,node.value)):type==CKEDITOR.NODE_COMMENT?new CKEDITOR.htmlParser.comment(this.onComment(context,node.value)):null;},onAttribute:function(context,element,name,value){var rulesGroup=this.attributesRules[name];if(rulesGroup)
return rulesGroup.exec(context,value,element,this);return value;}}});function filterRulesGroup(){this.rules=[];}
CKEDITOR.htmlParser.filterRulesGroup=filterRulesGroup;filterRulesGroup.prototype={add:function(rule,priority,options){this.rules.splice(this.findIndex(priority),0,{value:rule,priority:priority,options:options});},addMany:function(rules,priority,options){var args=[this.findIndex(priority),0];for(var i=0,len=rules.length;i<len;i++){args.push({value:rules[i],priority:priority,options:options});}
this.rules.splice.apply(this.rules,args);},findIndex:function(priority){var rules=this.rules,len=rules.length,i=len-1;while(i>=0&&priority<rules[i].priority)
i--;return i+1;},exec:function(context,currentValue){var isNode=currentValue instanceof CKEDITOR.htmlParser.node||currentValue instanceof CKEDITOR.htmlParser.fragment,args=Array.prototype.slice.call(arguments,1),rules=this.rules,len=rules.length,orgType,orgName,ret,i,rule;for(i=0;i<len;i++){if(isNode){orgType=currentValue.type;orgName=currentValue.name;}
rule=rules[i];if(isRuleApplicable(context,rule)){ret=rule.value.apply(null,args);if(ret===false)
return ret;if(isNode&&ret&&(ret.name!=orgName||ret.type!=orgType))
return ret;if(ret!=undefined)
args[0]=currentValue=ret;}}
return currentValue;},execOnName:function(context,currentName){var i=0,rules=this.rules,len=rules.length,rule;for(;currentName&&i<len;i++){rule=rules[i];if(isRuleApplicable(context,rule))
currentName=currentName.replace(rule.value[0],rule.value[1]);}
return currentName;}};function addNamedRules(rulesGroups,newRules,priority,options){var ruleName,rulesGroup;for(ruleName in newRules){rulesGroup=rulesGroups[ruleName];if(!rulesGroup)
rulesGroup=rulesGroups[ruleName]=new filterRulesGroup();rulesGroup.add(newRules[ruleName],priority,options);}}
function isRuleApplicable(context,rule){if(context.nonEditable&&!rule.options.applyToAll)
return false;if(context.nestedEditable&&rule.options.excludeNestedEditable)
return false;return true;}})();