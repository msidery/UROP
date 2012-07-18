var captureDevice;
    var sql;
    var id = 0;
	/** Add device ready event that will be triggered when library is loaded */
   	document.addEventListener("deviceready", onDeviceReady, false);
    
    $("#database").listview('option', 'filterCalback', searchDB) 
        
    /** Called when phonegap javascript is loaded */
    function onDeviceReady() {
        	
   		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
   		window.resolveLocalFileSystemURI("file:///mnt/sdcard", onResolveSuccess, fail);
   		
   		var element = document.getElementById('deviceProperties');
        	
    	element.innerHTML = '<ul data-role="listview"><li>Device Name: ' + device.name + '</li>' +
        					'<li>Device Cordova: ' + device.cordova + '</li>' +
        					'<li>Device Platforms: ' + device.platform + '</li>' +
        					'<li>Device UUID: ' + device.uuid + '</li></ul>'; 
     	
		captureDevice = navigator.device.capture;
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
		db.transaction(populateDB, errorCB, successCB);
		
		
	}
	/* If filesystem is retrieved succesfully */
	function onFileSystemSuccess(fileSystem) {
		console.log(fileSystem.name);
		console.log(fileSystem.root.name);
	}
	
	/* if something goes wrong while retrieving filesystem */
	function fail(evt) {
		console.log(evt.target.error.code);
	}
	
	/* if the URI is resolved succesfully create a directory reader to list the contents */
	function onResolveSuccess(fileEntry) {
		var directoryReader = fileEntry.createReader();
		directoryReader.readEntries(onSuccessRead, onErrorRead);
	}
	
	/* read the entries and update the html */
	function onSuccessRead(entries) {
		var str = "";
		
		for (var i = 0; i < entries.length; i++) {
			if(entries[i].name == "recording-2031062751.3gpp") {
				
				entries[i].remove(
					//success callback
					function() {
					console.log("Removal succeded");
				}, 
					//error callback
					function () {
					console.log("Removal failed");
				});
				
			} else {
				str = str + "<li>" + entries[i].name + "</li>";	
			}
				
			
		}
		
		$("#list").html(str)
	}
	
	/* error reading from folder */
	function onErrorRead() {
		console.log("error reading entries in directory entry");
	}
	
	/* generate a timestamp for each file */
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
	
	/* initialize database */
	function populateDB(tx) {
		tx.executeSql('DROP TABLE IF EXISTS Demo');
		tx.executeSql('CREATE TABLE IF NOT EXISTS Demo (id INTEGER PRIMARY KEY, timestamp, data, tags)');	
	}
	
	/* database error */
	function errorCB(err) {
		console.log("Error processing SQL: " + err.message);
	}
	
	/* database transaction success */
	function successCB() {
		alert("success on database transaction");
	}
	
	/* capture audio -- not working */
	function captureAudio() {
		captureDevice.captureAudio(onAudioSuccess, onError, {limit: 1});
	}
	
	function takePicture() {
		captureDevice.captureImage(onPhotoSuccess, onError, {limit: 1});
	}
	
	function takeVideo() {
		captureDevice.captureVideo(onVideoSuccess, onError, {limit: 1});
	}
	
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
	}
	
	function onVideoSuccess(mediaFiles) {
		var time = getTimestamp();
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
		var i, path, len;
    	
    	var p1 = document.getElementById('videoPath');
   		
   		for(i = 0, len = mediaFiles.length; i < len; i += 1) {
    		path = mediaFiles[i].fullPath;
    		p1.innerHTML = path + '<br />';
    		sql = 'INSERT INTO Demo (timestamp, data, tags) VALUES (' 
    									+ '"' + time + '"' + ','
    									+ '"' + path + '"' + ','+ '"video")';
    		db.transaction(function(tx){
    			
    					tx.executeSql(sql);
    					
    		 				}, errorCB, successCB);    	
    	}
	}
	
	function insert() {
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
		
		sql = 'INSERT INTO Demo (timestamp, data, tags) VALUES (1, "something", "something_else")';
		db.transaction(function(tx){
    			
    					tx.executeSql(sql);
    					
    		 				}, errorCB, successCB);
	}
	
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
								
								if(item.tags == "video") {
									htmlStr = htmlStr + 
												"<li onclick=\"playVideo('"+item.data+"');\" " +
												'data-filtertext="'+item.tags+'">' + 
												'<a href="#">';
								}
								else if(item.tags == "audio" ) {
									htmlStr = htmlStr + 
												"<li onclick=\"playAudio('"+item.data+"');\" " +
												'data-filtertext="'+item.tags+'">' + 
												'<a href="#">';
								}
								else if(item.tags == "photo" ) {
									console.log("added link and function to photo");
									htmlStr = htmlStr + 
												"<li onclick=\"showImage('"+item.data+"');\" " + 
												'data-filtertext="'+item.tags+'">' +
												'<a href="#four">' ;
								}
								else {
									htmlStr = htmlStr + "<li" + 'data-filtertext="'+item.tags+'">';
								}
								
								htmlStr = htmlStr + '<p class="ui-li-aside"><strong>'+
									item.timestamp+'</strong></p><h3>'+
									item.data+'</h3><p><strong>'+
									item.id+'</strong></p><p>'+
									item.tags+'</p></a></li>';
													
							}
							
							$("#database").html(htmlStr);
							$("#database").listview('refresh');									
																					
						}, errorCB);
			}, errorCB, successCB);
	}
	
	function searchDB(text, searchValue) {
			return text.toLowerCase().indexOf(searchValue) == -1; 
	};
		
	function onPhotoSuccess(mediaFiles) {
		
		var time = getTimestamp();
		console.log(time);
		var i, path, len;
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
    	
    	var p2 = document.getElementById('imagePath');
   		
   		for(i = 0, len = mediaFiles.length; i < len; i += 1) {
    		path = mediaFiles[i].fullPath;
    		p2.innerHTML = path + '<br />';
    		sql = 'INSERT INTO Demo (timestamp, data, tags) VALUES (' 
    									+ '"' + time  + '"' + ','
    									+ '"' + path + '"' + ','+ '"photo")';
    		db.transaction(function(tx){
    			
    					tx.executeSql(sql);
    					
    		 				}, errorCB, successCB);
    	}
	}
	
	function onAudioSuccess(mediaFiles) {
		var time = getTimestamp();
		console.log(time);
		var i, path, len;
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
    	
    	var p2 = document.getElementById('imagePath');
   		
   		for(i = 0, len = mediaFiles.length; i < len; i += 1) {
    		path = mediaFiles[i].fullPath;
    		p2.innerHTML = path + '<br />';
    		sql = 'INSERT INTO Demo (timestamp, data, tags) VALUES (' 
    									+ '"' + time  + '"' + ','
    									+ '"' + path + '"' + ','+ '"audio")';
    		db.transaction(function(tx){
    			
    					tx.executeSql(sql);
    					
    		 				}, errorCB, successCB);
    	} 
	}
	
	function onError(error) {
    	alert('code: ' + error.code + '\n'
  		+ 'message: ' + error.message + '\n');
	}
	
	function uploadFiles() {
		
		//open database
		var db = window.openDatabase("test", "1.0", "Test DB", 1000000);
		//go through it and upload each file
		var options = new FileUploadOptions();
		var ft = new FileTransfer();
		
		db.transaction(
			//function sql statements
			function(tx){
				tx.executeSql('SELECT * FROM Demo', [], 
						function(tx, results) {
							for(var i = 0; i < results.rows.length; i++) {
								var item = results.rows.item(i);
								
								if(item.tags == "video") {
									uploadVideo(item.data, options, ft);
								}
								else if(item.tags == "audio" ) {
									uploadAudio(item.data, options, ft);
								}
								else if(item.tags == "photo" ) {
									uploadPhoto(item.data, options, ft);
								}
								else {
									console.log("nothing to upload");
								}
							}
						}, errorCB);
			}, errorCB, successCB);
	}
	
	function uploadVideo(path, options, transfer) {
		options.fileName = "video";
		options.mimeType = "video/mpeg";
		
		transfer.upload(path, "http://146.169.24.110/urop/upload.php", uploadSuccess, uploadError, options);
	}
	
	function uploadAudio(path, options, transfer) {
		options.fileName = "audio";
	
		transfer.upload(path, "http://146.169.24.110/urop/upload.php", uploadSuccess, uploadError, options);
	}
	
	function uploadPhoto(path, options, transfer) {
		options.fileName = path.substr(path.lastIndexOf('/')+1);
		options.mimeType = "jpeg";
		options.chunckedMode = "false";
		
		transfer.upload(path, "http://146.169.24.110/urop/upload.php", uploadSuccess, uploadError, options);
	}
	
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
