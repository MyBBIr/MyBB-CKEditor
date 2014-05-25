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
}