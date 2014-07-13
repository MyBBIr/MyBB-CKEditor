<?php

define("IN_MYBB", 1);
define('THIS_SCRIPT', 'index.php');
define("NO_ONLINE", 1);

require_once "../global.php";

$template = file_get_contents('./_index.tpl');
$lang->load('ckeditor');
output_page($template);
?>