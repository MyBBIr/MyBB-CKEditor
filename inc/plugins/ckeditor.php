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

define(CKEDITOR_PLUGINROOT,MYBB_ROOT.'inc/plugins/ckeditor/');
require_once(CKEDITOR_PLUGINROOT.'core.php');
require_once(CKEDITOR_PLUGINROOT.'hooks.php');
require_once(CKEDITOR_PLUGINROOT.'info.php');
require_once(CKEDITOR_PLUGINROOT.'install.php');
?>