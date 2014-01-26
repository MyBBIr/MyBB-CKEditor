<script type="text/javascript" src="<bburl>jscripts/ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="<bburl>jscripts/ckeditor/editor.js"></script>
<script type="text/javascript">
<!--
	{$smiliesmap}
	CKEDITOR.replace("{$bind}",{
			direction: '{$direction}',
			language: '{$lang->settings['htmllang']}',
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