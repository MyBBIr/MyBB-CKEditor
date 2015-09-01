<?php
// Disallow direct access to this file for security reasons
if(!defined("IN_MYBB"))
{
    die("Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.");
}

define('CKEDITOR_VERSIONCODE', '0081');
function ckeditor_info()
{
	global $lang, $plugins_cache;
	$lang->load('ckeditor');
	$info = array(
		"name"          => $lang->ckeditor,
		"description"   => "",
		"website"       => "https://github.com/ATofighi/MyBB-CKEditor",
		"author"        => "AliReza_Tofighi",
		"authorsite"    => "http://my-bb.ir",
		"version"       => "1.0.0",
		"compatibility" => "18*"
	);
	if(ckeditor_is_installed() && $plugins_cache['active']['ckeditor'])
	{
		global $PL;
		$PL or require_once PLUGINLIBRARY;
		$info["description"] .= "<br /><a href=\"index.php?module=config/settings&action=change&search=ckeditor_\">{$lang->changesettings}</a>.";
		
		$functionphpContent = file_get_contents(MYBB_ROOT.'inc/functions.php');
		if(!strstr($functionphpContent, 'return ckeditor_build($bind, $smilies);')) {
			// TODO: localization
			$info["description"] .= '<br />Install is not complete. please open inc/functions.php file, find:<pre style="direction:ltr;text-align:left;background:#f7f7f7;border:1px solid #ccc;border-radius: 3px;padding:10px;display:block;width:auto">function build_mycode_inserter($bind="message", $smilies = true)
{
	global $db, $mybb, $theme, $templates, $lang, $plugins, $smiliecache, $cache;
</pre> and replace to:<pre style="direction:ltr;text-align:left;background:#f7f7f7;border:1px solid #ccc;border-radius: 3px;padding:10px;display:block;width:auto">
function build_mycode_inserter($bind="message", $smilies = true)
{
/* - PL:ckeditor - /* 	global $db, $mybb, $theme, $templates, $lang, $plugins, $smiliecache, $cache;
/* + PL:ckeditor + */ if(function_exists("ckeditor_build") && is_ckeditor_avilable())
/* + PL:ckeditor + */ {
/* + PL:ckeditor + */ return ckeditor_build($bind, $smilies);
/* + PL:ckeditor + */ }
/* + PL:ckeditor + */ global $db, $mybb, $theme, $templates, $lang, $plugins, $smiliecache, $cache;</pre>';
		}
	}
	return $info;
}
