<script type="text/javascript" src="<bburl>jscripts/ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="<bburl>jscripts/ckeditor/editor.js"></script>
<script type="text/javascript">
<!--
	{$smiliesmap}
	CKEDITOR.config.direction = '{$direction}';
	CKEDITOR.replace("{$bind}",{
			direction: '{$direction}',
			language: '{$lang->settings['htmllang']}',
			fontSize_sizes: '{$lang->editor_size_xx_small}/xx-small;{$lang->editor_size_x_small}/x-small;{$lang->editor_size_small}/small;{$lang->editor_size_medium}/medium;{$lang->editor_size_large}/large;{$lang->editor_size_x_large}/x-large;{$lang->editor_size_xx_large}/xx-large',
			fontSize_defaultLabel: '{$lang->editor_size_x_small}',
			extraPlugins: '{$divarea}',
			{$smilies}
		});
	var clickableEditor = new messageEditor("{$bind}");
	if(clickableEditor)
	{
		clickableEditor.bindSmilieInserter("clickable_smilies");
	}
// -->
</script>