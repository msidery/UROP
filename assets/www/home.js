function showHomeUI() {
	$('.wrapper').css('display', 'none');
	$('#homewrapper').css('display', 'block');
	$('input').val('');
}

function initHomeUI () {
	setupHomeUI();
}

function setupHomeUI () {
	
	var top = '<div id="content" data-role="content"></div>';
	 
	var form = '<form action="javascript:gotoCommentUI()" method="post" enctype="multipart/form-data">';
	form += '<input id="fname" name="fname" type="text" placeholder="Observer Name" />';
	form += '<input id="lname" name="lname" type="text" placeholder="Observee Name" />';
	form += '<input id="subject" name="subject" type="text" placeholder="Year" />';
	form += '<input id="module" name="module" type="text" placeholder="Title" />';
	form += '<input id="start" name="start" type="submit" data-inline="true" value="Start Session" data-role="button" data-theme="c" >';
	form += '</form>';
	form += '<div id="controls" data-role="controlgroup" data-type="horizontal" width="'+width+'" style="clear:both;">';
	
	form += '<a id="uploadsession" data-role="button" >Upload Sessions</a>';
	form += '<a id="viewsession" data-role="button" >View Sessions</a>';
	form += '<a id="downloadsession" data-role="button" >Download Sessions</a>';
	form += '<a id="newsession" data-role="button" >New Session</a>';
	form += '</div>';
	//bind function to submit event for home screen form
	
	$('#content').html(form).trigger('create');
	$('#homewrapper').html(form).trigger('create');
	
	$('#viewsession').bind('click', function() {
						   showListSessionUI("view");
	});
	
	$('#downloadsession').bind('click', function() {
							   showListSessionUI("download");
	});
	
	$('#uploadsession').bind('click', function() {
							 showListSessionUI("upload");
	});
	
	$('#newsession').bind('click', function() {
						  $.mobile.changePage('#newsessionwrapper');
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