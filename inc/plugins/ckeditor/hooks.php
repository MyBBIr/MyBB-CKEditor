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


?>