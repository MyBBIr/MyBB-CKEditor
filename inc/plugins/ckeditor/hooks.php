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

$plugins->add_hook('showthread_start','ckeditor_quickreply');
function ckeditor_quickreply(){
	global $mybb, $forumpermissions, $thread, $fid, $forum;
	global $codebuttons, $smilieinserter;
	if(($forumpermissions['canpostreplys'] != 0 && $mybb->user['suspendposting'] != 1 && ($thread['closed'] != 1 || is_moderator($fid)) && $mybb->settings['quickreply'] != 0 && $mybb->user['showquickreply'] != '0' && $forum['open'] != 0) && ($mybb->settings['bbcodeinserter'] != 0 && $forum['allowmycode'] != 0 && (!$mybb->user['uid'] || $mybb->user['showcodebuttons'] != 0))) {
		$codebuttons = build_mycode_inserter("message");
		if($forum['allowsmilies'] != 0)
		{
			$smilieinserter = build_clickable_smilies();
		}
	}
}

$plugins->add_hook('parse_message','ckeditor_parser');
function ckeditor_parser($m){
	$standard_mycode = $mycodes = array();

	$standard_mycode['sub']['regex'] = "#\[sub\](.*?)\[/sub\]#si";
	$standard_mycode['sub']['replacement'] = "<sub>$1</sub>";

	$standard_mycode['sup']['regex'] = "#\[sup\](.*?)\[/sup\]#si";
	$standard_mycode['sup']['replacement'] = "<sup>$1</sup>";
	foreach($standard_mycode as $code)
	{
		$mycodes['find'][] = $code['regex'];
		$mycodes['replacement'][] = $code['replacement'];
	}
	$m = preg_replace($mycodes['find'], $mycodes['replacement'], $m);
	return $m;
}
?>