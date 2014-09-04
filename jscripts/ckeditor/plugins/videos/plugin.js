/*
 * By: AliReza_Tofighi - Http://My-BB.Ir
*/
CKEDITOR.plugins.add( 'videos', {
	icons: 'videos',
	lang : 'en,fa', // %REMOVE_LINE_CORE%
	requires: 'dialog',
	init: function( editor ) {
		command = editor.addCommand( 'videosDialog', new CKEDITOR.dialogCommand( 'videosDialog' ) );
		command.modes = { wysiwyg: 1, source: 1 };
		editor.ui.addButton( 'Videos', {
			label: editor.lang.videos.title,
			command: 'videosDialog',
			toolbar: 'insert'
		});

		CKEDITOR.dialog.add( 'videosDialog', this.path + 'dialogs/videos.js' );
	}
});