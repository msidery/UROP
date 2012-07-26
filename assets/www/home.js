function showHomeUI() {
	$('.wrapper').css('display', 'none');
	$('#homewrapper').css('display', 'block');
	$('input').val('');
}

function initHomeUI () {
	setupHomeUI();
}

function setupHomeUI () {
	var form = '<form action="javascript:gotoCommentUI()" method="post" enctype="multipart/form-data">';
	form += '<input id="fname" name="fname" type="text" placeholder="Observer Name" />';
	form += '<input id="lname" name="lname" type="text" placeholder="Observee Name" />';
	form += '<input id="subject" name="subject" type="text" placeholder="Year" />';
	form += '<input id="module" name="module" type="text" placeholder="Title" />';
	form += '<input id="start" name="start" type="submit" data-inline="true" value="Start Session" data-role="button" data-theme="c" >';
	form += '</form>';
	form += '<textarea id="sessiontext"></textarea>';
	form += '<a id="listsession" data-role="button" >List</a>';
	//bind function to submit event for home screen form
	
	console.log($.support.cors);
	$('form').live('submit', function () {
		var postData = $(this).serialize();
			
		$.ajax({
			type: 'POST',
			data: postData,
			url: 'http://146.169.25.82/urop/upload_form.php',
			success: function(data) {
				console.log(data);
				alert('Your info was successfully added!')
			},
			error: function() {
				console.log(data);
				alert('There was an error addding your info!');
		}
		});
	});

	
	$('#homewrapper').html(form).trigger('create');
	
	$('#listsession').bind('click', function() {
		showListCommentsUI(document.getElementById('sessiontext').value);
	});
}

function gotoCommentUI() {
	selectData('SELECT * FROM session ORDER BY sessionID DESC',
			function(tx, results) {
				var data = new Array();
				
				if (results.rows.length == 0)
					data[0] = 0;
				else
					data[0] = results.rows.item(0).sessionID + 1;
				
				data[1] = getDate();
				data[2] = document.getElementById('fname').value;
				data[3] = document.getElementById('lname').value;
				data[4] = document.getElementById('subject').value;
				data[5] = document.getElementById('module').value;
				showCommentUI(data);
			},
			'Failed to get a session ID!'
	);
	



}