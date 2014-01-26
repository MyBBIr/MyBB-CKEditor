var messageEditor = Class.create();

messageEditor.prototype = {
	editorid: '',
	editor: '',
	baseURL: '',
	
	initialize: function(textarea)
	{
		this.editorid = textarea;
		if (typeof CKEDITOR == 'undefined') {
			document.write(unescape("%3Cscript src=\'"+this.baseURL+"ckeditor/ckeditor.js\' type=\'text/javascript\'%3E%3C/script%3E"));
		}
		eval('this.editor = CKEDITOR.instances.'+this.editorid+';');
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

	openGetMoreSmilies: function(editor)
	{
		MyBB.popupWindow('misc.php?action=smilies&popup=true&editor='+editor, 'sminsert', 240, 280);
	},
	
	Insert: function(text, html) {
		if(!html) {
			html = text;
		}
		if(this.editor.mode == 'wysiwyg') {
			this.editor.insertHtml(html);
		} else {
		alert(this.editorid);
			this.editor.insertText(text);
		}
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