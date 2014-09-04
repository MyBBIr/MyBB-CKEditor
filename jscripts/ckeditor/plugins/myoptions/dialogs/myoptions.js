
// Our dialog definition.
CKEDITOR.dialog.add( 'myoptionsDialog', function( editor ) {
	return {

		// Basic properties of the dialog window: title, minimum size.
		title: editor.lang.myoptions.title,
		minWidth: 300,
		minHeight: 60,

		// Dialog window contents definition.
		contents: [
			{
				// Definition of the Basic Settings dialog tab (page).
				id: 'tab-basic',
				label: editor.lang.myoptions.basictab,

				// The tab contents.
				elements: [
					{
						// Text input field for the abbreviation text.
						type: 'checkbox',
						id: 'pastetext',
						label: editor.lang.myoptions.pastetext
					},
					{
						// Text input field for the abbreviation text.
						type: 'checkbox',
						id: 'clearautosave',
						label: editor.lang.myoptions.clearautosave
					}
				]
			}
		],
		
		onShow: function() {
			var dialog = this;

			mycookie = '';
			cname = 'myoptions_clearautosave';
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i].trim();
				if (c.indexOf(name) == 0) mycookie =  c.substring(name.length,c.length);
			}
			if(mycookie == 'true') mycookie = 1; else mycookie = 0;

			dialog.setValueOf( 'tab-basic', 'clearautosave', mycookie );

			mycookie = '';
			cname = 'myoptions_pastetext';
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i].trim();
				if (c.indexOf(name) == 0) mycookie =  c.substring(name.length,c.length);
			}
			if(mycookie == 'true') mycookie = 1; else mycookie = 0;

			dialog.setValueOf( 'tab-basic', 'pastetext', mycookie );
		},

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {
			var dialog = this;

			document.cookie = "myoptions_clearautosave=" + dialog.getValueOf( 'tab-basic', 'clearautosave' ) + "; expires=Wed, 1 Jan 2020 00:00:00 GMT;";
			document.cookie = "myoptions_pastetext=" + dialog.getValueOf( 'tab-basic', 'pastetext' ) + "; expires=Wed, 1 Jan 2020 00:00:00 GMT;";
			//alert(dialog.getValueOf( 'tab-basic', 'clearautosave' ));

		}
	};
});