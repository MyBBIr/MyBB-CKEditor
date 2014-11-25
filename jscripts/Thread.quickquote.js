// https://github.com/martec/quickadveditorplus/blob/master/jscripts/Thread.quickquote.js
// Thanks martec :heart:

// Credits: http://stackoverflow.com/a/8340432
function isOrContains(node, container) {
	while (node) {
		if (node === container) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}

function elementContainsSelection(el) {
	var sel;
	if ($.trim(window.getSelection().toString())) {
		sel = window.getSelection();
		if (sel.rangeCount > 0) {
			for (var i = 0; i < sel.rangeCount; ++i) {
				if (!isOrContains(sel.getRangeAt(i).commonAncestorContainer, el)) {
					return false;
				}
			}
			return true;
		}
	}
	return false;
}

function quick_quote(pid, username, dateline) {
	function quick() {
		setTimeout(function() {
			if (elementContainsSelection(document.getElementById('pid_' + pid + ''))) {
				$('#qr_pid_' + pid + '').show();
			}
			else {
				$('#qr_pid_' + pid + '').hide();
			}
		},50);
	}
	if ($('.new_reply_button').length && $('#quick_reply_form').length) {
		$('#pid_' + pid + '').mousemove(quick).click(quick).find('blockquote').css({
			"-webkit-touch-callout": "none",
			"-webkit-user-select": "none",
			"-khtml-user-select": "none",
			"-moz-user-select": "none",
			"-ms-user-select": "none",
			"user-select": "none" 
		});
		$('body:not("#pid_' + pid + '")').click(function (){
			if (!$.trim(window.getSelection().toString())){
				$('#qr_pid_' + pid + '').hide();
			}
		})
		$('#qr_pid_' + pid + '').click(function (e){
			e.preventDefault();
			setTimeout(function() {
				if (elementContainsSelection(document.getElementById('pid_' + pid + ''))) {
					Thread.quickQuote(pid,'' + username + '',dateline);
				}
				else {
					$('#qr_pid_' + pid + '').hide();
				}
			},200);
		})
	}
}

var MYBB_SMILIES = {};
$(document).ready(function()
{
$.each(smilieyurlmap , function(key, value) {
	MYBB_SMILIES[value] = smiliesmap[key]; 
});
// Credits: http://mods.mybb.com/view/quickquote
Thread.quickQuote = function(pid, username, dateline)
{
	if(window.getSelection().toString().trim()) {
		userSelection = window.getSelection().getRangeAt(0).cloneContents();
		var quoteText = "[quote='" + username + "' pid='" + pid + "' dateline='" + dateline + "']\n";
		quoteText += Thread.domToBB(userSelection , MYBB_SMILIES);
		quoteText += "\n[/quote]\n";

		delete userSelection;

		Thread.updateMessageBox(quoteText);
	}
}

Thread.updateMessageBox = function(message)
{
	setTimeout(function() {
		MyBBEditor.insertText(message);
	},200);
	clickableEditor.editor.focus();
}

Thread.RGBtoHex = function (R,G,B) {return Thread.toHex(R)+Thread.toHex(G)+Thread.toHex(B)}
Thread.toHex = function(N)
{
	if (N==null) return "00";
	N=parseInt(N); if (N==0 || isNaN(N)) return "00";
	N=Math.max(0,N); N=Math.min(N,255); N=Math.round(N);
	return "0123456789ABCDEF".charAt((N-N%16)/16)
			+ "0123456789ABCDEF".charAt(N%16);
}

Thread.domToBB = function(domEl, smilies)
{
	var output = "";
	var childNode;
	var openTag;
	var content;
	var closeTag;

	for(var i = 0 ; i < domEl.childNodes.length ; i++)
	{
		childNode = domEl.childNodes[i];
		openTag = "";
		content = "";
		closeTag = "";

		if(typeof childNode.tagName == "undefined")
		{
			switch(childNode.nodeName)
			{
				case '#text':
					output += childNode.data.replace(/[\n\t]+/,'');
				break;
				default:
					// do nothing
				break;

			}
		}
		else
		{
			switch(childNode.tagName)
			{
				case "SPAN":
					// check style attributes
					switch(true)
					{
						case childNode.style.textDecoration == "underline":
							openTag = "[u]";
							closeTag = "[/u]";
							break;
						case childNode.style.fontWeight > 0:
						case childNode.style.fontWeight == "bold":
							openTag = "[b]";
							closeTag = "[/b]";
							break;
						case childNode.style.fontStyle == "italic":
							openTag = "[i]";
							closeTag = "[/i]";
							break;
						case childNode.style.fontFamily != "":
							openTag = "[font=" + childNode.style.fontFamily + "]";
							closeTag = "[/font]";
							break;
						case childNode.style.fontSize != "":
							openTag = "[size=" + childNode.style.fontSize + "]";
							closeTag = "[/size]";
							break;
						case childNode.style.color != "":
							if(childNode.style.color.indexOf('rgb') != -1)
							{
								var rgb = childNode.style.color.replace("rgb(","").replace(")","").split(",");
								var hex = "#"+Thread.RGBtoHex(parseInt(rgb[0]) , parseInt(rgb[1]) , parseInt(rgb[2]));
							}
							else
							{
								var hex = childNode.style.color;
							}
							openTag = "[color=" + hex + "]";
							closeTag = "[/color]";
							break;
					}
					break;
				case "STRONG":
				case "B":
					openTag = "[b]";
					closeTag = "[/b]";
					break;
				case "EM":
				case "I":
					openTag = "[i]";
					closeTag = "[/i]";
					break;
				case "U":
					openTag = "[u]";
					closeTag = "[/u]";
					break;
				case "IMG":
					if(smilies[childNode.src])
					{
						openTag ="";
						content = smilies[childNode.src];
						closeTag = "";
					}
					else
					{
						openTag ="[img]";
						content = childNode.src;
						closeTag = "[/img]";
					}
					break;
				case "A":
					switch(true)
					{
						case childNode.href.indexOf("mailto:") == 0:
							openTag = "[email=" + childNode.href.replace("mailto:","") + "]";
							closeTag = "[/email]";
						break;
						default:
							openTag = "[url=" + childNode.href + "]";
							closeTag = "[/url]";
						break;
					}
					break;
				case "OL":
					openTag = "[list=" + childNode.type + "]";
					closeTag = "\n[/list]";
					break;
				case "UL":
					openTag = "[list]";
					closeTag = "\n[/list]";
					break;
				case "LI":
					openTag = "\n[*]";
					closeTag = "";
					break;
				case "BLOCKQUOTE":
					childNode.removeChild(childNode.firstChild);
					openTag = "[quote]\n";
					closeTag = "\n[/quote]";
					break;
				case "DIV":
					if(childNode.style.textAlign)
					{
						openTag = "[align="+childNode.style.textAlign+"]\n";
						closeTag = "\n[/align]\n";
					}

					switch(childNode.className)
					{
						case "codeblock":
							openTag = "[code]\n";
							closeTag = "\n[/code]";
							childNode.removeChild(childNode.getElementsByTagName("div")[0]);
							break;
						case "codeblock phpcodeblock":
							var codeTag = childNode.getElementsByTagName("code")[0];
							childNode.removeChild(childNode.getElementsByTagName("div")[0]);
							openTag = "[php]\n";
							if(codeTag.innerText)
							{
								content = codeTag.innerText;
							}
							else
							{
								//content = codeTag.textContent;
								content = codeTag.innerHTML.replace(/<br([^>]*)>/gi,"\n").replace(/<([^<]+)>/gi,'').replace(/&nbsp;/gi,' ');
							}
							closeTag = "\n[/php]";
							break;
					}
					break;
				case "P":
						closeTag = "\n\n";
					break;
				case "BR":
						closeTag = "\n"
					break;
			}

			output += openTag + content;

			if(content == "" && childNode.childNodes && childNode.childNodes.length > 0)
			{
				output += Thread.domToBB(childNode , smilies);
			}

			output += closeTag;
		}
	}

	return output;
}

});