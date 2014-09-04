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

$plugins->add_hook('private_read_end','ckeditor_pm_quickreply');
function ckeditor_pm_quickreply(){
	global $mybb, $quickreply;
	if($quickreply) {
		$quickreply .= build_mycode_inserter("message");
	}
}

$plugins->add_hook('showthread_start','ckeditor_quickreply');
function ckeditor_quickreply(){
	global $mybb, $forumpermissions, $thread, $fid, $forum;
	global $codebuttons, $smilieinserter;
	if(!is_ckeditor_avilable('quickreply'))
	{
		return NULL;
	}
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
	$standard_mycode['bidiltr']['regex'] = "#\[dir=ltr\](.*?)\[/dir\]#si";
	$standard_mycode['bidiltr']['replacement'] = "<div dir=\"ltr\" style=\"direction: ltr;text-align:left;\">$1</div>";
	$standard_mycode['bidirtl']['regex'] = "#\[dir=rtl\](.*?)\[/dir\]#si";
	$standard_mycode['bidirtl']['replacement'] = "<div dir=\"rtl\" style=\"direction: rtl;text-align:right;\">$1</div>";
	foreach($standard_mycode as $code)
	{
		$mycodes['find'][] = $code['regex'];
		$mycodes['replacement'][] = $code['replacement'];
	}
	$m = preg_replace($mycodes['find'], $mycodes['replacement'], $m);

	// Table:
	while(preg_match("#\[table\](.*?)\[/table\]#si", $m, $m1))
	{
		while(preg_match("#\[tr\](.*?)\[/tr\]#si", $m1[1], $m2))
		{
			$m2[1] = preg_replace("#\[td\](.*?)\[/td\]#si", '<td style="border: 1px dashed #999;padding: 3px 5px;vertical-align: top;min-height:20px;">$1</td>', $m2[1]);
			$m1[1] = str_replace($m2[0], '<tr>'.$m2[1].'</tr>', $m1[1]);
		}
		$m = str_replace($m1[0], '<table class="ckeditor_table" style="width: 100%;border-collapse:collapse;border-spacing:0;table-layout:fixed;border: 2px solid #333;background:#fff;">'.$m1[1].'</table>', $m);
	}

	return $m;
}