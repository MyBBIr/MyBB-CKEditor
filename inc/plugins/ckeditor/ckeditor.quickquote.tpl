<button style="display: none; float: right;" id="qr_pid_{$post['pid']}">{$lang->postbit_button_quote}</button>
<script type="text/javascript">
	$(document).ready(function() {
		quick_quote({$post['pid']},'{$post['username']}',{$post['dateline']});
	});
</script>