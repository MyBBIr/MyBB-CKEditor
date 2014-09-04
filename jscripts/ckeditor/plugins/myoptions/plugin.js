
// Register the plugin within the editor.
CKEDITOR.plugins.add( 'myoptions', {

	// Register the icons.
	icons: 'myoptions',
	lang: 'en,fa',
	// The plugin initialization logic goes inside this method.
	init: function( editor ) {

		// Define an editor command that opens our dialog.
		editor.addCommand( 'myoptions', new CKEDITOR.dialogCommand( 'myoptionsDialog' ) );

		// Create a toolbar button that executes the above command.
		editor.ui.addButton( 'MyOptions', {

			// The text part of the button (if available) and tooptip.
			label: editor.lang.myoptions.title,

			// The command to execute on click.
			command: 'myoptions'
		});

		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add( 'myoptionsDialog', this.path + 'dialogs/myoptions.js' );
	}
});

