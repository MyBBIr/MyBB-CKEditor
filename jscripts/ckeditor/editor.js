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
	
	execCommand: function(e) {
		if(this.editor.mode == 'wysiwyg') {
			return this.editor.execCommand(e);
		}
	},
	
	openGetMoreSmilies: function(editor)
	{
		this.execCommand('smiley');
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
	}
};