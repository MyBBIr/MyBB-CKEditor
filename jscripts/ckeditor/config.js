/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	
	// %REMOVE_START%
	// The configuration options below are needed when running CKEditor from source files.
	config.plugins = 'dialogui,dialog,about,a11yhelp,dialogadvtab,basicstyles,bidi,blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,colordialog,templates,menu,contextmenu,div,resize,toolbar,elementspath,enterkey,entities,popup,filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,forms,format,horizontalrule,htmlwriter,iframe,wysiwygarea,image,indent,indentblock,indentlist,smiley,justify,menubutton,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastetext,pastefromword,preview,print,removeformat,save,selectall,showblocks,showborders,sourcearea,specialchar,scayt,stylescombo,tab,table,tabletools,undo,wsc,bbcode,divarea';
	config.skin = 'moonocolor';
	
	config.removePlugins = 'bidi,dialogadvtab,div,filebrowser,flash,format,forms,horizontalrule,iframe,justify,liststyle,pagebreak,showborders,stylescombo,table,tabletools,templates';
	// Width and height are not supported in the BBCode format, so object resizing is disabled.
	config.disableObjectResizing = true;
	// Define font sizes in percent values.
	config.fontSize_sizes = "30/30%;50/50%;100/100%;120/120%;150/150%;200/200%;300/300%";
	config.toolbar = [
		[ 'Source', '-', 'Save', 'NewPage', '-', 'Undo', 'Redo' ],
		[ 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat' ],
		[ 'Link', 'Unlink', 'Image', 'Smiley', 'SpecialChar' ],
		'/',
		[ 'Bold', 'Italic', 'Underline' ],
		[ 'FontSize' ],
		[ 'TextColor' ],
		[ 'NumberedList', 'BulletedList', '-', 'Blockquote' ],
		[ 'Maximize' ]
	];
	// Strip CKEditor smileys to those commonly used in BBCode.
	config.smiley_images = [
		'regular_smile.png', 'sad_smile.png', 'wink_smile.png', 'teeth_smile.png', 'tongue_smile.png',
		'embarrassed_smile.png', 'omg_smile.png', 'whatchutalkingabout_smile.png', 'angel_smile.png',
		'shades_smile.png', 'cry_smile.png', 'kiss.png'
	];
	config.smiley_descriptions = [
		'smiley', 'sad', 'wink', 'laugh', 'cheeky', 'blush', 'surprise',
		'indecision', 'angel', 'cool', 'crying', 'kiss'
	];
	// Define changes to default configuration here. For example=
	config.language = 'fa';
	// config.uiColor = '#AADC6E';
};
