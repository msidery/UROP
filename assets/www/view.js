function initViewUI() {
	var body = '<img id="picture" style="float:center;"></img>';
	body += '<a id="delete" data-role="button" data-theme="a" >Delete</a>';
	body += '<a id="viewback" data-role="button" data-theme="a" >Back</a>';
	$('#viewwrapper').html(body).trigger('create');
	
	$('#delete').bind('click', function() {
		
	});
	
	$('#viewback').bind('click', function() {
		showCommentUI();
	});
	
	$('#picture').css('height', height-2*($('#delete').height()+10)+'px');
	$('#picture').css('width', width+'px');
}

function showViewUI(url) {
	$("#picture").attr('src', url);
	$('.wrapper').css('display', 'none');
	$('#viewwrapper').css('display', 'block');
}
