function initViewUI() {
	var body = '<img id="picture" style="float:center;"></img>';
	body += '<a id="delete" data-role="button" data-theme="a" >Delete</a>';
	body += '<a id="viewback" data-role="button" data-theme="a" >Back</a>';
	$('#viewwrapper').html(body).trigger('create');
	
	$('#delete').bind('click', function() {
		var src = $("#picture").attr('src');
		window.resolveLocalFileSystemURI(src, 
			function(fileEntry) {
				//alert("success!" + src);
				fileEntry.remove( function(entry) {
									//alert("removal of successfull");
									$("picture").attr('src', "");
									deleteFromCommentUI(src);
									showCommentUI();								
								}, 
								  function(error) {
								  	alert("error removing file: " + error.code);
								  });
			}, 
			function(fileEntry) {
				alert("failed!");
			});
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
