function initListCommentsUI() {
	var top = '<div data-role = "header" id="topbar" class="ui-body ui-body-a">';
	top += '<a id="back1" data-role="button" data-inline="true" data-icon="arrow-l" data-mini="true" >Back</a>';
	top += '<span id="sessiontitle"></span>';
	top += '</div>';
	
	$('#back1').bind('click', function() {
		showHomeUI();
	});
	
	$('#listwrapper').html(top).trigger('create');

}

function setupList() {
}

function showListCommentsUI(sessionID) {
	$('.wrapper').css('display', 'none');
	$('#listwrapper').css('display', 'block');
	
	selectData('SELECT * FROM comment WHERE sessionID='+sessionID+' ORDER BY commentID DESC',
		function(tx, results) {
			var body = '<div>';
			for (var i = 0; i < results.rows.length; i++) {
				console.log(results.rows.item(i).comment);
				body += results.rows.item(i).comment+'<br/>';
				
			}
			console.log('inside function '+results.rows.length);
			body += 'TEST';
			body += '</div>';
			
			$('#listwrapper').append(body);
		},
		'Failed to retrieve comment!'
	);
	
	window.resolveLocalFileSystemURI("file:///mnt/sdcard", 
   			//success callback
   			function(fileEntry) {
   				var directoryReader = fileEntry.createReader();
   				directoryReader.readEntries(
   					//success read
   					function (entries){
   						for(var i; i < entries.length; i++) {
   							console.log(entries[i].name);
   						}
   					},
   					
   					function (error){
   						alert("Failed reading directory");
   					});
   			},
   			//error callback
   			function(event) {
   				console.log(evt.target.error.code);
   			});
}
