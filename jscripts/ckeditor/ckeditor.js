var bbcodeParser = {};

(function() {
	var token_match = /{[A-Z_]+[0-9]*}/g;

	// regular expressions for the different bbcode tokens
	bbcodeParser.tokens = {
		'URL'			: '((?:(?:[a-z][a-z\\d+\\-.]*:\\/{2}(?:(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})+|[0-9.]+|\\[[a-z0-9.]+:[a-z0-9.]+:[a-z0-9.:]+\\])(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})*)*(?:\\?(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?(?:#(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?)|(?:www\\.(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})+(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~\\!$&\'*+,;=:@|]+|%[\\dA-F]{2})*)*(?:\\?(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?(?:#(?:[a-z0-9\\-._~\\!$&\'*+,;=:@\\/?|]+|%[\\dA-F]{2})*)?)))',
		'LOCAL_URL'		: '((?:[a-z0-9\-._~\!$&\'()*+,;=:@|]+|%[\dA-F]{2})*(?:\/(?:[a-z0-9\-._~\!$&\'()*+,;=:@|]+|%[\dA-F]{2})*)*(?:\?(?:[a-z0-9\-._~\!$&\'()*+,;=:@\/?|]+|%[\dA-F]{2})*)?(?:#(?:[a-z0-9\-._~\!$&\'()*+,;=:@\/?|]+|%[\dA-F]{2})*)?)',
		'EMAIL'			: '((?:[\\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*(?:[\\w\!\#$\%\'\*\+\-\/\=\?\^\`{\|\}\~]|&)+@(?:(?:(?:(?:(?:[a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(?:\\d{1,3}\.){3}\\d{1,3}(?:\:\\d{1,5})?))',
		'TEXT'			: '([^]*?)',
		'SIMPLETEXT'	: '([a-zA-Z0-9-+.,_ ]+)',
		'INTTEXT'		: '([a-zA-Z0-9-+,_. ]+)',
		'IDENTIFIER'	: '([a-zA-Z0-9-_]+)',
		'COLOR'			: '([a-zA-Z]+|#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6})',
		'NUMBER'		: '([0-9]+)',
		'ALIGN'			: '(left|right|center)',
		'FONTSIZE'		: '(xx-small|x-small|small|medium|large|x-large|xx-large)',
		'TEXT_INTAG'			: '([^\'"><]+)',
		'TAG_ATTRS'			: '([^\]\[><]+)',
		'TEXT_ONELINE'			: '([^\n]+)',
		'NEWLINE'			: '[\n|\r\n]'
	};

	// matches for bbcode to html
	bbcodeParser.bbcode_matches = [];

	// html templates for bbcode to html
	bbcodeParser.html_tpls = [];

	// matches for html to bbcode
	bbcodeParser.html_matches = [];

	// bbcode templates for bbcode to html
	bbcodeParser.bbcode_tpls = [];

	/**
	 * Turns a bbcode into a regular rexpression by changing the tokens into
	 * their regex form
	 */
	bbcodeParser._getRegEx = function(str) {
		var matches = str.match(token_match);
		var i = 0;
		var replacement = '';

		if (!matches || matches.length <= 0) {
			// no tokens so return the escaped string
			return new RegExp(preg_quote(str), 'gi');
		}

		for(; i < matches.length; i += 1) {
			// Remove {, } and numbers from the token so it can match the
			// keys in bbcodeParser.tokens
			var token = matches[i].replace(/[{}0-9]/g, '');

			if (bbcodeParser.tokens[token]) {
				// Escape everything before the token
				replacement += preg_quote(str.substr(0, str.indexOf(matches[i]))) + bbcodeParser.tokens[token];

				// Remove everything before the end of the token so it can be used
				// with the next token. Doing this so that parts can be escaped
				str = str.substr(str.indexOf(matches[i]) + matches[i].length);
			}
		}

		// add whatever is left to the string
		replacement += preg_quote(str);

		return new RegExp(replacement, 'gi');
	};

	/**
	 * Turns a bbcode template into the replacement form used in regular expressions
	 * by turning the tokens in $1, $2, etc.
	 */
	bbcodeParser._getTpls = function(str) {
		var matches = str.match(token_match);
		var i = 0;
		var replacement = '';
		var positions = {};
		var next_position = 0;

		if (!matches || matches.length <= 0) {
			// no tokens so return the string
			return str;
		}

		for(; i < matches.length; i += 1) {
			// Remove {, } and numbers from the token so it can match the
			// keys in bbcodeParser.tokens
			var token = matches[i].replace(/[{}0-9]/g, '');
			var position;

			// figure out what $# to use ($1, $2)
			if (positions[matches[i]]) {
				// if the token already has a position then use that
				position = positions[matches[i]];
			} else {
				// token doesn't have a position so increment the next position
				// and record this token's position
				next_position += 1;
				position = next_position;
				positions[matches[i]] = position;
			}

			if (bbcodeParser.tokens[token]) {
				replacement += str.substr(0, str.indexOf(matches[i])) + '$' + position;
				str = str.substr(str.indexOf(matches[i]) + matches[i].length);
			}
		}

		replacement += str;

		return replacement;
	};

	/**
	 * Adds a bbcode to the list
	 */
	bbcodeParser.addBBCode = function(bbcode_match, bbcode_tpl,type) {
		if(!type) type = 'all';
		if(type == 'all' || type == 'bbcodetohtml')
		{
			// add the regular expressions and templates for bbcode to html
			bbcodeParser.bbcode_matches.push(bbcodeParser._getRegEx(bbcode_match));
			bbcodeParser.html_tpls.push(bbcodeParser._getTpls(bbcode_tpl));
		}
		if(type == 'all' || type == 'htmltobbcode')
		{
			// add the regular expressions and templates for html to bbcode
			bbcodeParser.html_matches.push(bbcodeParser._getRegEx(bbcode_tpl));
			bbcodeParser.bbcode_tpls.push(bbcodeParser._getTpls(bbcode_match));
		}
	};

	/**
	 * Turns all of the added bbcodes into html
	 */
	bbcodeParser.bbcodeToHtml = function(str) {
		var i = 0;

		for(; i < bbcodeParser.bbcode_matches.length; i += 1) {
			str = str.replace(bbcodeParser.bbcode_matches[i], bbcodeParser.html_tpls[i]);
		}

		return str;
	};

	/**
	 * Turns html into bbcode
	 */
	bbcodeParser.htmlToBBCode = function(str) {
		var i = 0;
		for(; i < bbcodeParser.html_matches.length; i += 1) {
			str = str.replace(bbcodeParser.html_matches[i], bbcodeParser.bbcode_tpls[i]);
		}
		
		str = str.replace('<br>', '\n');

		return str;
	}

	/**
	 * Quote regular expression characters plus an optional character
	 * taken from phpjs.org
	 */
	function preg_quote (str, delimiter) {
		// http://kevin.vanzonneveld.net
		// +   original by: booeyOH
		// +   improved by: Ates Goral (http://magnetiq.com)
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   bugfixed by: Onno Marsman
		// +   improved by: Brett Zamir (http://brett-zamir.me)
		// *     example 1: preg_quote("$40");
		// *     returns 1: '\$40'
		// *     example 2: preg_quote("*RRRING* Hello?");
		// *     returns 2: '\*RRRING\* Hello\?'
		// *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
		// *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
		return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
	}
})();


bbcodeParser.addBBCode('</div>', '</div><br />', 'htmltobbcode');
bbcodeParser.addBBCode('</p>', '</p><br />', 'htmltobbcode');
bbcodeParser.addBBCode('<p>', '<br /><p>', 'htmltobbcode');
bbcodeParser.addBBCode('</h1>', '</h1><br />', 'htmltobbcode');
bbcodeParser.addBBCode('</h2>', '</h2><br />', 'htmltobbcode');
bbcodeParser.addBBCode('</h3>', '</h3><br />', 'htmltobbcode');
bbcodeParser.addBBCode('</h4>', '</h4><br />', 'htmltobbcode');
bbcodeParser.addBBCode('</h5>', '</h5><br />', 'htmltobbcode');
bbcodeParser.addBBCode('</h6>', '</h6><br />', 'htmltobbcode');
bbcodeParser.addBBCode('[b]{TEXT}[/b]', '<strong>{TEXT}</strong>', 'bbcodetohtml');
bbcodeParser.addBBCode('[i]{TEXT}[/i]', '<i>{TEXT}</i>', 'bbcodetohtml');
bbcodeParser.addBBCode('[i]{TEXT}[/i]', '<em>{TEXT}</em>', 'bbcodetohtml');
bbcodeParser.addBBCode('[u]{TEXT}[/u]', '<u>{TEXT}</u>', 'bbcodetohtml');
bbcodeParser.addBBCode('[u]{TEXT}[/u]', '<u>{TEXT}</u>', 'bbcodetohtml');
bbcodeParser.addBBCode('[s]{TEXT}[/s]', '<strike>{TEXT}</strike>', 'bbcodetohtml');
bbcodeParser.addBBCode('[s]{TEXT}[/s]', '<s>{TEXT}</s>', 'bbcodetohtml');
bbcodeParser.addBBCode('[sub]{TEXT}[/sub]', '<sub>{TEXT}</sub>', 'bbcodetohtml');
bbcodeParser.addBBCode('[sup]{TEXT}[/sup]', '<sup>{TEXT}</sup>', 'bbcodetohtml');
bbcodeParser.addBBCode('[align={ALIGN}]{TEXT}[/align]', '<div style="text-align: {ALIGN};">{TEXT}</div>', 'bbcodetohtml');
bbcodeParser.addBBCode('[dir=ltr]{TEXT}[/dir]', '<div dir="ltr" style="direction:ltr;">{TEXT}</div>', 'bbcodetohtml');
bbcodeParser.addBBCode('[dir=rtl]{TEXT}[/dir]', '<div dir="rtl" style="direction:rtl;>{TEXT}</div>', 'bbcodetohtml');
bbcodeParser.addBBCode('[size={FONTSIZE}]{TEXT}[/size]', '<span style="font-size: {FONTSIZE}">{TEXT}</span>', 'bbcodetohtml');
bbcodeParser.addBBCode('[font={TEXT_INTAG}]{TEXT}[/font]', '<span style="font-family: {TEXT_INTAG};">{TEXT}</span>', 'bbcodetohtml');
bbcodeParser.addBBCode('[color={COLOR}]{TEXT}[/color]', '<span style="color: {COLOR};">{TEXT}</span>', 'bbcodetohtml');
bbcodeParser.addBBCode('[hr]', '<hr>', 'bbcodetohtml');
bbcodeParser.addBBCode('[quote]{TEXT}[/quote]', '<blockquote><p>{TEXT}</p></blockquote>', 'bbcodetohtml');
bbcodeParser.addBBCode('[quote=\'{TEXT_INTAG}\']{TEXT}[/quote]', '<blockquote><cite>{TEXT_INTAG}</cite><p>{TEXT}</p></blockquote>', 'bbcodetohtml');
bbcodeParser.addBBCode('[quote=\'{TEXT_INTAG1}\' pid=\'{TEXT_INTAG2}\' dateline=\'{TEXT_INTAG3}\']{TEXT}[/quote]', '<blockquote><cite>\'{TEXT_INTAG1}\' pid=\'{TEXT_INTAG2}\' dateline=\'{TEXT_INTAG3}\'</cite><p>{TEXT}</p></blockquote>', 'bbcodetohtml');
bbcodeParser.addBBCode('[quote={TEXT_INTAG}]{TEXT}[/quote]', '<blockquote><cite>{TEXT_INTAG}</cite><p>{TEXT}</p></blockquote>', 'bbcodetohtml');
bbcodeParser.addBBCode('[code]{TEXT}[/code]', '<pre class="prettyprint codeblock">{TEXT}</pre>', 'bbcodetohtml');
bbcodeParser.addBBCode('[php]{TEXT}[/php]', '<pre class="prettyprint phpblock">{TEXT}</pre>', 'bbcodetohtml');
bbcodeParser.addBBCode('[url]{URL}[/url]', '<a href="{URL}">{URL}</a>', 'bbcodetohtml');
bbcodeParser.addBBCode('[url={URL}]{TEXT}[/url]', '<a href="{URL}">{TEXT}</a>', 'bbcodetohtml');
bbcodeParser.addBBCode('[email]{EMAIL}[/email]', '<a href="mailto:{EMAIL}">{EMAIL}</a>', 'bbcodetohtml');
bbcodeParser.addBBCode('[email={EMAIL}]{TEXT}[/email]', '<a href="mailto:{EMAIL}">{TEXT}</a>', 'bbcodetohtml');
bbcodeParser.addBBCode('[img]{TEXT_INTAG}[/img]', '<img src="{TEXT_INTAG}"/>', 'bbcodetohtml');
bbcodeParser.addBBCode('[img={NUMBER1}x{NUMBER2}]{TEXT_INTAG}[/img]', '<img width="{NUMBER1}" height="{NUMBER2}" src="{TEXT_INTAG}" />');
bbcodeParser.addBBCode('[img={NUMBER1}x{NUMBER2}]{TEXT_INTAG}[/img]', '<img width="{NUMBER1}" height="{NUMBER2}" src="{TEXT_INTAG}">');
bbcodeParser.addBBCode('', '<removess>{TEXT}</removess>','htmltobbcode');


/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

// Compressed version of core/ckeditor_base.js. See original for instructions.
/*jsl:ignore*/
window.CKEDITOR||(window.CKEDITOR=function(){var b={timestamp:"",version:"%VERSION%",revision:"%REV%",rnd:Math.floor(900*Math.random())+100,_:{pending:[]},status:"unloaded",basePath:function(){var a=window.CKEDITOR_BASEPATH||"";if(!a)for(var b=document.getElementsByTagName("script"),c=0;c<b.length;c++){var d=b[c].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);if(d){a=d[1];break}}-1==a.indexOf(":/")&&"//"!=a.slice(0,2)&&(a=0===a.indexOf("/")?location.href.match(/^.*?:\/\/[^\/]*/)[0]+a:location.href.match(/^[^\?]*\/(?:)/)[0]+a);if(!a)throw'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';return a}(),getUrl:function(a){-1==a.indexOf(":/")&&0!==a.indexOf("/")&&(a=this.basePath+a);this.timestamp&&"/"!=a.charAt(a.length-1)&&!/[&?]t=/.test(a)&&(a+=(0<=a.indexOf("?")?"&":"?")+"t="+this.timestamp);return a},domReady:function(){function a(){try{document.addEventListener?(document.removeEventListener("DOMContentLoaded",a,!1),b()):document.attachEvent&&"complete"===document.readyState&&(document.detachEvent("onreadystatechange",a),b())}catch(d){}}function b(){for(var a;a=c.shift();)a()}var c=[];return function(b){c.push(b);"complete"===document.readyState&&setTimeout(a,1);if(1==c.length)if(document.addEventListener)document.addEventListener("DOMContentLoaded",a,!1),window.addEventListener("load",a,!1);else if(document.attachEvent){document.attachEvent("onreadystatechange",a);window.attachEvent("onload",a);b=!1;try{b=!window.frameElement}catch(e){}if(document.documentElement.doScroll&&b){var f=function(){try{document.documentElement.doScroll("left")}catch(b){setTimeout(f,1);return}a()};f()}}}}()},e=window.CKEDITOR_GETURL;if(e){var g=b.getUrl;b.getUrl=function(a){return e.call(b,a)||g.call(b,a)}}return b}());
/*jsl:end*/

if ( CKEDITOR.loader )
	CKEDITOR.loader.load( 'ckeditor' );
else {
	// Set the script name to be loaded by the loader.
	CKEDITOR._autoLoad = 'ckeditor';

	// Include the loader script.
	if ( document.body && ( !document.readyState || document.readyState == 'complete' ) ) {
		var script = document.createElement( 'script' );
		script.type = 'text/javascript';
		script.src = CKEDITOR.getUrl( 'core/loader.js' );
		document.body.appendChild( script );
	} else
		document.write( '<script type="text/javascript" src="' + CKEDITOR.getUrl( 'core/loader.js' ) + '"></script>' );

}

/**
 * The skin to load for all created instances, it may be the name of the skin
 * folder inside the editor installation path, or the name and the path separated
 * by a comma.
 *
 * **Note:** This is a global configuration that applies to all instances.
 *
 *		CKEDITOR.skinName = 'moono';
 *
 *		CKEDITOR.skinName = 'myskin,/customstuff/myskin/';
 *
 * @cfg {String} [skinName='moono']
 * @member CKEDITOR
 */
CKEDITOR.skinName = 'moonocolor';
