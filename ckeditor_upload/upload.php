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
		echo json_encode(array("status" => "error", "message" => "نوع فایل پیوست غیرمجاز است"));
		exit;
	}

	if($_FILES['upl']['size'] > $maxsize){
		echo json_encode(array("status" => "error", "message" => "حجم فایل آپلودی بسیار زیاد است."));
		exit;
	}
	$_FILES['upl']['name'] = time().'_'.rand(10000000,9999999).'.'.$extension;
	if(move_uploaded_file($_FILES['upl']['tmp_name'], 'uploads/'.$_FILES['upl']['name'])){
		echo json_encode(array("status" => "success", "message" => "فایل با موفقیت آپلود شد", "filename" => $mybb->settings['bburl'].'/ckeditor_upload/uploads/'.$_FILES['upl']['name']));
		exit;
	}
}

echo json_encode(array("status" => "error", "message" => "یک خطای ناشناخته رخ داده است."));
exit;

?>