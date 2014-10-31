var autosave = function($btn, e, message)
{
	if(typeof(Storage) == "undefined") return;
	$.getScript(CKEDITOR.getUrl('extra/moment-with-langs.js'), function()
	{
		moment.lang(e.editor.config.language);
		date = new Date();
		var timenow = date.valueOf();

		$('body').append('<div class="autosaveblock" id="autosaveblock_' + e.editor.id + '"></div>');
		$elm = $('#autosaveblock_' + e.editor.id);

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
					$.each( myautosave, function( key, value ) {
						if(i > 20)
						{
							delete myautosave['a_' + key];
							return;
						}
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
						$row = $('<div class="autosaverow" data-timenow="'+key+'" />');
						$row.click(function(ev){
							//timenow = $(this).data('timenow');
							if($(ev.target).closest('.autosaverow_remove').length == 0) {
								e.editor.setData(value);
							}
							delete myautosave['a_' + key];
							localStorage.setItem('autosave', JSON.stringify(myautosave));

							$(this).slideUp();
						});
						$row.append('<a class="autosaverow_remove" href="javascript:;">x</a>');
						$row.append('<span class="autosaverow_time">' + row_time + '</span>');
						$row.append('<div class="autosaverow_content">' + message + '</span>');
						$row.find('.autosaverow_content').attr('title', value);
						$elm.find('.autosavecontent').prepend($row);
					});
				}
				if(i == 0)
				{
					$elm.find('.autosavecontent').prepend(lang.ckeditor_no_autosave);
				}
				else
				{
					$remove = $('<button />').html(lang.ckeditor_remove_all_autosaves).css({'text-align': 'center','margin':'0 auto','display':'block'}).click(function()
					{
						localStorage.setItem('autosave', '{}');
						$elm.remove();
					});
					$elm.append($remove);
					localStorage.setItem('autosave', JSON.stringify(myautosave));
				}
			}
		}
		else
		{
			$elm.html(message);
		}

		var offset = $btn.offset();
		offset.top -= $elm.outerHeight() + 20;
		if(e.editor.config.direction == 'ltr')
			offset.left -= $elm.outerWidth() - 30;

		$elm.css({
			position: 'absolute',
			top: offset.top,
			left: offset.left - 7
		});

		$('body, html, textarea, input, iframe').bind('click', function(elv) {
			if($(elv.target).closest($elm).length == 0 && $(elv.target).closest($btn).length == 0) {
				$elm.remove();
			}
		});
		e.editor.on('focus', function(ev) {
			$elm.remove();
		});
		$('body, html, textarea, input, iframe').bind('focus', function(elv) {
			if($(elv.target).closest($elm).length == 0 && $(elv.target).closest($btn).length == 0) {
				$elm.remove();
			}
		});
	});
}

var messageEditor = (function()
{
	function messageEditor()
	{}
	
	function setup(textarea)
	{
		this.editorid = textarea;
		if (typeof CKEDITOR == 'undefined') {
			document.write(unescape("%3Cscript src=\'"+this.baseURL+"ckeditor/ckeditor.js\' type=\'text/javascript\'%3E%3C/script%3E"));
		}
		eval('this.editor = CKEDITOR.instances.'+this.editorid+';');
		
		// Update Old Textarea:
		var updatePreview = function(e) {
			var consoleEl = CKEDITOR.document.getById( e.editor.name );
			consoleEl.addClass( 'updated' );
			setTimeout( function() { consoleEl.removeClass( 'updated' ); }, 500 );
			// IE needs <br>, it doesn't even understand new lines.
			consoleEl.setHtml( e.editor.getData(1));
		}

		var checkUpdatePreview = function(e) {
			setTimeout( function() {
				if ( e.editor.checkDirty() ) {
					updatePreview(e);
					e.editor.resetDirty();
				}
			}, 0 );
		}

		this.editor.on( 'instanceReady', updatePreview );
		this.editor.on( 'key', checkUpdatePreview );
		this.editor.on( 'selectionChange', checkUpdatePreview );

		if(CKEDITOR.config.autosave > 0)
		{
			this.editor.on('instanceReady', this.editor_autosave);
			CKEDITOR.autosave_done = this.autosave_done;
		}
		this.editor.on('instanceReady', this.stylesheet);
	};

	function stylesheet(e)
	{
		var stylesheet = document.createElement('link');
		stylesheet.setAttribute('rel', 'stylesheet');
		stylesheet.setAttribute('type', 'text/css');
		stylesheet.setAttribute('href', CKEDITOR.getUrl('stylesheet.'+e.editor.config.direction+'.css'));
		document.getElementsByTagName('head')[0].appendChild(stylesheet);
	}

	function bindSmilieInserter(id)
	{
		if(!$('#' + id))
		{
			return false;
		}
		var that = this;

		var smilies = $('#' + id).find('.smilie');

		if(smilies.length > 0)
		{
			smilies.each(function()
			{
				$(this).click(function()
				{
					$.proxy(that, 'insertSmilie', this);
				});
				$(this).css('cursor', "pointer");
			});
		}
	};
	
/* این از فایل اصلی ویرایشگر ساده برای حالت منبع اضافه شده است... */

	function performInsert(open_tag, close_tag, is_single, ignore_selection)
	{
		this.textarea = $('#cke_' + this.editorid).find('textarea').first();
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
		else if(typeof(textarea[0].selectionEnd) != 'undefined')
		{
			var select_start = textarea[0].selectionStart;
			var select_end = textarea[0].selectionEnd;
			var scroll_top = textarea[0].scrollTop;

			var start = textarea.val().substring(0, select_start);
			var middle = textarea.val().substring(select_start, select_end);
			var end = textarea.val().substring(select_end, textarea.textLength);

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

			textarea.val(start+middle+end);

			if(keep_selected == true && ignore_selection != true)
			{
				textarea[0].selectionStart = select_start;
				textarea[0].selectionEnd = select_start + middle.length;
			}
			else if(ignore_selection != true)
			{
				textarea[0].selectionStart = select_start + middle.length;
				textarea[0].selectionEnd = textarea[0].selectionStart;
			}
			textarea[0].scrollTop = scroll_top;
		}
		else
		{
			textarea.val(open_tag+close_tag);

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
	};

	function Insert(text, html) {
		if(!html) {
			html = text;
		}
		if(this.editor.mode == 'wysiwyg') {
			this.editor.insertHtml(html);
		} else {
			$.proxy(this, 'performInsert', text);
		}
	};
	
	function execCommand(e,o) {
		if(!o) o = false;
		if(o || this.editor.mode == 'wysiwyg') {
			return this.editor.execCommand(e);
		}
	};
	
	function openGetMoreSmilies(editor)
	{
		this.execCommand('smiley', true);
	};
	
	function insertSmilie(e)
	{
		element = e;

		if(!element || !element.attr('alt'))
		{
			return false;
		}
		$.proxy(this, 'Insert', element.attr('alt'), '<img src="'+element.attr('src')+'" data-cke-saved-src="'+element.attr('src')+'" title="'+smilieyurlmap[element.attr('src')]+'" alt="'+smilieyurlmap[element.attr('src')]+'">');
	};

	function insertAttachment(aid)
	{
		$.proxy(this, 'Insert', "[attachment="+aid+"]");
	};
	
	function editor_autosave(e)
	{
		if(typeof(Storage) == "undefined") return;
		$footer = $('#' + e.editor.id + '_bottom');
		$footer.append('<a href="javascript:;" id="'+e.editor.id+'_autosave" title="Auto Save" class="autosave"><img src="images/ckeditor/autosave.png" alt="AutoSave" title="Auto Save" /></a><span id="autosave_saved">'+lang.ckeditor_saved+'</span>');
		$autosave = $('#' + e.editor.id+'_autosave');
		$autosave.click(function(){
			autosave($autosave, e);
		});
		setInterval(function(){
			if(e.editor.config.clearautosave == 0)
			{
				CKEDITOR.autosave_done(e.editor);
			}
		}, CKEDITOR.config.autosave*1000);
	};
	
	function autosave_done(editor)
	{
		myautosave = JSON.parse(localStorage.getItem('autosave'));
		message = editor.getData();
		date = new Date();
		var timenow = date.valueOf();
		ok = false;

		if(message.length < 10 || message == editor.config.placeholder)
			return;
		
		message = encodeURIComponent(message);

		if(myautosave)
		{
			$.each( myautosave, function( key, value ) {
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
		$('#autosave_saved').fadeIn('normal').delay(2000).fadeOut('normal');
	};

	messageEditor.prototype = {
		setup: setup,
		editorid: null,
		editor: null,
		baseURL: null,
		textarea: null,
		stylesheet: stylesheet,
		bindSmilieInserter: bindSmilieInserter,
		performInsert: performInsert,
		Insert: Insert,
		execCommand: execCommand,
		openGetMoreSmilies: openGetMoreSmilies,
		insertSmilie: insertSmilie,
		editor_autosave: editor_autosave,
		autosave_done: autosave_done
	};
	
	return messageEditor;
})();
$(document).ready(function(){
	if(typeof Thread != 'undefined')
	{
		Thread.multiQuotedLoaded = function(request)
		{
			var json = $.parseJSON(request.responseText);
			if(typeof json == 'object')
			{
				if(json.hasOwnProperty("errors"))
				{
					$.each(json.errors, function(i, message)
					{
						$.jGrowl(lang.post_fetch_error + ' ' + message);
					});
					return false;
				}
			}

			if(typeof clickableEditor != 'undefined')
			{
				var id = clickableEditor.editor;
				value = id.getData();
				if(value)
				{
					value += "\n";
				}
				value += json.message;
				id.setData(value);
				id.focus();
			}
			else if(typeof $('textarea').sceditor != 'undefined')
			{
				$('textarea').sceditor('instance').insert(json.message);
			}
			else
			{
				var id = $('#message');
				if(id.value)
				{
					id.value += "\n";
				}
				id.val(id.val() + json.message);
			}

			Thread.clearMultiQuoted();
			$('#quickreply_multiquote').hide();
			$('#quoted_ids').val('all');

			$('#message').focus();
		};
		
		Thread.quickReplyDone = function(request, status)
		{
			this.quick_replying = 0;

			var json = $.parseJSON(request.responseText);
			if(typeof json == 'object')
			{
				if(json.hasOwnProperty("errors"))
				{
					$(".jGrowl").jGrowl("close");

					$.each(json.errors, function(i, message)
					{
						$.jGrowl(lang.quick_reply_post_error + ' ' + message);
					});
				}
			}

			if($('#captcha_trow'))
			{
				cap = json.data.match(/^<captcha>([0-9a-zA-Z]+)(\|([0-9a-zA-Z]+)|)<\/captcha>/);
				if(cap)
				{
					json.data = json.data.replace(/^<captcha>(.*)<\/captcha>/, '');

					if(cap[1] == "reload")
					{
						Recaptcha.reload();
					}
					else if($("#captcha_img"))
					{
						if(cap[1])
						{
							imghash = cap[1];
							$('#imagehash').val(imghash);
							if(cap[3])
							{
								$('#imagestring').attr('type', 'hidden').val(cap[3]);
								// hide the captcha
								$('#captcha_trow').css('display', 'none');
							}
							else
							{
								$('#captcha_img').attr('src', "captcha.php?action=regimage&imagehash="+imghash);
								$('#imagestring').attr('type', 'text').val('');
								$('#captcha_trow').css('display', '');
							}
						}
					}
				}
			}
			
			if(json.hasOwnProperty("errors"))
				return false;

			if(json.data.match(/id="post_([0-9]+)"/))
			{
				var pid = json.data.match(/id="post_([0-9]+)"/)[1];
				var post = document.createElement("div");

				$('#posts').append(json.data);
				
				if (typeof inlineModeration != "undefined") // Guests don't have this object defined
					$("#inlinemod_" + pid).on('change', inlineModeration.checkItem);
					
				Thread.quickEdit("#pid_" + pid);

				/*if(MyBB.browser == "ie" || MyBB.browser == "opera" || MyBB.browser == "safari" || MyBB.browser == "chrome")
				{*/
					// Eval javascript
					$(json.data).filter("script").each(function(e) {
						eval($(this).text());
					});
				//}

				$('#quick_reply_form')[0].reset();
				if(typeof clickableEditor != 'undefined')
				{
					clickableEditor.editor.setData('');
				}

				var lastpid = $('#lastpid');
				if(lastpid)
				{
					lastpid.val(pid);
				}
			}
			else
			{
				// Eval javascript
				$(json.data).filter("script").each(function(e) {
					eval($(this).text());
				});
			}

			$(".jGrowl").jGrowl("close");
		};
		
		Thread.quickEdit = function(el)
		{
			if(!el) el = '.post_body';

			$(el).each(function()
			{
				// Take pid out of the id attribute
				id = $(this).attr('id');
				pid = id.replace( /[^\d.]/g, '');

				$('#pid_' + pid).editable("xmlhttp.php?action=edit_post&do=update_post&pid=" + pid + '&my_post_key=' + my_post_key,
				{
					indicator: spinner,
					loadurl: "xmlhttp.php?action=edit_post&do=get_post&pid=" + pid,
					type: "textarea",
					rows: 12,
					submit: lang.save_changes,
					cancel: lang.cancel_edit,
					event: "edit" + pid, // Triggered by the event "edit_[pid]",
					onblur: "ignore",
					dataType: "json",
					submitdata: function (values, settings)
					{
						id = $(this).attr('id');
						pid = id.replace( /[^\d.]/g, '');
						if(typeof CKEDITOR != 'undefined')
						{
							values = CKEDITOR.instances['quickedit_' + pid].getData();
						}
						return {
							editreason: $("#quickedit_" + pid + "_editreason").val(),
							value: values
						}
					},
					callback: function(values, settings)
					{
						id = $(this).attr('id');
						pid = id.replace( /[^\d.]/g, '');
						
						var json = $.parseJSON(values);
						if(typeof json == 'object')
						{
							if(json.hasOwnProperty("errors"))
							{
								$(".jGrowl").jGrowl("close");

								$.each(json.errors, function(i, message)
								{
									$.jGrowl(lang.quick_edit_update_error + ' ' + message);
								});
								$(this).html($('#pid_' + pid + '_temp').html());
							}
							else if(json.hasOwnProperty("moderation_post"))
							{
								$(".jGrowl").jGrowl("close");

								$(this).html(json.message);

								// No more posts on this page? (testing for "1" as the last post would be removed here)
								if($('.post').length == 1)
								{
									alert(json.moderation_post);
									window.location = json.url;
								}
								else
								{
									$.jGrowl(json.moderation_post);
									$('#post_' + pid).slideToggle();
								}
							}
							else if(json.hasOwnProperty("moderation_thread"))
							{
								$(".jGrowl").jGrowl("close");

								$(this).html(json.message);
								
								alert(json.moderation_thread);
								
								// Redirect user to forum
								window.location = json.url;
							}	
							else
							{
								// Change html content
								$(this).html(json.message);
								$('#edited_by_' + pid).html(json.editedmsg);
							}
						}
						else
						{
							// Change html content
							$(this).html(json.message);
							$('#edited_by_' + pid).html(json.editedmsg);
						}
						$('#pid_' + pid + '_temp').remove();
					}
				});
			});

			$('.quick_edit_button').each(function()
			{
				$(this).bind("click", function(e)
				{
					e.preventDefault();

					// Take pid out of the id attribute
					id = $(this).attr('id');
					pid = id.replace( /[^\d.]/g, '');

					// Create a copy of the post
					if($('#pid_' + pid + '_temp').length == 0)
					{
						$('#pid_' + pid).clone().attr('id','pid_' + pid + '_temp').css('display','none').appendTo("body");
					}

					// Trigger the edit event
					$('#pid_' + pid).trigger("edit" + pid);

					// Edit Reason
					$('#pid_' + pid + ' textarea').attr('id', 'quickedit_' + pid);
					if(allowEditReason == 1 && $('#quickedit_' + pid + '_editreason').length == 0)
					{
						$('#quickedit_' + pid).after('<label for="editreason">' + lang.editreason + ':</label> <input type="text" class="textbox" style="margin: 6px 0;" name="editreason" size="40" maxlength="150" id="quickedit_' + pid + '_editreason" /><br />');
					}
					if(typeof opt_editor == 'object')
					{
						var qucikeditor = CKEDITOR.replace('quickedit_' + pid, opt_editor);
						qucikeditor.updatePreview = function(e) {
							var consoleEl = CKEDITOR.document.getById( e.editor.name );
							consoleEl.addClass( 'updated' );
							setTimeout( function() { consoleEl.removeClass( 'updated' ); }, 500 );
							// IE needs <br>, it doesn't even understand new lines.
							consoleEl.setHtml( e.editor.getData());
						};

						qucikeditor.checkUpdatePreview = function(e) {
							setTimeout( function() {
								if ( e.editor.checkDirty() ) {
									qucikeditor.updatePreview(e);
									e.editor.resetDirty();
								}
							}, 0 );
						};

						qucikeditor.on( 'instanceReady', qucikeditor.updatePreview );
						qucikeditor.on( 'key', qucikeditor.checkUpdatePreview );
						qucikeditor.on( 'selectionChange', qucikeditor.checkUpdatePreview );
					}
				});
			});

			return false;
		};
	}
});