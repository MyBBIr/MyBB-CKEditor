<?php
// Disallow direct access to this file for security reasons
if(!defined("IN_MYBB"))
{
    die("Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.");
}

function ckeditor_is_installed() {
	global $mybb,$db;
	//$query = $db->query("select * from ".TABLE_PREFIX."templategroups where prefix = 'ckeditor'");
	if(isset($mybb->settings['ckeditor_active']) || isset($settings['ckeditor_active'])/* || $db->num_rows($query) > 0*/)
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
	//find_replace_templatesets("xmlhttp_inline_post_editor", "#".preg_quote('{$codebuttons}')."#i", '', 0);
	find_replace_templatesets("showthread_quickreply", "#".preg_quote('{$codebuttons}')."#i", '', 0);
	find_replace_templatesets("showthread_quickreply", "#".preg_quote('{$smilieinserter}')."#i", '', 0);
	//find_replace_templatesets("xmlhttp_inline_post_editor", "#".preg_quote('</textarea>')."#i", '</textarea>{$codebuttons}');
	find_replace_templatesets("showthread_quickreply", "#".preg_quote('</textarea>')."#i", '</textarea>{$codebuttons}');
	find_replace_templatesets("showthread_quickreply", "#".preg_quote('{$option_signature}')."#i", '{$smilieinserter}{$option_signature}');
	find_replace_templatesets("post_attachments_attachment_postinsert", "#".'\\$\\(\'\\#message\'\\)\\.sceditor\\(\'instance\'\\)'."#i", 'MyBBEditor');
	$PL->templates("ckeditor",
					"<lang:group_ckeditor>",
					array(
						"codebuttons" => ckplugin_gettemplate('codebuttons', 0, 0)
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
							"description" => '',
							"value" => 0
						),
						"ajaxbbcodeparser" => array(
							"title" => $lang->ckeditor_ajaxbbcodeparser,
							"description" => '',
							"value" => 1
						),
						"editormode" => array(
							"title" => $lang->ckeditor_editormode,
							"description" => $lang->ckeditor_editormode_desc,
							"optionscode" => "select\nwysiwyg={$lang->ckeditor_wysiwyg}\nsource={$lang->ckeditor_source}",
							"value" => "wysiwyg"
						),
						"disablelocation" => array(
							"title" => $lang->ckeditor_disablelocations,
							"description" => $lang->ckeditor_disablelocations_desc,
							"optionscode" => "textarea",
							"value" => ''
						),
						"autosave" => array(
							"title" => $lang->ckeditor_autosave,
							"description" => $lang->ckeditor_autosave_desc,
							"optionscode" => "text",
							"value" => 25
						),
						"height" => array(
							"title" => $lang->ckeditor_height,
							"description" => '',
							"optionscode" => "text",
							"value" => 250
						),
						"maxheight" => array(
							"title" => $lang->ckeditor_maxheight,
							"description" => '',
							"optionscode" => "text",
							"value" => 450
						),
						"color" => array(
							"title" => $lang->ckeditor_color,
							"description" => '',
							"optionscode" => "text",
							"value" => '#cecece'
						),
						"theme" => array(
							"title" => $lang->ckeditor_theme,
							"description" => '',
							"optionscode" => 'php
".ckeditor_getthemeeditors()."',
							"value" => 'moonocolor'
						)
					)
				);
	$PL->edit_core('ckeditor', 'inc/functions.php',
               array('search' => 'function build_mycode_inserter($bind="message", $smilies = true)
{',
                     'replace' => 'function build_mycode_inserter($bind="message", $smilies = true)
{if(function_exists("ckeditor_build") && is_ckeditor_avilable()) { return ckeditor_build($bind, $smilies);}'),
               true);
}

function ckeditor_deactivate(){
	global $mybb, $db, $lang, $PL;
	$lang->load('ckeditor');
	$PL or require_once PLUGINLIBRARY;
	$PL->settings_delete('ckeditor');
	$PL->edit_core('ckeditor', 'inc/functions.php',
               array('search' => 'function build_mycode_inserter($bind="message", $smilies = true)
{global $mybb;if(function_exists("ckeditor_build")) { return ckeditor_build($bind, $smilies);}',
                     'replace' => 'function build_mycode_inserter($bind="message", $smilies = true)
{'),
               true);
}

function ckeditor_uninstall(){
	global $mybb, $db, $lang, $PL;
	include MYBB_ROOT."/inc/adminfunctions_templates.php";
	//find_replace_templatesets("xmlhttp_inline_post_editor", "#".preg_quote('{$codebuttons}')."#i", '', 0);
	find_replace_templatesets("showthread_quickreply", "#".preg_quote('{$codebuttons}')."#i", '', 0);
	find_replace_templatesets("showthread_quickreply", "#".preg_quote('{$smilieinserter}')."#i", '', 0);
	find_replace_templatesets("post_attachments_attachment_postinsert", "#".preg_quote('MyBBEditor')."#i", '$(\'#message\').sceditor(\'instance\')');
	$lang->load('ckeditor');
	$PL or require_once PLUGINLIBRARY;
	$PL->templates_delete("ckeditor");
}