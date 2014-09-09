{$jsfiles}
<script type="text/javascript">
<!--
	lang.ckeditor_autosaves = '{$lang->ckeditor_autosaves}';
	lang.ckeditor_autosave_disabled = '{$lang->ckeditor_autosave_disabled}';
	lang.ckeditor_no_autosave = '{$lang->ckeditor_no_autosave}';
	{$smiliesmap}
	CKEDITOR.config.direction = '{$direction}';
	CKEDITOR.config.autosave = '{$mybb->settings['ckeditor_autosave']}';
	var opt_editor = {
		direction: '{$direction}',
		language: '{$lang->settings['htmllang']}',
		fontSize_sizes: '{$lang->editor_size_xx_small}/xx-small;{$lang->editor_size_x_small}/x-small;{$lang->editor_size_small}/small;{$lang->editor_size_medium}/medium;{$lang->editor_size_large}/large;{$lang->editor_size_x_large}/x-large;{$lang->editor_size_xx_large}/xx-large',
		fontSize_defaultLabel: '{$lang->editor_size_x_small}',
		placeholder: '{$lang->ckeditor_placeholder}',
		startupMode: '{$mybb->settings['ckeditor_editormode']}',
		uiColor: '{$mybb->settings['ckeditor_color']}',
		skin: '{$mybb->settings['ckeditor_theme']}',
		extraPlugins: '{$divarea}',
		{$smilies}
	};
	CKEDITOR.ajaxbbcodeparser = '{$mybb->settings['ckeditor_ajaxbbcodeparser']}';
	CKEDITOR.replace("{$bind}", opt_editor);
	var clickableEditor = new messageEditor
	clickableEditor.setup("{$bind}");
	CKEDITOR.performInsert = function(a,b,c,d) {
		return clickableEditor.performInsert(a,b,c,d);
	}
	if(clickableEditor)
	{
		clickableEditor.bindSmilieInserter("clickable_smilies");
	}
	
	MyBBEditor = {
		insertText: function(a)
		{
			clickableEditor.Insert(a, bbcodeParser.bbcodeToHtml(a));
		}
	}
// -->
</script>