<?php

define("IN_MYBB", 1);
define('THIS_SCRIPT', 'index.php');
define("NO_ONLINE", 1);

require_once "../global.php";

$lang->load('ckeditor');

eval("\$upload = \"".ckplugin_gettemplate("upload")."\";");
output_page($upload);
?>