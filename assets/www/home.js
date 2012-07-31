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
	form += '<div id="controls" data-role="controlgroup" data-type="horizontal" width="'+width+'" style="clear:both;">';
	form += '<a id="listsession" data-role="button" >List</a>';
	form += '<a id="upload" data-role="button" >Upload</a>';
	form += '<a id="download" data-role="button" >Download</a>';
	form += '</div>';
	//bind function to submit event for home screen form
		
	$('#homewrapper').html(form).trigger('create');
	
	$('#listsession').bind('click', function() {
		showListCommentsUI(document.getElementById('sessiontext').value);
	});
	
	$('#download').bind('click', function() {
	
		alert("pressed download button");
		downloadData(function (){
			alert("Finished downloading data");
		});		
	});
	
	$('#upload').bind('click', function() {
		var id = document.getElementById('sessiontext').value;
		var options = new FileUploadOptions();
		var params = new Object();
		var ft = new FileTransfer();
		alert(id);
		
		selectData('SELECT * FROM session WHERE sessionID='+id,
			function(tx, results) {
				var postData = new Object();
				postData.session = id;
				
				var item = results.rows.item;
				
				postData.date = item.date
				postData.name_r = item.fname;
				postData.name_e = item.lname;
				postData.year = item.subject;
				postData.title = item.module;
				
				uploadSessionData(postData);
				
				
			}, "failure!");
		
		
		selectData('SELECT * FROM photo WHERE sessionID='+id,
			function(tx, results) {
				params.session = id;
				
				for (var i = 0; i < results.rows.length; i++) {
					var item = results.rows.item(i);
					params.comment = item.commentID;
					
					uploadPhoto(item.file, options, params, ft);
				}
			}, 'error uploading photo');
		
		selectData('SELECT * FROM video WHERE sessionID='+id,
			function(tx, results) {
				params.session = id;
				
				for (var i = 0; i < results.rows.length; i++) {
					var item = results.rows.item(i);
					params.comment = item.commentID;
					
					uploadVideo(item.file, options, params, ft);
				}
			}, 'error uploading video');
			
		selectData('SELECT * FROM audio WHERE sessionID='+id,
			function(tx, results) {
				params.session = id;
				
				for (var i = 0; i < results.rows.length; i++) {
					var item = results.rows.item(i);
					params.comment = item.commentID;
					
					uploadPhoto(item.file, options, params, ft);
				}
			}, 'error uploading audio'); 
		
		selectData('SELECT * FROM comment WHERE sessionID='+id,
			
			function(tx, results) {
				
				var postData = new Object();
				postData.session = id;
				
				for(var i = 0; i < results.rows.length; i++) {
					var item = results.rows.item(i);
					
					postData.id = item.commentID;
					postData.timestamp = item.timestamp;
					postData.category = item.cat1;
					postData.type = item.cat2;
					postData.data = item.comment;
					
					uploadComments(postData);					
				}	
				
			}, "error uploading comments");
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