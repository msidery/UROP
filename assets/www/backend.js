	var files;
	
	var captureDevice;
	function initBackend() {
	
		
		/* Get capture device object used to record, take pictures */
		captureDevice = navigator.device.capture;
		files = new Array();
		/* set up database and populate it */
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
		db.transaction(populateDB, errorCB, successCB);		
	}


	/* Success and error callback function for reading from sd card */
	function onSuccessRead(entries) {
		console.log("success reading entries in directory entry");
		
		//can do whatever here
	
	}
	
	function onErrorRead() {
		console.log("error reading entries in directory entry");
	}
	
	/* Get timestamp to apply to each recording */
	function getTimestamp() {
		var d, s = "";
		var c = ":";
		d = new Date();
		s += d.getHours() + c;
		s += d.getMinutes() + c;
		s += d.getSeconds() + c;
		s += d.getMilliseconds();
		
		return s;
	}
	
	/* Function to initialize database */
	function populateDB(tx) {
		tx.executeSql('DROP TABLE IF EXISTS Demo');
		tx.executeSql('CREATE TABLE IF NOT EXISTS Demo (id INTEGER PRIMARY KEY, path, type, timestamp, uploaded, tags, linked)');	
	}
	
	/* Success and error callback functions for database operations */
	function errorCB(err) {
		console.log("Error processing SQL: " + err.message);
	}
	
	function successCB() {
		alert("success on database transaction");
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
	
	function insertElement(path, type, timestamp, uploaded, tags, linked) {
		
		var sql = 'INSERT INTO Demo (path, type, timestamp, uploaded, tags, linked) VALUES (' 
    									+ '"' + path + '"' + ','
    									+ '"' + type + '"' + ','
    									+ '"' + timestamp + '"' + ',' 
    									+ uploaded + ',' 
    									+ '"' + tags + '"' + ',' 
    									+ linked + ')';
		return sql; 
	}
	
	function onVideoSuccess(mediaFiles) {
		var type = "video";
		var time = getTimestamp();
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
		var i, path, len;
   		
   		for(i = 0, len = mediaFiles.length; i < len; i += 1) {
    		path = mediaFiles[i].fullPath;
    		sql = insertElement(path, type, time, 0, null, 0);
    		
    		$('#links').append('<a data-role="button" data-theme="a" data-mini="true" onclick="showViewUI(\''+path+'\')">Video</a>').trigger('create');
    		files[files.length] = path;
    		
    		db.transaction(function(tx){
    					tx.executeSql(sql);
    		 				}, errorCB, successCB);    	
    	}
	}
	
	function onPhotoSuccess(mediaFiles) {
		var type = "photo";
		var time = getTimestamp();
		console.log(time);
		var i, path, len;
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
   		
   		for(i = 0, len = mediaFiles.length; i < len; i += 1) {
    		path = mediaFiles[i].fullPath;
    		sql = insertElement(path, type, time, 0, null, 0);
    		
    		$('#links').append('<a data-role="button" data-theme="a" data-mini="true" onclick="showViewUI(\''+path+'\')">Photo</a>').trigger('create');
    		files[files.length] = path;
    		
    		db.transaction(function(tx){
    					tx.executeSql(sql);
    		 				}, errorCB, successCB);
    	}
	}
	
	function onAudioSuccess(mediaFiles) {
		var type = "audio";
		var time = getTimestamp();
		console.log(time);
		var i, path, len;
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
   		
   		for(i = 0, len = mediaFiles.length; i < len; i += 1) {
    		path = mediaFiles[i].fullPath;
    		sql = insertElement(path, type, time, 0, null, 0);
    		
    		$('#links').append('<a data-role="button" data-theme="a" data-mini="true" onclick="showViewUI(\''+path+'\')">Audio</a>').trigger('create');
    		files[files.lenght] = path;
    		
    		db.transaction(function(tx){
    					tx.executeSql(sql);
    		 				}, errorCB, successCB);
    	} 
	}
	
	/* 
	 * Auxiliary function for adding information into the database
	 */
	/*function insert() {
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
		
		sql = 'INSERT INTO Demo (timestamp, data, tags, uploaded) VALUES (1, "something", "something_else", 0)';
		db.transaction(function(tx){
    			
    					tx.executeSql(sql);
    					
    		 				}, errorCB, successCB);
	}*/
	
	/* 
	 * Function for listing the contents of the database
	 * The contents are listed as a searchable list
	 * The search is done by the tag element, this function is triggered
	 * if the Search Database button is pressed 
	 */
	function list_db() {
		
		var database = document.getElementById("database");
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
		db.transaction(
			//function sql statements
			function(tx){
				tx.executeSql('SELECT * FROM Demo', [], 
						function(tx, results) {
							var htmlStr = "";
							for(var i = 0; i < results.rows.length; i++) {
								var item = results.rows.item(i);
								
								if(item.type == "video") {
									htmlStr = htmlStr + 
												"<li onclick=\"playVideo('"+item.path+"');\" " +
												'data-filtertext="'+item.tags+'">' + 
												'<a href="#">';
								}
								else if(item.type == "audio" ) {
									htmlStr = htmlStr + 
												"<li onclick=\"playAudio('"+item.path+"');\" " +
												'data-filtertext="'+item.tags+'">' + 
												'<a href="#">';
								}
								else if(item.type == "photo" ) {
									console.log("added link and function to photo");
									htmlStr = htmlStr + 
												"<li onclick=\"showImage('"+item.path+"');\" " + 
												'data-filtertext="'+item.tags+'">' +
												'<a href="#four">' ;
								}
								else {
									htmlStr = htmlStr + "<li" + 'data-filtertext="'+item.tags+'">';
								}
								
								htmlStr = htmlStr + '<p class="ui-li-aside"><strong>'+
									item.timestamp+'</strong></p><h3>'+
									item.path+'</h3><p><strong>'+
									item.id+'</strong></p><p>'+
									item.tags+'</p></a></li>';
													
							}
							
							$("#database").html(htmlStr);
							$("#database").listview('refresh');									
																					
						}, errorCB);
			}, errorCB, successCB);
	}
	
	/* 
	 * Function used to customize the behaviour of the search field of the list
	 */
	function searchDB(text, searchValue) {
			return text.toLowerCase().indexOf(searchValue) == -1; 
	};
		
	function onError(error) {
    	alert('code: ' + error.code + '\n'
  		+ 'message: ' + error.message + '\n');
	}

	/* 
	 * Used to upload files to the remote server. 
	 * Selects all elements in the database and uploads them onto the server
	 * Needs to be modified to only upload those that have to be uploaded
	 */	
	function uploadFiles() {
		
		//open database
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
		//go through it and upload each file
		var options = new FileUploadOptions();
		var ft = new FileTransfer();
		
		db.transaction(
			//function sql statements
			function(tx){
				tx.executeSql('SELECT * FROM Demo WHERE uploaded=0', [], 
						function(tx, results) {
							for(var i = 0; i < results.rows.length; i++) {
								
								var item = results.rows.item(i);
								
								if(item.type == "video") {
									uploadVideo(item.path, options, ft);
								}
								else if(item.type == "audio" ) {
									uploadAudio(item.path, options, ft);
								}
								else if(item.type == "photo" ) {
									uploadPhoto(item.path, options, ft);
								}
								else {
									console.log("nothing to upload");
								}
							}
						}, errorCB);
			}, errorCB, successCB);
	}
	
	/*
	 * Customized function for uploading video, audio and photo 
	 * to the remote server
	 */
	function uploadVideo(path, options, transfer) {
		options.fileName = path.substr(path.lastIndexOf('/')+1);
		options.mimeType = "video/mpeg";
		options.chunkedMode = "false";
		
		transfer.upload(path, "http://146.169.24.110/urop/upload.php", uploadSuccess, uploadError, options);
	}
	
	function uploadAudio(path, options, transfer) {
		options.fileName = path.substr(path.lastIndexOf('/')+1);
	
		transfer.upload(path, "http://146.169.24.110/urop/upload.php", uploadSuccess, uploadError, options);
	}
	
	function uploadPhoto(path, options, transfer) {
		options.fileName = path.substr(path.lastIndexOf('/')+1);
		options.mimeType = "jpeg";
		options.chunckedMode = "false";
		
		transfer.upload(path, "http://146.169.24.110/urop/upload.php", uploadSuccess, uploadError, options);
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
	
	function see_recent() {
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
		var time = getTimestamp();

		db.transaction(
			//function sql statements
			function(tx){
				tx.executeSql('SELECT * FROM Demo WHERE linked<>1', [], 
						function(tx, results) {
							var htmlStr = "";
							for(var i = 0; i < results.rows.length; i++) {
								var item = results.rows.item(i);
								
								
								htmlStr = htmlStr + 
												"<li onclick=\"link_element('"+item.id+"');\" " +
												'data-filtertext="'+item.tags+'">' + 
												'<a href="#">';
								
								htmlStr = htmlStr + '<p class="ui-li-aside"><strong>'+
									item.timestamp+'</strong></p><h3>'+
									item.path+'</h3><p><strong>'+
									item.id+'</strong></p><p>'+
									item.tags+'</p></a></li>';
													
							}
							
							$("#recent_list").html(htmlStr);
							$("#recent_list").listview('refresh');									
																					
						}, errorCB);
			}, errorCB, successCB);
	}
	
	function link_element(id, tags) {
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
		
		db.transaction(
			//function sql statements
			function(tx){
				//need to set tags here as well
				tx.executeSql('UPDATE Demo SET linked=1 WHERE id=' + id);
				console.log("set linked to 1 for" + id);
				
			}, errorCB, successCB);
			
		//generate new tag
		if(tags != null) {
			var newtags = tags + "newtag";
		} else {
			var newtags = "newtag ";
		}
		
		db.transaction(
			function(tx) {
				tx.executeSql('UPDATE Demo SET tags="' + newtags + '" WHERE id=' + id);
				console.log("updated tags for" + id);
			}, errorCB, successCB);
	}