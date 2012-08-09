function initListViewUI() {
	
	var top = '<div data-role = "header" id="topbar" class="ui-body ui-body-a">';
	top += '<a id="back2" data-role="button" data-inline="true" data-icon="arrow-l" data-mini="true" >Back</a>';
	top += '<span id="sessiontitle"></span>';
	top += '</div>';
	top += '<div><ul data-role="listview" data-theme="d" data-divider-theme="d">';
	top += '</ul></div>';
		
	$('#listsessionwrapper').html(top).trigger('create');
    
	$('#back2').bind('click', function() {
                     showHomeUI();
                     });
	
}

function showListSessionUI(param) {
	$('ul').html('');
	$('.wrapper').css('display', 'none');
	$('#listsessionwrapper').css('display', 'block');
	
	//console.log("I get here first");
	if(param == "view" || param == "upload") {
		var call;
		//function to call on click is different if the call is for upload or download
		if(param == "view") {
			call = 'showListCommentsUI(';
		} else if(param == "upload") {
			call = 'upload(';
		}
		
		selectData('SELECT * FROM session',
				   function (tx, results) {
					   
					   
					   var item;
					   var date;
					   //var prevdate;
					   
					   for(var i = 0; i < results.rows.length; i++) {
						   
						   item = results.rows.item(i);
						   date = item.date;
						   
						   //var list = '<li data-role="list-divider">'+date+'<span class="ui-li-count">2</span></li>';
						   var list = '<li><a href="#" onclick="'+call+item.sessionID+');">';
						   list += '<h3>'+item.fname+' '+item.lname+'</h3>';
						   list += '<p><strong>'+item.module+'</strong></p>';
						   list += '<p class="ui-li-aside"><strong>'+item.sessionID+'</strong></p>';
						   list += '</a></li>';
							
						   $('ul').append(list);
						   $('ul').listview('refresh');
					   }
		   
			   
				   //$('#listwrapper').append(list).trigger('refresh');
				   
				   
				   
				   },
				   'Failed to select session data');
			
	
	}
	else if(param == "download") {
		//make call to server to return list of available sessions
		alert("i get called");
		downloadSessionData();
	}
		
	
}