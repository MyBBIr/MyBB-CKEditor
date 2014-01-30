<?php
// Disallow direct access to this file for security reasons
if(!defined("IN_MYBB"))
{
    die("Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.");
}

function ckeditor_is_installed() {
	global $mybb,$db;
	$query = $db->query("select * from ".TABLE_PREFIX."templategroups where prefix = 'ckeditor'");
	if(isset($mybb->settings['ckeditor_active']) || isset($settings['ckeditor_active']) || $db->num_rows($query) > 0)
	{
		return true;
	} else {
		return false;
	}
}

function ckeditor_install(){
	global $mybb, $db, $lang, $PL;
	$lang->load('ckeditor');
	if(!file_exists(PLUGINLIBRARY))
	{
		flash_message($lang->pluginlibrarymissing, "error");
		admin_redirect("index.php?module=config-plugins");
	}
	$PL or require_once PLUGINLIBRARY;
	if($PL->version < 12)
	{
		flash_message($lang->pluginlibraryold, "error");
		admin_redirect("index.php?module=config-plugins");
	}
	include MYBB_ROOT."/inc/adminfunctions_templates.php";
	find_replace_templatesets("xmlhttp_inline_post_editor", "#".preg_quote('{$codebuttons}')."#i", '', 0);
	find_replace_templatesets("xmlhttp_inline_post_editor", "#".preg_quote('</textarea>')."#i", '</textarea>{$codebuttons}');
	$PL->templates("ckeditor",
					"<lang:group_ckeditor>",
					array(
						"codebuttons" => ckplugin_gettemplate('codebuttons')
					)
				);
}

function ckeditor_activate(){
	global $mybb, $db, $lang, $PL;
	$lang->load('ckeditor');
	if(!file_exists(PLUGINLIBRARY))
	{
		flash_message($lang->pluginlibrarymissing, "error");
		admin_redirect("index.php?module=config-plugins");
	}
	$PL or require_once PLUGINLIBRARY;
	if($PL->version < 12)
	{
		flash_message($lang->pluginlibraryold, "error");
		admin_redirect("index.php?module=config-plugins");
	}

	$PL->settings("ckeditor",
					$lang->sttingsforckeditor,
					'',
					array(
						"active" => array(
							"title" => $lang->ckeditor_activate,
							"description" => '',
							"value" => 1
						),
						"usedivarea" => array(
							"title" => $lang->ckeditor_userdivarea,
							"description" => ''
						),
					)
				);
	$PL->edit_core('ckeditor', 'inc/functions.php',
               array('search' => 'function build_mycode_inserter($bind="message")
{',
                     'replace' => 'function build_mycode_inserter($bind="message")
{global $mybb;if(function_exists("ckeditor_build")) { return ckeditor_build($bind);}'),
               true);
}

function ckeditor_deactivate(){
	global $mybb, $db, $lang, $PL;
	$lang->load('ckeditor');
	$PL or require_once PLUGINLIBRARY;
	$PL->settings_delete('ckeditor');
	$PL->edit_core('ckeditor', 'inc/functions.php',
               array('search' => 'function build_mycode_inserter($bind="message")
{global $mybb;if(function_exists("ckeditor_build")) { return ckeditor_build($bind);}',
                     'replace' => 'function build_mycode_inserter($bind="message")
{'),
               true);
}

function ckeditor_uninstall(){
	global $mybb, $db, $lang, $PL;
	$lang->load('ckeditor');
	$PL or require_once PLUGINLIBRARY;
	$PL->templates_delete("ckeditor");
}
?>