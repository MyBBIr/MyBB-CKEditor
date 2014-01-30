<?php
// Disallow direct access to this file for security reasons
if(!defined("IN_MYBB"))
{
    die("Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.");
}

$plugins->add_hook('admin_style_templates','ckedtior_admin_style_templates');
function ckedtior_admin_style_templates() {
	global $lang;
	$lang->load('ckeditor');
}

$plugins->add_hook('xmlhttp','ckeditor_inline_editor');
function ckeditor_inline_editor(){
	global $mybb, $codebuttons;
	if($mybb->settings['ckeditor_inlineedit'] && $mybb->input['action'] == "edit_post" && $mybb->input['do'] == "get_post") {
		$codebuttons = build_mycode_inserter("quickedit_".intval($mybb->input['pid']));
	}
}
?>