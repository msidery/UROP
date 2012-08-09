function initListCommentsUI() {
    
	var top = '<div data-role = "header" id="topbar" class="ui-body ui-body-a">';
	top += '<a id="back1" data-role="button" data-inline="true" data-icon="arrow-l" data-mini="true" >Back</a>';
	top += '<span id="sessiontitle"></span>';
	top += '</div>';
	top += '<div id="submenu" data-role="controlgroup" data-type="horizontal">';
	top += '<a data-role="button" data-theme="b">INFO</a>';
	top += '<a data-role="button" data-theme="b">FEEDBACK</a>';
	top += '<a data-role="button" data-theme="b">SEND</a>';
	top += '</div>';
	top += '<div id="body"></div>';
			
	var bottom = '<div data-position="fixed" data-role="footer" id="bottombar" class="ui-body ui-body-a">';
	
	bottom += '<a id="export" data-role="button" data-inline="true">Export</a>';
	bottom += '<a id="delete" data-role="button" data-inline="true">Delete Session</a>';
	bottom += '</div>';
	
	$('#listcommentwrapper').html(top+bottom).trigger('create');
    $('#back1').bind('click', function() {
                     showHomeUI();
                     });
	$('#submenu').css('width', "300px");
	$('#submenu').css('margin', "auto");
   
	
}

function setupList() {
}

function showListCommentsUI(sessionID) {
	$('#body').html('');
	$('.wrapper').css('display', 'none');
	$('#listcommentwrapper').css('display', 'block');
	
	alert("called showListCommentUI");
	selectData('SELECT * FROM comment WHERE sessionID='+sessionID+' ORDER BY commentID DESC',
		function(tx, results) {
			
			var body = '<div class="newcomment">';
			body += '<a href="" onclick="gotoCommentUI()" class="newtag">New Comment</a>';
			body += '</div>';
			   
			for (var i = 0; i < results.rows.length; i++) {
				console.log(results.rows.item(i).comment);
			   var item = results.rows.item(i);
				
				body += '<div class="commentdiv">';
				body += '<div id="" class="commenttype positive"></div>';
				body += '<div class="commentbody">';
				body += '<a id="" class="commenttext" >'+item.comment+'</a>';
			    body += '</div><br/></div><div>';
				body += '<div class="newcomment">';
				body += '<a href="" class="newtag">New Comment</a>'
				body += '</div>';
			   							
			}
			console.log('inside function '+results.rows.length);
			//body += '</div>';
               
			$('#body').html(body).trigger('create');
			//$('#listcommentwrapper').append(body).trigger('create');
		},
		'Failed to retrieve comment!'
	);
    
    selectData('SELECT * FROM photo WHERE sessionID='+sessionID+' ORDER BY commentID DESC',
       function(tx, results){
               console.log('in success method of query 2');
               var files = '<div>';
       
           for (var i = 0; i < results.rows.length; i++) {
                var path = results.rows.item(i).file;
                var name = path.substr(path.lastIndexOf('/')+1);
                console.log(path);
                files += name+'</br>';
           }
           files += '</div>';
           
           $('#listcommentwrapper').append(files);
           
       },
       'Failed to retrieve photos!'
    );
	
	$('.commenttext').bind('click', function() {
						   gotoCommentUI();
						   //$('#frame').attr('src', '/urop/content/overview/viewcomment.php?session_id=<?php echo $vars[0]; ?>&comment_id='+$(this).attr('id').substring(7));
						   //$('.delete').css('display', 'none');
						   //$('#dialog').css('display', 'block');
						   // $('#dialog').html($(this).html());
						   });

    
}
