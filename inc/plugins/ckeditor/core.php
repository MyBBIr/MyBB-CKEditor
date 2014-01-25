<?php
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

/* Functions - start*/
function ckplugin_gettemplate($template) {
	$file = CKEDITOR_PLUGINROOT.'ckeditor.'.$template.'.tpl';
	if(file_exists($file)) {
		return file_get_contents($file);
	} else {
		return false;
	}
}

function ckeditor_build($bind="message") {
	global $db, $mybb, $theme, $templates, $lang, $plugins;
	$lang->load('ckeditor');
	$codeinsert = '';
	if($mybb->settings['bbcodeinserter'] != 0)
	{
		if($lang->settings['rtl'] == true) {
			$direction = 'rtl';
		} else {
			$direction = 'ltr';
		}
		$smilies = ckesmiliesjs_build();
		$smiliesmap = ckesmiliesjs_build(1);
		
		if(defined("IN_ADMINCP"))
		{
			eval("\$codeinsert = \"".addslashes(ckplugin_gettemplate("codebuttons"))."\";");
			$codeinsert = str_replace('<bburl>', '../', $codeinsert);
		}
		else
		{
			eval("\$codeinsert = \"".$templates->get("ckeditor_codebuttons")."\";");
			$codeinsert = str_replace('<bburl>', $mybb->settings['bburl'].'/', $codeinsert);
		}
	}
	
	return $codeinsert;
	
}

function ckesmiliesjs_build($finds = null)
{
	global $cache, $smiliecache, $theme, $templates, $lang, $mybb, $smiliecount;

	if($mybb->settings['smilieinserter'] != 0 && $mybb->settings['smilieinsertercols'] && $mybb->settings['smilieinsertertot'])
	{
		if(!$smiliecount)
		{
			$smilie_cache = $cache->read("smilies");
			$smiliecount = count($smilie_cache);
		}

		if(!$smiliecache)
		{
			if(!is_array($smilie_cache))
			{
				$smilie_cache = $cache->read("smilies");
			}
			foreach($smilie_cache as $smilie)
			{
				if($smilie['showclickable'] != 0)
				{
					$smiliecache[$smilie['find']] = $smilie['image'];
				}
			}
		}

		unset($smilie);

		if(is_array($smiliecache))
		{
			reset($smiliecache);

			$getmore = '';
			if($mybb->settings['smilieinsertertot'] >= $smiliecount)
			{
				$mybb->settings['smilieinsertertot'] = $smiliecount;
			}
			
			$smilies1 = "";
			$smilies2 = "";
			$smilies3 = "";
			$counter = 0;
			$i = 0;

			foreach($smiliecache as $find => $image)
			{
				if($i < $mybb->settings['smilieinsertertot'])
				{
					$find = htmlspecialchars_uni($find);
					$smilies1 .= "'".str_replace("'","\\'",$image)."', ";
					$smilies2 .= "'smilie{$i}', ";
					$smilies3 .= "'smilie{$i}': '".str_replace("'","\\'",$find)."', ";
					++$i;
					++$counter;

					if($counter == $mybb->settings['smilieinsertercols'])
					{
						$counter = 0;
					}
				}
			}
			if($finds) {
				$clickablesmilies = "var smiliesmap = { {$smilies3} };";
			} else {
				$clickablesmilies = "smiley_images: [\n{$smilies1}\n],\n smiley_descriptions: [\n{$smilies2}\n]";
			}
		}
		else
		{
			$clickablesmilies = "";
		}
	}
	else
	{
		$clickablesmilies = "";
	}

	return $clickablesmilies;
}
/* Functions - end */

?>