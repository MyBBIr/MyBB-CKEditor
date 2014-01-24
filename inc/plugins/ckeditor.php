<?php
/**
 * CKEditor MyBB Plugin
 * Copyright 2014 My-BB.Ir Group, All Rights Reserved
 *
 * Website: http://my-bb.ir
 *
 * $Id AliReza_Tofighi$
 */

// Disallow direct access to this file for security reasons
if(!defined("IN_MYBB"))
{
    die("Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.");
}

/**
 * DEFINE PLUGINLIBRARY
 *
 *   Define the path to the plugin library, if it isn't defined yet.
 */
if(!defined("PLUGINLIBRARY"))
{
    define("PLUGINLIBRARY", MYBB_ROOT."inc/plugins/pluginlibrary.php");
}



function ckeditor_info()
{
	$info = array(
		"name"          => "CKEditor",
		"description"   => "",
		"website"       => "https://github.com/ATofighi/MyBB-CKEditor",
		"author"        => "AliReza_Tofighi",
		"authorsite"    => "http://my-bb.ir",
		"version"       => "0.1 Preview",
		"guid"          => "",
		"compatibility" => "16*"
	);
	return $info;
}
?>