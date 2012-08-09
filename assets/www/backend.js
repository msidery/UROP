	var files;
	var captureDevice;
	var server = "http://146.169.24.96/urop/";
    var fs;
    var dreader;
	
    function initBackend() {
	
		
		/* Get capture device object used to record, take pictures */
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                                 //success callback
                                 function (filesystem){
                                    console.log(filesystem.root.fullPath);
                                    fs = filesystem;
                                    dreader = fs.root.createReader();
                                 },
                                 //fail callback
                                 function (error) {
                                    console.log('Error in getting file system!');
                                 });
        
		captureDevice = navigator.device.capture;
		files = new Array();
	}


	/* Success and error callback function for reading from sd card */
	function onSuccessRead(entries) {
		console.log("success reading entries in directory entry");
		
		//can do whatever here
	
	}
	
	function onErrorRead() {
		console.log("error reading entries in directory entry");
	}
	
	/* 
	 * Functions used to capture sound, image and video 
	 * They are triggered by the audio, video and image buttons
	 */
	function captureAudio() {
		captureDevice.captureAudio(onAudioSuccess, onError, {limit: 1});
	}
	
	function takePicture() {
		captureDevice.captureImage(onPhotoSuccess, onError, {limit: 1});
	}
	
	function takeVideo() {
		captureDevice.captureVideo(onVideoSuccess, onError, {limit: 1});
	}
	
	/* 
	 * Functions used to play audio, video and view images
	 * They are triggered by selecting the items in the database search view 
	 */
	function playVideo( url ) {
		window.plugins.videoPlayer.play(url);
	}
	
	function playAudio( url ) {
		var audioFile = new Media(url,
			//success callback
			function() {
				console.log("playAudio():Audio Success");
			},
			//error callback
			function(err) {
				console.log("playAudio():Audio Errror "+err);
			});
			
		audioFile.play();
	}
	
	function showImage( url ) {
		$("#picture").attr('src', url);
		$('#commentwrapper').css('display', 'none');
	}
	
	/* 
	 * Success callbacks for video, audio and photo
	 * If the recording was successful then the item is added to the database
	 */
	
	function onVideoSuccess(mediaFiles) {
		var type = "video";
		var time = getTimestamp();
		var i, path, len;
   		
   		for(i = 0, len = mediaFiles.length; i < len; i += 1) {
    		path = mediaFiles[i].fullPath;
    		
    		$('#links').append('<a data-role="button" data-theme="a" data-mini="true" onclick="showViewUI(\''+path+'\')">Video</a>').trigger('create');
    		files[files.length] = path;
    		    	
    	}
	}
	
	function onPhotoSuccess(mediaFiles) {
		var type = "photo";
		var i, path, len;
   		
   		for(i = 0, len = mediaFiles.length; i < len; i += 1) {
    		path = mediaFiles[i].fullPath;
            alert(path);
            //alert(window.rootFS.fullPath);
    		var id = mediaFiles[i].name.split('.');
    		id[0] = "a" + id[0];
    		console.log("id : " + id[0]);
    		$('#links').append('<a id="' +id[0]+ '" data-role="button" data-theme="a" data-mini="true" onclick="showViewUI(\''+path+'\')">Photo</a>').trigger('create');
    		files[files.length] = path;
    		
    	}
	}
	
	function onAudioSuccess(mediaFiles) {
		var type = "audio";
		var i, path, len;
   		
   		for(i = 0, len = mediaFiles.length; i < len; i += 1) {
    		path = mediaFiles[i].fullPath;
    		
    		$('#links').append('<a data-role="button" data-theme="a" data-mini="true" onclick="showViewUI(\''+path+'\')">Audio</a>').trigger('create');
    		files[files.length] = path;
    		
    	} 
	}
		
	/* 
	 * Function used to customize the behaviour of the search field of the list
	 */
		
	function onError(error) {
    	alert('code: ' + error.code + '\n'
  		+ 'message: ' + error.message + '\n');
	}

	
	function upload(id) {
	
		var upload_form_data = new Object();
		var upload_comments_data = new Object();
		
		var options = new FileUploadOptions();
		var params = new Object();
		var ft = new FileTransfer();
		alert(id);
		
		selectData('SELECT * FROM session WHERE sessionID='+id,
				   function (tx, results) {
					
				   for(var i = 0; i < results.rows.length; i++) {
						var item = results.rows.item(i);
				   
						upload_form_data.name_r = item.fname;
						console.log('Check if upload_form_data is undefined for some reason '+upload_form_data.name_r);
						upload_form_data.name_e = item.lname;
						upload_form_data.year = item.subject;
						upload_form_data.title = item.module;
						upload_form_data.date = item.date;
				   
						uploadSessionData(upload_form_data);
				   }
				   },
				   'Failure to upload session data');
		
		selectData('SELECT * FROM comment WHERE sessionID='+id,
				   function (tx, results) {
						
					   upload_comments_data.session = id;
					   
					   for(var i = 0; i < results.rows.length; i++) {
						   var item = results.rows.item(i);
						   
						   upload_comments_data.id = item.commentID;
						   upload_comments_data.timestamp = item.timestamp;
						   upload_comments_data.category = item.cat1;
						   upload_comments_data.type = item.cat2;
						   upload_comments_data.data = item.comment;
						   
						   uploadComments(upload_comments_data);
					   }
				   },
				   'Failure to upload comments for session id '+id);
		
		selectData('SELECT * FROM photo WHERE sessionID='+id,
				   function (tx, results) {
					   params.session = id;
					   
					   for(var i = 0; i < results.rows.length; i++) {
						   var item = results.rows.item(i);
						   params.comments = item.commentID;
						   
						   uploadPhoto(item.file, options, params, ft);
					   }
				   },
				   'Failure to upload photos');
		
		selectData('SELECT * FROM audio WHERE sessionID='+id,
				   function (tx, results) {
					   params.session = id;
					   
					   for (var i = 0; i < results.rows.length; i++) {
						   var item = results.rows.item(i);
						   params.comment = item.commentID;
						   
						   uploadAudio(item.file, options, params, ft);
					   }
				   },
				   'Failure to upload audio');
		
		selectData('SELECT * FROM video WHERE sessionID='+id,
				   function (tx, results) {
					   params.session = id;
				   
					   for(var i = 0; i < results.rows.length; i++) {
						   var item = results.rows.item(i);
						   params.comment = item.commentID;
						   
						   uploadVideo(item.file, options, params, ft);
					   }
				   },
				   'Failure to upload video');
	}

	
	/*
	 * Customized function for uploading video, audio and photo 
	 * to the remote server
	 */
	function uploadVideo(path, options, params, transfer) {
		options.fileName = path.substr(path.lastIndexOf('/')+1);
		options.mimeType = "video/mpeg";
		options.chunkedMode = "false";
		options.params = params;
		
		transfer.upload(path, server+"upload.php", uploadSuccess, uploadError, options);
	}
	
	function uploadAudio(path, options, params, transfer) {
		options.fileName = path.substr(path.lastIndexOf('/')+1);
		options.mimeType = "audio";
		options.params = params;
	
		transfer.upload(path, server+"upload.php", uploadSuccess, uploadError, options);
	}
	
	function uploadPhoto(path, options, params, transfer) {
		options.fileName = path.substr(path.lastIndexOf('/')+1);
		options.mimeType = "jpeg";
		options.chunckedMode = "false";
		options.params = params;
		alert('i get here');
		transfer.upload(path, server+"upload.php", uploadSuccess, uploadError, options);
	}
	
	function uploadSessionData(upload_data) {
		$.ajax({
			type: 'POST',
			data: upload_data,
			url: server+'upload_form.php',
			success: function(data) {
				console.log(data);
				alert('Your info was successfully added!')
			},
			error: function() {
				console.log(data);
				alert('There was an error addding your info!');
			}
		});
	}
	
	function uploadComments(upload_data) {
		$.ajax({
			type: 'POST',
			data: upload_data,
			url: server+'upload_comments.php',
			success: function(data) {
				//console.log(data);
				//alert('Your info was successfully added!')
			},
			error: function() {
				console.log(data);
				alert('There was an error addding your info!');
			}
		});
	}
	
	function downloadPhysicalFiles(urls, filePaths) {
		
		var ft = new FileTransfer();
		
		for(var i = 0; i < urls.length; i++) {
			ft.download(urls[i], filePaths[i], 
				function () {
					//alert('success in downloading')
			})
		}
	}
	
	function downloadSessionData() {
		$.ajax({
		   url: server+'download_session.php',
		   dataType: 'json',
		   success: function(response) {
			   alert("success");
			   var item;
			   var date;
			   //var prevdate;
			   
			   for(var i = 0; i < response.length; i++) {
			   
			   item = response[i];
			   console.log(item.id);
			   date = item.date;
			   
			   //var list = '<li data-role="list-divider">'+date+'<span class="ui-li-count">2</span></li>';
			   var list = '<li><a href="#" onclick="downloadData('+item.id+');">';
			   list += '<h3>'+item.name_r+' '+item.name_e+'</h3>';
			   list += '<p><strong>'+item.title+'</strong></p>';
			   list += '<p class="ui-li-aside"><strong>'+item.id+'</strong></p>';
			   list += '</a></li>';
			   
			   $('ul').append(list);
			   $('ul').listview('refresh');
			   
			   }
		   }
		});
	}



	function downloadData(id) {
		
		var postData = new Object();
		postData.id = id;
		alert(postData.id);
		
		$.ajax({
			url: server+'download.php',
			dataType: 'json',
			error: function(xhr, error) {
			   alert(xhr.status);
			},
			success: function(response) {
				
			    alert("success");
				var db_data1 = new Array();
				var db_data2 = new Array();
				var db_data3 = new Array();
				
				var i;
                var urls = new Array();
                var filePaths = new Array();
				
				for(i = 0; i < response['session'].length; i++) {
					//setup data for insertion into session table	
					db_data1[i] = new Array();
					db_data1[i] = new Array();
					db_data1[i] = new Array();
					db_data1[i] = new Array();
					db_data1[i] = new Array();
					db_data1[i] = new Array();
				}
				
				for(i = 0; i < response['session'].length; i++) {
					//setup data for insertion into session table	
					db_data1[i][0] = response['session'][i].id;
					db_data1[i][1] = '"' + getDate() + '"';
					db_data1[i][2] = '"' + response['session'][i].name_r + '"';
					db_data1[i][3] = '"' + response['session'][i].name_e + '"';
					db_data1[i][4] = '"' + response['session'][i].year + '"';
					db_data1[i][5] = '"' + response['session'][i].title + '"';
					//alert("set all the values for session");
				}
				
				

				for(i = 0; i < response['comments'].length; i++) {
					//setup data for insertion into session table	
					db_data2[i] = new Array();
					db_data2[i] = new Array();
					db_data2[i] = new Array();
					db_data2[i] = new Array();
					db_data2[i] = new Array();
					db_data2[i] = new Array();
				}
				
				for(i = 0; i < response['comments'].length; i++) {
					//setup data for insertion into comments table	
					db_data2[i][0] = response['comments'][i].session_no;
					db_data2[i][1] = response['comments'][i].comment_id;
					db_data2[i][2] = '"' + response['comments'][i].timestamp + '"';
					db_data2[i][3] = '"' + response['comments'][i].category + '"';
					db_data2[i][4] = '"' + response['comments'][i].type + '"';
					db_data2[i][5] = '"' + response['comments'][i].comment + '"';
				}
				
				
				
				for(i = 0; i < response['files'].length; i++) {
					//setup data for insertion into session table	
					db_data3[i] = new Array();
					db_data3[i] = new Array();
					db_data3[i] = new Array();
				}
				
				for(i = 0; i < response['files'].length; i++) {
	
					urls[i] = server + response['files'][i].path;
					filePaths[i] = fs.root.fullPath+'/'+i+'.jpg';
					
					//setup data for insertion into session table	
					db_data3[i][0] = response['files'][i].session_id;
					db_data3[i][1] = response['files'][i].comment_id;
					db_data3[i][2] = '"' + filePaths[i] + '"';
				}
				
                insertMultipleData('session', db_data1);
                insertMultipleData('comment', db_data2);
				insertMultipleData('photo', db_data3);
                downloadPhysicalFiles(urls, filePaths);
				
			}
		});
		//callback();
	}
	
	/*
	 * Success and error callback functions for the file upload
	 */
	function uploadSuccess(r) {
		console.log("Code = " + r.responseCode);
		console.log("Respons = " + r.response);
		console.log("Sent = " + r.bytesSent);
	}
	
	function uploadError(error) {
		console.log("An error has occurred: Code = " + error.code);
		console.log("upload error source " + error.source);
		console.log("upload error target " + error.target)
	}