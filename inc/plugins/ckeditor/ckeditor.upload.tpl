<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
		<link href="assets/css/style.css" rel="stylesheet" />
	</head>

	<body>
		<div id="upload_cover">{$lang->ckeditor_upload_draghere}</div>
		<form id="upload" method="post" action="upload.php" enctype="multipart/form-data">
			<div id="drop">
				{$lang->ckeditor_upload_draghere}

				<a>{$lang->ckeditor_upload_browse}</a>
				<input type="file" name="upl" />
			</div>

			<ul>
				<!-- The file uploads will be shown here -->
			</ul>

		</form>

		<!-- MyBB Languages -->
        <script type="text/javascript">
		// <!--
		var lang = {};
		lang.hide = '{$lang->ckeditor_upload_hide}';
		lang.inserttoeditor = '{$lang->ckeditor_upload_inserttoeditor}';
		// -->
		</script>
		<!-- JavaScript Includes -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" type="text/javascript"></script>
		<script src="assets/js/jquery.knob.js" type="text/javascript"></script>

		<!-- jQuery File Upload Dependencies -->
		<script src="assets/js/jquery.ui.widget.js" type="text/javascript"></script>
		<script src="assets/js/jquery.iframe-transport.js" type="text/javascript"></script>
		<script src="assets/js/jquery.fileupload.js" type="text/javascript"></script>
		
		<!-- Our main JS file -->
		<script src="assets/js/script.js" type="text/javascript"></script>
	</body>
</html>