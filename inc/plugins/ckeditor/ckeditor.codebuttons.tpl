{$jsfiles}
<script type="text/javascript">
<!--
	{$smiliesmap}
	CKEDITOR.config.direction = '{$direction}';
	var opt_editor = {
		direction: '{$direction}',
		language: '{$lang->settings['htmllang']}',
		fontSize_sizes: '{$lang->editor_size_xx_small}/xx-small;{$lang->editor_size_x_small}/x-small;{$lang->editor_size_small}/small;{$lang->editor_size_medium}/medium;{$lang->editor_size_large}/large;{$lang->editor_size_x_large}/x-large;{$lang->editor_size_xx_large}/xx-large',
		fontSize_defaultLabel: '{$lang->editor_size_x_small}',
		extraPlugins: '{$divarea}',
		{$smilies}
	};
	CKEDITOR.replace("{$bind}", opt_editor);
	var clickableEditor = new messageEditor("{$bind}");
	CKEDITOR.performInsert = function(a,b,c,d) {
		return clickableEditor.performInsert(a,b,c,d);
	}
	if(clickableEditor)
	{
		clickableEditor.bindSmilieInserter("clickable_smilies");
	}
// -->
</script>