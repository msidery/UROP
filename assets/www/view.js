function initViewUI() {
	var body = '<img id="picture" style="float:center;"></img>';
	body += '<div data-role="controlgroup" data-type="horizontal" >'
	body += '<a id="delete" data-role="button" data-theme="a" >Delete</a>';
	body += '<a id="viewback" data-role="button" data-theme="a" >Back</a>';
	body += '</div>';
	$('#viewwrapper').html(body).trigger('create');
	
	$('#delete').bind('click', function() {
		deletePhoto($('#picture').attr('src'));
	});
	
	$('#viewback').bind('click', function() {
		showCommentUI();
	});
	
	$('#picture').css('height', height-$('#delete').height()-3+'px');
	$('#picture').css('width', width+'px');
	$('#delete').css('width', width/2-1+'px');
	$('#viewback').css('width', width/2-1+'px');
}

function showViewUI(url) {
	$("#picture").attr('src', url);
	$('.wrapper').css('display', 'none');
	$('#viewwrapper').css('display', 'block');
}
