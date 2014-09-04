<?php
/*
 * Upload Image for CKEditor
 */


define("IN_MYBB", 1);
define('THIS_SCRIPT', 'index.php');
define("NO_ONLINE", 1);

require_once "../global.php";


$lang->load('ckeditor');

$allowed = array('png', 'jpg', 'gif');
$maxsize = 1024*1024; // 1 MB
if(isset($_FILES['upl']) && $_FILES['upl']['error'] == 0){

	$extension = pathinfo($_FILES['upl']['name'], PATHINFO_EXTENSION);

	if(!in_array(strtolower($extension), $allowed)){
		echo json_encode(array("status" => "error", "message" => $lang->ckeditor_upload_invalid_type));
		exit;
	}

	if($_FILES['upl']['size'] > $maxsize){
		echo json_encode(array("status" => "error", "message" => $lang->ckeditor_upload_size_big));
		exit;
	}
	$_FILES['upl']['name'] = time().'_'.random_str(15).'.'.$extension;
	if(move_uploaded_file($_FILES['upl']['tmp_name'], 'uploads/'.$_FILES['upl']['name'])){
		echo json_encode(array("status" => "success", "filename" => $mybb->settings['bburl'].'/ckeditor_upload/uploads/'.$_FILES['upl']['name']));
		exit;
	}
}

echo json_encode(array("status" => "error", "message" => $lang->ckeditor_upload_unknown_error));
exit;

?>