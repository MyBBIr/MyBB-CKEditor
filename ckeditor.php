<?php
/**
 * MyBB 1.8
 * Copyright 2014 MyBB Group, All Rights Reserved
 *
 * Website: http://www.mybb.com
 * License: http://www.mybb.com/about/license
 *
 */


define("IN_MYBB", 1);

// We don't want visits here showing up on the Who's Online
define("NO_ONLINE", 1);

define('THIS_SCRIPT', 'ckeditor.php');

// Load MyBB core files
require_once dirname(__FILE__)."/inc/init.php";

$shutdown_queries = array();

// Load some of the stock caches we'll be using.
$groupscache = $cache->read("usergroups");

if(!is_array($groupscache))
{
	$cache->update_usergroups();
	$groupscache = $cache->read("usergroups");
}

// Send no cache headers
header("Expires: Sat, 1 Jan 2000 01:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

// Create the session
require_once MYBB_ROOT."inc/class_session.php";
$session = new session;
$session->init();

// Load the language we'll be using
if(!isset($mybb->settings['bblanguage']))
{
	$mybb->settings['bblanguage'] = "english";
}
if(isset($mybb->user['language']) && $lang->language_exists($mybb->user['language']))
{
	$mybb->settings['bblanguage'] = $mybb->user['language'];
}
$lang->set_language($mybb->settings['bblanguage']);

if(function_exists('mb_internal_encoding') && !empty($lang->settings['charset']))
{
	@mb_internal_encoding($lang->settings['charset']);
}

// Load the theme
// 1. Check cookies
if(!$mybb->user['uid'] && !empty($mybb->cookies['mybbtheme']))
{
	$mybb->user['style'] = $mybb->cookies['mybbtheme'];
}

// 2. Load style
if(isset($mybb->user['style']) && (int)$mybb->user['style'] != 0)
{
	$loadstyle = "tid='".(int)$mybb->user['style']."'";
}
else
{
	$loadstyle = "def='1'";
}

// Load basic theme information that we could be needing.
if($loadstyle == "def='1'")
{
	if(!$cache->read('default_theme'))
	{
		$cache->update_default_theme();
	}
	$theme = $cache->read('default_theme');
}
else
{
	$query = $db->simple_select("themes", "name, tid, properties", $loadstyle);
	$theme = $db->fetch_array($query);
}

// No theme was found - we attempt to load the master or any other theme
if(!isset($theme['tid']) || isset($theme['tid']) && !$theme['tid'])
{
	// Missing theme was from a user, run a query to set any users using the theme to the default
	$db->update_query('users', array('style' => 0), "style = '{$mybb->user['style']}'");

	// Attempt to load the master or any other theme if the master is not available
	$query = $db->simple_select('themes', 'name, tid, properties, stylesheets', '', array('order_by' => 'tid', 'limit' => 1));
	$theme = $db->fetch_array($query);
}
$theme = @array_merge($theme, my_unserialize($theme['properties']));

// Set the appropriate image language directory for this theme.
// Are we linking to a remote theme server?
if(my_substr($theme['imgdir'], 0, 7) == 'http://' || my_substr($theme['imgdir'], 0, 8) == 'https://')
{
	// If a language directory for the current language exists within the theme - we use it
	if(!empty($mybb->user['language']))
	{
		$theme['imglangdir'] = $theme['imgdir'].'/'.$mybb->user['language'];
	}
	else
	{
		// Check if a custom language directory exists for this theme
		if(!empty($mybb->settings['bblanguage']))
		{
			$theme['imglangdir'] = $theme['imgdir'].'/'.$mybb->settings['bblanguage'];
		}
		// Otherwise, the image language directory is the same as the language directory for the theme
		else
		{
			$theme['imglangdir'] = $theme['imgdir'];
		}
	}
}
else
{
	$img_directory = $theme['imgdir'];

	if($mybb->settings['usecdn'] && !empty($mybb->settings['cdnpath']))
	{
		$img_directory = rtrim($mybb->settings['cdnpath'], '/') . '/' . ltrim($theme['imgdir'], '/');
	}

	if(!@is_dir($img_directory))
	{
		$theme['imgdir'] = 'images';
	}

	// If a language directory for the current language exists within the theme - we use it
	if(!empty($mybb->user['language']) && is_dir($img_directory.'/'.$mybb->user['language']))
	{
		$theme['imglangdir'] = $theme['imgdir'].'/'.$mybb->user['language'];
	}
	else
	{
		// Check if a custom language directory exists for this theme
		if(is_dir($img_directory.'/'.$mybb->settings['bblanguage']))
		{
			$theme['imglangdir'] = $theme['imgdir'].'/'.$mybb->settings['bblanguage'];
		}
		// Otherwise, the image language directory is the same as the language directory for the theme
		else
		{
		$theme['imglangdir'] = $theme['imgdir'];
		}
	}

	$theme['imgdir'] = $mybb->get_asset_url($theme['imgdir']);
	$theme['imglangdir'] = $mybb->get_asset_url($theme['imglangdir']);
}

$templatelist = "postbit_editedby,xmlhttp_inline_post_editor,xmlhttp_buddyselect_online,xmlhttp_buddyselect_offline,xmlhttp_buddyselect";
$templates->cache($db->escape_string($templatelist));

if($lang->settings['charset'])
{
	$charset = $lang->settings['charset'];
}
// If not, revert to UTF-8
else
{
	$charset = "UTF-8";
}

if($mybb->settings['ckeditor_ajaxbbcodeparser'] == 0)
{
	exit;
}

$lang->load("global");
$lang->load("ckeditor");
$message = $mybb->input['m'];
require_once MYBB_ROOT."inc/class_parser.php";
$parser = new postParser;

$plugins->run_hooks("ckeditor");

// Parser HTML:
$message = $parser->parse_html($message);
// Start Code block:
preg_match_all("#\[(code|php)\](.*?)\[/\\1\](\r\n?|\n?)#si", $message, $code_matches, PREG_SET_ORDER);
$message = preg_replace("#\[(code|php)\](.*?)\[/\\1\](\r\n?|\n?)#si", "<mybb-code>\n", $message);
// Parser MyCodes
$message = preg_replace("#\[b\](.*?)\[/b\]#si", '<strong>$1</strong>', $message);
$message = preg_replace("#\[i\](.*?)\[/i\]#si", '<em>$1</em>', $message);
$message = preg_replace("#\[u\](.*?)\[/u\]#si", '<u>$1</u>', $message);
$message = preg_replace("#\[s\](.*?)\[/s\]#si", '<strike>$1</strike>', $message);
$message = preg_replace("#\[sub\](.*?)\[/sub\]#si", '<sub>$1</sub>', $message);
$message = preg_replace("#\[sup\](.*?)\[/sup\]#si", '<sup>$1</sup>', $message);
$message = preg_replace("#\[align=([a-z]+)\](.*?)\[/align\]#si", '<div style="text-align: $1;">$2</div>', $message);
$message = preg_replace("#\[dir=ltr\](.*?)\[/dir\]#si", '<div dir="ltr" style="direction:ltr;">$1</div>', $message);
$message = preg_replace("#\[dir=rtl\](.*?)\[/dir\]#si", '<div dir="rtl" style="direction:rtl;">$1</div>', $message);
$message = preg_replace("#\[size=(xx-small|x-small|small|medium|large|x-large|xx-large)\](.*?)\[/size\]#si", '<span style="font-size:$1">$2</span>', $message);
$message = preg_replace("#\[font=([a-z0-9 ,\-_'\"]+)\](.*?)\[/font\]#si", '<span style="font-family: $1;">$2</span>', $message);
$message = preg_replace("#\[color=([a-zA-Z]*|\#?[\da-fA-F]{3}|\#?[\da-fA-F]{6})\](.*?)\[/color\]#si", '<span style="color: $1;">$2</span>', $message);
$message = preg_replace("#\[hr\]#si", '<hr>', $message);
$message = preg_replace("#\[quote\](.*?)\[/quote\]#si", '<blockquote><p>$1</p></blockquote>', $message);
$message = preg_replace("#\[quote=(.*?)\](.*?)\[/quote\]#si", '<blockquote><cite>$1</cite><p>$2</p></blockquote>', $message);
$message = preg_replace("#\[url\](.*?)\[/url\]#si", '<a href="$1">$1</a>', $message);
$message = preg_replace("#\[url=(.*?)](.*?)\[/url\]#si", '<a href="$1">$2</a>', $message);
$message = preg_replace("#\[email\]([^\"]+)\[/email\]#si", '<a href="mailto:$1">$1</a>', $message);
$message = preg_replace("#\[email=([^\"]+)\](.*?)\[/email\]#si", '<a href="mailto:$1">$2</a>', $message);
$message = preg_replace("#\[img\](\r\n?|\n?)(https?://([^<>\"']+?))\[/img\]#is", '<img src="$2" />', $message);
$message = preg_replace("#\[img=([0-9]{1,3})x([0-9]{1,3})\](\r\n?|\n?)(https?://([^<>\"']+?))\[/img\]#is", '<img src="$4" width="$1" height="$2" />', $message);
$message = preg_replace("#\[img align=([a-z]+)\](\r\n?|\n?)(https?://([^<>\"']+?))\[/img\]#is", '<div style="text-align: $1;"><img src="$3" /></div>', $message);
$message = preg_replace("#\[img=([0-9]{1,3})x([0-9]{1,3}) align=([a-z]+)\](\r\n?|\n?)(https?://([^<>\"']+?))\[/img\]#is", '<div style="text-align: $3;"><img src="$5" width="$1" height="$2" /></div>', $message);

$parser->list_elements = array();
$parser->list_count = 0;

//Lists:
// Find all lists
$message = preg_replace_callback("#(\[list(=(a|A|i|I|1))?\]|\[/list\])#si", array($parser, 'mycode_prepare_list'), $message);

// Replace all lists
for($i = $parser->list_count; $i > 0; $i--)
{
	// Ignores missing end tags
	$message = preg_replace_callback("#\s?\[list(=(a|A|i|I|1))?&{$i}\](.*?)(\[/list&{$i}\]|$)(\r\n?|\n?)#si", array($parser, 'mycode_parse_list_callback'), $message, 1);
}
$message = preg_replace("#</li>([\n\r]+)<li>#si",'</li><li>', $message);


// Table:
while(preg_match("#\[table\](.*?)\[/table\]#si", $message, $m1))
{
	while(preg_match("#\[tr\](.*?)\[/tr\]#si", $m1[1], $m2))
	{
		$m2[1] = preg_replace("#\[td\](.*?)\[/td\]#si", '<td style="border: 1px dashed #999;padding: 3px 5px;vertical-align: top;min-height:20px;">$1</td>', $m2[1]);
		$m1[1] = str_replace($m2[0], '<tr>'.$m2[1].'</tr>', $m1[1]);
	}
	$message = str_replace($m1[0], '<table class="ckeditor_table" style="width: 100%;border-collapse:collapse;border-spacing:0;table-layout:fixed;border: 2px solid #333;background:#fff;">'.$m1[1].'</table>', $message);
}

// Smilies:
$message = ckeparser_smilies($message);

// End Code Block:
if(count($code_matches) > 0)
{
	foreach($code_matches as $text)
	{
		$code = '<pre class="prettyprint '.my_strtolower($text[1]).'block">'.$text[2].'</pre>';
		$message = preg_replace("#\<mybb-code>\n?#", $code, $message, 1);
	}
}

header("Content-type: application/json; charset={$charset}");
echo json_encode(array(
	"message" => $message
));
exit;
