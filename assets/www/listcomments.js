function initListCommentsUI() {
	
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
			$('#listwrapper').html(body).trigger('create');
		},
		'Failed to retrieve comment!'
	);
}
