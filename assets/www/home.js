function showHomeUI() {
	$('.wrapper').css('display', 'none');
	$('#homewrapper').css('display', 'block');
	$('input').val('');
}

function initHomeUI () {
	setupHomeUI();
}

function setupHomeUI () {
	var form = '<form action="javascript:gotoCommentUI()" >';
	form += '<input id="fname" type="text" placeholder="First name" />';
	form += '<input id="lname" type="text" placeholder="Surname" />';
	form += '<input id="subject" type="text" placeholder="Subject" />';
	form += '<input id="module" type="text" placeholder="Module" />';
	form += '<input id="start" type="submit" data-inline="true" value="Start Session" data-role="button" data-theme="c" >';
	form += '</form>';
	form += '<textarea id="sessiontext"></textarea>';
	form += '<a id="listsession" data-role="button" >List</a>';
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