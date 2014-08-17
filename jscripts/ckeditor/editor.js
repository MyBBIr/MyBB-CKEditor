var autosave = function($btn, e, message)
{
	if(typeof(Storage) == "undefined") return;
	jQuery.getScript(CKEDITOR.getUrl('extra/moment-with-langs.js'), function()
	{
		moment.lang(e.editor.config.language);
		date = new Date();
		var timenow = date.valueOf();

		jQuery('body').append('<div class="autosaveblock" id="autosaveblock_' + e.editor.id + '"></div>');
		$elm = jQuery('#autosaveblock_' + e.editor.id);

		if(!message)
		{
			$elm.html('<h3>'+ lang.ckeditor_autosaves +'</h3><div class="autosavecontent" style="height:250px"></div>');
			var i = 0;
			if(e.editor.config.clearautosave == 1)
			{
				$elm.find('.autosavecontent').prepend(lang.ckeditor_autosave_disabled);
			}
			else
			{
				if(localStorage.getItem('autosave'))
				{
					myautosave = JSON.parse(localStorage.getItem('autosave'));
					jQuery.each( myautosave, function( key, value ) {
						value = decodeURIComponent(value);
						key = key.replace('a_', '');
						if(key < timenow - 3 * 24 * 60 * 60 * 1000 || value.length < 5)
						{
							delete myautosave['a_' + key];
							localStorage.setItem('autosave', JSON.stringify(myautosave));
							return;
						}
						++i;
						row_time = moment.unix(key / 1000).fromNow();
						message = value.substr(0, 50);
						if(value.length > 50)
						{
							message += '...';
						}
						message = message.replace(/>/g, '&gt;');
						message = message.replace(/</g, '&lt;');
						$row = jQuery('<div class="autosaverow" data-timenow="'+key+'" />');
						$row.click(function(ev){
							//timenow = jQuery(this).data('timenow');
							if(jQuery(ev.target).closest('.autosaverow_remove').length == 0) {
								e.editor.setData(value);
							}
							delete myautosave['a_' + key];
							localStorage.setItem('autosave', JSON.stringify(myautosave));

							jQuery(this).slideUp();
						});
						$row.append('<a class="autosaverow_remove" href="javascript:;">x</a>');
						$row.append('<span class="autosaverow_time">' + row_time + '</span>');
						$row.append('<div class="autosaverow_content">' + message + '</span>');
						$elm.find('.autosavecontent').prepend($row);
					});
				}
				if(i == 0)
				{
					$elm.find('.autosavecontent').prepend(lang.ckeditor_no_autosave);
				}
			}
		}
		else
		{
			$elm.html(message);
		}

		var offset = $btn.offset();
		offset.top -= $elm.outerHeight() + 20;

		$elm.css({
			position: 'absolute',
			top: offset.top,
			left: offset.left - 7
		});

		jQuery('body, html, textarea, input, iframe').bind('click', function(elv) {
			if(jQuery(elv.target).closest($elm).length == 0 && jQuery(elv.target).closest($btn).length == 0) {
				$elm.remove();
			}
		});
		e.editor.on('focus', function(ev) {
			$elm.remove();
		});
		jQuery('body, html, textarea, input, iframe').bind('focus', function(elv) {
			if(jQuery(elv.target).closest($elm).length == 0 && jQuery(elv.target).closest($btn).length == 0) {
				$elm.remove();
			}
		});
	});
}

var messageEditor = Class.create();

messageEditor.prototype = {
	editorid: '',
	editor: '',
	baseURL: '',
	textarea: '',
	initialize: function(textarea)
	{
		this.editorid = textarea;
		if (typeof CKEDITOR == 'undefined') {
			document.write(unescape("%3Cscript src=\'"+this.baseURL+"ckeditor/ckeditor.js\' type=\'text/javascript\'%3E%3C/script%3E"));
		}
		eval('this.editor = CKEDITOR.instances.'+this.editorid+';');
		this.updateoldtextarea(this.editor);
		if(CKEDITOR.config.autosave > 0)
		{
			this.editor.on('instanceReady', this.autosave);
		}
		this.editor.on('instanceReady', this.stylesheet);
	},
	
	stylesheet: function(){
		var stylesheet = document.createElement('link');
		stylesheet.setAttribute('rel', 'stylesheet');
		stylesheet.setAttribute('type', 'text/css');
		stylesheet.setAttribute('href', CKEDITOR.getUrl('stylesheet.css'));
		document.getElementsByTagName('head')[0].appendChild(stylesheet);
	},

	loadtextarea: function() {
		if(!$('cke_' + this.editorid)) return;
		if(!$('cke_' + this.editorid).getElementsByTagName('textarea')) return;
		this.textarea = $('cke_' + this.editorid).getElementsByTagName('textarea')[0];
	},
	
	bindSmilieInserter: function(id)
	{
		if(!$(id))
		{
			return false;
		}

		var smilies = $(id).select('.smilie');

		if(smilies.length > 0)
		{
			smilies.each(function(smilie)
			{
				smilie.onclick = this.insertSmilie.bindAsEventListener(this);
				smilie.style.cursor = "pointer";
			}.bind(this));
		}
	},
	
/* این از فایل اصلی ویرایشگر ساده برای حالت منبع اضافه شده است... */
	performInsert: function(open_tag, close_tag, is_single, ignore_selection)
	{
		this.loadtextarea();
		var is_closed = true;

		if(!ignore_selection)
		{
			var ignore_selection = false;
		}

		if(!close_tag)
		{
			var close_tag = "";
		}
		var textarea = this.textarea;
		textarea.focus();

		if(document.selection)
		{
			var selection = document.selection;
			var range = selection.createRange();

			if(ignore_selection != false)
			{
				selection.collapse;
			}

			if((selection.type == "Text" || selection.type == "None") && range != null && ignore_selection != true)
			{
				if(close_tag != "" && range.text.length > 0)
				{
					var keep_selected = true;
					range.text = open_tag+range.text+close_tag;
				}
				else
				{
					var keep_selected = false;

					if(is_single)
					{
						is_closed = false;
					}
					range.text = open_tag+close_tag;
				}
				range.select();
			}
			else
			{
				textarea.value += open_tag+close_tag;
			}
		}
		else if(typeof(textarea.selectionEnd) != 'undefined')
		{
			var select_start = textarea.selectionStart;
			var select_end = textarea.selectionEnd;
			var scroll_top = textarea.scrollTop;

			var start = textarea.value.substring(0, select_start);
			var middle = textarea.value.substring(select_start, select_end);
			var end = textarea.value.substring(select_end, textarea.textLength);

			if(select_end - select_start > 0 && ignore_selection != true && close_tag != "")
			{
				var keep_selected = true;
				middle = open_tag+middle+close_tag;
			}
			else
			{
				var keep_selected = false;
				if(is_single)
				{
					is_closed = false;
				}
				middle = open_tag+close_tag;
			}

			textarea.value = start+middle+end;

			if(keep_selected == true && ignore_selection != true)
			{
				textarea.selectionStart = select_start;
				textarea.selectionEnd = select_start + middle.length;
			}
			else if(ignore_selection != true)
			{
				textarea.selectionStart = select_start + middle.length;
				textarea.selectionEnd = textarea.selectionStart;
			}
			textarea.scrollTop = scroll_top;
		}
		else
		{
			textarea.value += open_tag+close_tag;

			if(is_single)
			{
				is_closed = false;
			}
		}
		//this.updateOldArea();
		textarea.focus();
		//this.trackingCaret = true;
		//this.storeCaret();
		//this.trackingCaret = false;
		return is_closed;
	},

	Insert: function(text, html) {
		if(!html) {
			html = text;
		}
		if(this.editor.mode == 'wysiwyg') {
			this.editor.insertHtml(html);
		} else {
			this.performInsert(text);
		}
	},
	
	execCommand: function(e,o) {
		if(!o) o = false;
		if(o || this.editor.mode == 'wysiwyg') {
			return this.editor.execCommand(e);
		}
	},
	
	openGetMoreSmilies: function(editor)
	{
		this.execCommand('smiley', true);
	},
	
	insertSmilie: function(e)
	{
		element = Event.element(e);

		if(!element || !element.alt)
		{
			return false;
		}
		this.Insert(element.alt, '<img src="'+element.src+'" data-cke-saved-src="'+element.src+'" title="'+smilieyurlmap[element.src]+'" alt="'+smilieyurlmap[element.src]+'">');
	},

	insertAttachment: function(aid)
	{
		this.Insert("[attachment="+aid+"]");
	},
	
	updateoldtextarea: function(editor) {
		var updatePreview = function() {
			var consoleEl = CKEDITOR.document.getById( editor.name );
			consoleEl.addClass( 'updated' );
			setTimeout( function() { consoleEl.removeClass( 'updated' ); }, 500 );
			// IE needs <br>, it doesn't even understand new lines.
			consoleEl.setHtml( editor.getData());
		}

		var checkUpdatePreview= function() {
			setTimeout( function() {
				if ( editor.checkDirty() ) {
					updatePreview();
					editor.resetDirty();
				}
			}, 0 );
		}

		editor.on( 'instanceReady', updatePreview );
		editor.on( 'key', checkUpdatePreview );
		editor.on( 'selectionChange', checkUpdatePreview );

	},
	
	autosave: function(e)
	{
		if(typeof(Storage) == "undefined") return;
		$footer = jQuery('#' + e.editor.id + '_bottom');
		$footer.append('<a href="javascript:;" id="'+e.editor.id+'_autosave" title="Auto Save" class="autosave"><img src="images/ckeditor/autosave.png" alt="AutoSave" title="Auto Save" /></a>');
		$autosave = jQuery('#' + e.editor.id+'_autosave');
		$autosave.click(function(){
			autosave($autosave, e);
		});
		setInterval(function(){
			if(e.editor.config.clearautosave == 0)
			{
				myautosave = JSON.parse(localStorage.getItem('autosave'));
				message = e.editor.getData(1);
				date = new Date();
				var timenow = date.valueOf();
				ok = false;

				if(message.length < 10 || message == e.editor.config.placeholder)
					return;
				
				message = encodeURIComponent(message);

				if(myautosave)
				{
					jQuery.each( myautosave, function( key, value ) {
						if(value == message) ok = true;
					});
				}
				else
				{
					myautosave = {};
				}
				if(ok)
					return;

				
				myautosave['a_' + timenow] = message;
				
				localStorage.setItem('autosave', JSON.stringify(myautosave));
			}
		}, CKEDITOR.config.autosave*1000);
	}
};

if(typeof Thread != 'undefined')
{
	Thread.multiQuotedLoaded = function(request)
	{
		if(request.responseText.match(/<error>(.*)<\/error>/))
		{
			message = request.responseText.match(/<error>(.*)<\/error>/);
			if(!message[1])
			{
				message[1] = "یک خطای ناشناخته رخ داده‌است.";
			}
			if(this.spinner)
			{
				this.spinner.destroy();
				this.spinner = '';
			}
			alert('یک خطا در ارسال پست رخ داده است.\n\n'+message[1]);
		}
		else if(request.responseText)
		{
			var id = '';
			if(typeof clickableEditor != 'undefined')
			{
				id = clickableEditor.editor;
			}
			value = id.getData();
			if(value)
			{
				value += "\n";
			}
			value += request.responseText;
			id.setData(value);
		}
		Thread.clearMultiQuoted();
		$('quickreply_multiquote').hide();
		$('quoted_ids').value = 'all';
		if(this.spinner)
		{
			this.spinner.destroy();
			this.spinner = '';
		}
		id.focus();
	};
	
	Thread.quickReplyDone = function(request)
	{
		if($('captcha_trow'))
		{
			captcha = request.responseText.match(/^<captcha>([0-9a-zA-Z]+)(\|([0-9a-zA-Z]+)|)<\/captcha>/);
			if(captcha)
			{
				request.responseText = request.responseText.replace(/^<captcha>(.*)<\/captcha>/, '');

				if(captcha[1] == "reload")
				{
					Recaptcha.reload();
				}
				else if($("captcha_img"))
				{
					if(captcha[1])
					{
						imghash = captcha[1];
						$('imagehash').value = imghash;
						if(captcha[3])
						{
							$('imagestring').type = "hidden";
							$('imagestring').value = captcha[3];
							// hide the captcha
							$('captcha_trow').style.display = "none";
						}
						else
						{
							$('captcha_img').src = "captcha.php?action=regimage&imagehash="+imghash;
							$('imagestring').type = "text";
							$('imagestring').value = "";
							$('captcha_trow').style.display = "";
						}
					}
				}
			}
		}
		if(request.responseText.match(/<error>([^<]*)<\/error>/))
		{
			message = request.responseText.match(/<error>([^<]*)<\/error>/);

			if(!message[1])
			{
				message[1] = "یک خطای ناشناخته رخ داده‌است.";
			}

			if(this.spinner)
			{
				this.spinner.destroy();
				this.spinner = '';
			}
			alert('خطایی در ارسال پاسخ وجود دارد:\n\n'+message[1]);
		}
		else if(request.responseText.match(/id="post_([0-9]+)"/))
		{
			var pid = request.responseText.match(/id="post_([0-9]+)"/)[1];
			var post = document.createElement("div");
			post.innerHTML = request.responseText;
			$('posts').appendChild(post);
			request.responseText.evalScripts();
			Form.reset('quick_reply_form');
			clickableEditor.editor.setData('');
			if($('lastpid'))
			{
				$('lastpid').value = pid;
			}
		}
		else
		{
			request.responseText.evalScripts();
		}

		if(this.spinner)
		{
			this.spinner.destroy();
			this.spinner = '';
		}
		this.quick_replying = 0;
	};
	
	Thread.quickEditLoaded = function(request, pid)
	{
		if(request.responseText.match(/<error>(.*)<\/error>/))
		{
			message = request.responseText.match(/<error>(.*)<\/error>/);
			if(!message[1])
			{
				message[1] = "An unknown error occurred.";
			}
			if(this.spinner)
			{
				this.spinner.destroy();
				this.spinner = '';
			}
			alert('There was an error performing the update.\n\n'+message[1]);
			Thread.qeCache[pid] = "";
		}
		else if(request.responseText)
		{
			$("pid_"+pid).innerHTML = request.responseText;
			element = $("quickedit_"+pid);
			if(typeof opt_editor == 'object')
			{
				CKEDITOR.replace("quickedit_"+pid, opt_editor);
			}
			element.focus();
			offsetTop = -60;
			do
			{
				offsetTop += element.offsetTop || 0;
				element = element.offsetParent;
			}
			while(element);

			scrollTo(0, offsetTop);
		}
		if(this.spinner)
		{
			this.spinner.destroy();
			this.spinner = '';
		}
	};
}