var width = window.innerWidth;
var height = window.innerHeight-2;

var numtabs = 4;

/* time for tab groups to slide along */
var slideSpeed = 500;
/* number of tabs in each tab group */
var tablengths;

/* amount each tab group has been moved */
var xmove; // top level tab
var ymove; // second level tabs
var zmove; // third level tabs

var sessionData;

function showCommentUI(data) {
	if (data != undefined) {
		sessionData = data;
		var dbData = new Array();
		dbData[0] = data[0];
		for (var i = 1; i < data.length; i++)
			dbData[i] = '"'+data[i]+'"';
		insertData('session', dbData);
	}
	$('.wrapper').css('display', 'none');
	$('#commentwrapper').css('display', 'block');
	$('#sessiontitle').text('Session: ' + sessionData);
}

/* setup the user interface */
function initCommentUI() {
	addOptions();
	createTabs();
	addCommentBindings();
	initDisplay();
	setupDimensions();
}

/* replace contents of the body of the page with a new UI */
function addOptions() {
	var top = '<div id="topbar" class="ui-body ui-body-a" width="'+width+'">';
	top += '<a id="back" data-role="button" data-inline="true" data-icon="arrow-l" data-mini="true" >back</a>';
	top += '<span id="sessiontitle"></span>';
	top += '</div>';
	var body = '<div id="tabs">';
	body += '</div>';
	// adds a textarea and buttons at the bottom of the page
	// for accepting the input and interacting with the camera
	body += '<div>';
	body += '<textarea id="text" rows="8" cols="30" placeholder="Extra comments" style="float:left;" ></textarea>';
	body += '<div id="links" data-role="controlgroup" style="border:1px solid #CCCCCC;float:right;" ></div>';
	body += '</div>';
	body += '<div id="camera" data-role="controlgroup" data-type="horizontal" width="'+width+'" style="clear:both;">';
	body += '<a id="enter" class="bottom_opt" data-inline="true" data-role="button" data-theme="c" >ENTER</a>';
	body += '<a id="photo" class="bottom_opt" data-inline="true" data-role="button" data-theme="a" onclick="takePicture()" >Photo</a>';
	body += '<a id="video" class="bottom_opt" data-inline="true" data-role="button" data-theme="a" onclick="takeVideo()" >Video</a>';
	body += '<a id="audio" class="bottom_opt" data-inline="true" data-role="button" data-theme="a" onclick="captureAudio()" >Audio</a>';
	body += '<a id="cancel" class="bottom_opt" data-inline="true" data-role="button" data-theme="c" >CANCEL</a>';
	body += '</div>';
	$('#commentwrapper').html(top+body).trigger('create');
}

/* create and add all the tabs to the ui from an xml file.
 * Format:
 * <div id="toplevel" class="sub">
 *     <div id="control" class="controlgroup">
 *         <a id="btn0" class="opt">value0</a>
 *         <a id="btn1" class="opt">value1</a>
 *         ...
 *     </div>
 *     <div id="subtab0" class="subtab sub">
 *         <div id="control0" class="control controlgroup">
 *             <a id="btn0-0" class="opt">value0-0</a>
 *             <a id="btn0-1" class="opt">value0-1</a>
 *             ...
 *         </div>
 *         <div id="subtab0-0" class="subtab sub">
 *             <div id="control0-0" class="control controlgroup">
 *                 <a id="btn0-0-0" class="opt">value0-0-0</a>
 *                 <a id="btn0-0-1" class="opt">value0-0-1</a>
 *                 ...
 *             </div>
 *         </div>
 *         <div id="subtab0-1" class="subtab sub">
 *             <div id="control0-1" class="control controlgroup">
 *                 <a id="btn0-1-0" class="opt">value0-1-0</a>
 *                 <a id="btn0-1-1" class="opt">value0-1-1</a>
 *                 ...
 *             </div>
 *         </div>
 *         ...
 *     </div>
 *     <div id="subtab1" class="subtab sub">
 *         <div id="control1" class="control controlgroup">
 *             <a id="btn1-0" class="opt">value1-0</a>
 *             <a id="btn1-1" class="opt">value1-1</a>
 *             ...
 *         </div>
 *         <div id="subtab1-0" class="subtab sub">
 *             <div id="control1-0" class="control controlgroup">
 *                 <a id="btn1-0-0" class="opt">value1-0-0</a>
 *                 <a id="btn1-0-1" class="opt">value1-0-1</a>
 *                 ...
 *             </div>
 *         </div>
 *         ...
 *     </div>
 *     ...
 * </div>
 */
function createTabs() {
	// load the xml file
	var xmlhttp;
	if (window.XMLHttpRequest)
		xmlhttp = new XMLHttpRequest();
	else
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("GET", "tabs.xml", false);
	xmlhttp.send();
	var xmlDoc = xmlhttp.responseXML;
	
	xmove = 0;
	ymove = new Array();
	zmove = new Array();
	tablengths = new Array();
	
	var yhtml = new Array();
	var x = xmlDoc.getElementsByTagName("LEVEL0");
	var xhtml = '<div id="toplevel" class="sub initsub" style="width:'+width+'">\n';
	xhtml += '<div id="control" class="controlgroup" data-role="controlgroup" data-type="horizontal">\n';
	
	// top level elements
	for (var i = 0; i < x.length; i++) {
		var y = x[i].getElementsByTagName("LEVEL1");
		ymove[i] = 0;
		zmove[i] = new Array();
		tablengths[i] = new Array();
		
		xhtml += '<a id="btn'+i+'" class="opt';
		if (i == 0)
			xhtml += ' initbtn';
		xhtml += '" data-role="button" data-theme="a"';
		// add a left arrow icon if there are more buttons left of this one
		if (i != 0 && i%numtabs == 0)
			xhtml += ' data-icon="arrow-l"';
		// add a right arrow icon if there are more buttons right of this one
		else if (i%numtabs == 3 && i != x.length-1)
			xhtml += ' data-icon="arrow-r" data-iconpos="right"';
		xhtml += '>' + x[i].getElementsByTagName('TAG')[0].childNodes[0].nodeValue + '</a>\n';
		var zhtml = new Array();
		yhtml[i] = '<div id="subtab'+i+'" class="subtab sub';
		if (i == 0)
			yhtml[i] += ' initsub';
		yhtml[i] += '" >\n';
		yhtml[i] += '<div id="control'+i+'" class="control controlgroup" data-role="controlgroup" data-type="horizontal">\n';
		
		// second level elements
		for (var j = 0; j < y.length; j++) {
			var z = y[j].getElementsByTagName("LEVEL2");
			zmove[i][j] = 0;
			tablengths[i][j] = z.length;
			
			yhtml[i] += '<a id="btn'+i+'-'+j+'" class="opt';
			if (j == 0)
				yhtml[i] += ' initbtn';
			yhtml[i] +='" data-role="button" data-theme="a"';
			if (j != 0 && j%numtabs == 0)
				yhtml[i] += ' data-icon="arrow-l"';
			else if (j%numtabs == 3 && j != y.length-1)
				yhtml[i] += ' data-icon="arrow-r" data-iconpos="right"';
			yhtml[i] += '>' + y[j].getElementsByTagName('TAG')[0].childNodes[0].nodeValue + '</a>\n';
			
			zhtml[j] = '<div id="subtab'+i+'-'+j+'" class="subtab'+i+' sub';
			if (j == 0)
				zhtml[j] += ' initsub';
			zhtml[j] += '" >\n';
			zhtml[j] += '<div id="control'+i+'-'+j+'" class="control'+i+' controlgroup" data-role="controlgroup" data-type="horizontal">\n';
			
			// third level elements
			for (var k = 0; k < z.length; k++) {
				zhtml[j] += '<a id="btn'+i+'-'+j+'-'+k+'" class="opt" data-role="button" data-theme="a"';
				if (k != 0 && k%numtabs == 0)
					zhtml[j] += ' data-icon="arrow-l"';
				else if (k%numtabs == 3 && k != z.length-1)
					zhtml[j] += ' data-icon="arrow-r" data-iconpos="right"';
				zhtml[j] +='>' + z[k].childNodes[0].nodeValue + '</a>\n';
			}
			zhtml[j] += '</div>\n';
		}
		yhtml[i] += '</div>\n';
		// add the third level elements after all second level elements have been created
		for (var z = 0; z < zhtml.length; z++)
			yhtml[i] += zhtml[z] + '</div>';
		//yhtml[i] += '</div>\n';
	}
	xhtml += '</div>\n';
		// add the second level elements after all top level elements have been created
	for (var y = 0; y < yhtml.length; y++)
		xhtml += yhtml[y] + '</div>';
	xhtml += '</div>\n';
	// add the tabs to the page
	$('#tabs').html($(xhtml)).trigger('create');
}

/* Add bindings for button clicks and swipes */
function addCommentBindings(level) {
	// click action for tab buttons
	$('.controlgroup .opt').bind('click', function() {
		var num = $(this).attr('id').substring(3);
		var lev = $(this).parent().attr('id').substring(7);
		if (lev.length < 1) {
			//$('#subtab'+$('#subtab'+num+' .ui-btn-down-b').attr('id').substring(3)).css('display', 'block');
		}
		// not third level buttons
		if (lev.length < 3) {
			// $('#forms').css('display', 'none');
			// reset button highlights for this tab and highlight this button
			$('#control'+lev+' .opt').removeClass('ui-btn-down-b');
			$(this).addClass('ui-btn-down-b');
			
			// hide all subtabgroups of this tab group apart from
			// the one corresponding to the button pressed 
			$('.subtab'+lev).css('display', 'none');
			$('#subtab'+num).css('display', 'block');
			resetEntries();
		}
		// third level buttons
		else {
			if ($(this).hasClass('ui-btn-down-b'))
				$(this).removeClass('ui-btn-down-b');
			else
				$(this).addClass('ui-btn-down-b');
			// $('#text').text(document.getElementById('text').value+';'+$(this).text());
		}
	});
	
	// swipe left action for tab groups
	$('.controlgroup').bind('swipeleft', function() {
		var index = $(this).attr('id').substring(7).split('-');
		var move = 0;
		switch (index.length) {
			case 0:
			case 1: {
				if (!index[0]) {
					xmove = Math.max(xmove-1, -Math.floor((tablengths.length-1)/numtabs));
					move = xmove;
				}
				else {
					ymove[index[0]] = Math.max(ymove[index[0]]-1, -Math.floor((tablengths[index[0]].length-1)/numtabs));
					move = ymove[index[0]];
				}
				break;
			}
			case 2: {
				zmove[index[0]][index[1]] = Math.max(zmove[index[0]][index[1]]-1, -Math.floor((tablengths[index[0]][index[1]]-1)/numtabs));
				move = zmove[index[0]][index[1]];
				break;
			}
		}
		// move the tab group
		$(this).animate({ marginLeft: move*width }, slideSpeed, function () {});
	});
	
	// swipe right action for tab groups
	$('.controlgroup').bind('swiperight', function() {
		var index = $(this).attr('id').substring(7).split('-');
		var move = 0;
		switch (index.length) {
			case 0:
			case 1: {
				if (!index[0]) {
					xmove = Math.min(xmove+1, 0);
					move = xmove;
				}
				else {
					ymove[index[0]] = Math.min(ymove[index[0]]+1, 0);
					move = ymove[index[0]];
				}
				break;
			}
			case 2: {
				zmove[index[0]][index[1]] = Math.min(zmove[index[0]][index[1]]+1, 0);
				move = zmove[index[0]][index[1]];
				break;
			}
		}
		// move the tab group
		$(this).animate({ marginLeft: move*width }, slideSpeed, function () {});
	});
	
	$('#enter').bind('click', function() {
		selectData('SELECT * FROM comment WHERE sessionID='+sessionData[0]+' ORDER BY commentID DESC',
			function(tx, results) {
				var data = new Array(); // sid,cid,time,cat1,cat2,comment
				var files_data = new Array();
					
				data[0] = sessionData[0];

				if (results.rows.length == 0)
					data[1] = 0;
				else
					data[1] = results.rows.item(0).commentID + 1;

				data[2] = '"'+getTimestamp()+'"';
				
				var btn1 = $('#control .ui-btn-down-b').attr('id').substring(3);
				var btn2 = $('#control'+btn1+' .ui-btn-down-b').attr('id').split('-')[1];
				data[3] = '"'+btn1+'"';
				data[4] = '"'+btn2+'"';
				data[5] = '"'+$('#text').val()+'"';
				
				insertData('comment', data);
				
				var tags = $.makeArray($('#control'+btn1+'-'+btn2+' .ui-btn-down-b'));
				for (var i = 0; i < tags.length; i++) {
					var tagData = new Array();
					tagData[0] = sessionData[0];
					tagData[1] = data[1];
					tagData[2] = '"'+tags[i].text.substring(0,tags[i].text.length-1)+'"';
					insertData('tag', tagData);
				}

				if(files.length > 0) {
					for(var i = 0; i < files.length; i++) {
						files_data[0] = sessionData[0];
						files_data[1] = data[1];
						files_data[2] = '"'+files[i]+'"';
						
						//check the extension to see where to insert
						var ext = files[i].substr(files[i].lastIndexOf('.') +1);
						if(ext == 'mp4')
							insertData('video', files_data);
						else if(ext == 'jpg')
							insertData('photo', files_data);
						else if(ext == '3gp')
							insertData('audio', files_data); 
					}
				}
				
				resetEntries();
			},
			'Failed to get a comment ID!'
		)
	});
	
	$('#cancel').bind('click', function() {
		resetEntries();
	});
	
	$('#back').bind('click', function() {
		showHomeUI();
	});
}

function deleteFromCommentUI(src) {
	$("#links ").remove("#"+src);
	alert("removing link with id " + src);
}

/* hide all tab groups apart from the first of each sub group */
function initDisplay() {
	// hide all tab groups
	$('.sub').css('display', 'none');
	// show the first sub group of each tab group
	$('.initsub').css('display', 'block');
	// highlight the first button of the top and second level tab groups
	$('.initbtn').addClass('ui-btn-down-b');
}

// remove highlights from all third level buttons and reset the text box
function resetEntries() {
	$('.sub .sub .sub .ui-btn-down-b').removeClass('ui-btn-down-b');
	$('#text').text('');
}

// setup the UI sizes and spacing
function setupDimensions() {
	$('.opt').css('width', width/numtabs+'px');
	$('.sub').css('width', width+'px');
	$('.sub').css('overflow', 'hidden');
	$('.controlgroup').css('width', numtabs*width+'px');
	$('#camera').css('margin-top', '1px');
	$('#camera').css('margin-bottom', '2px');
	$('.controlgroup').css('margin-top', '1px');
	$('.controlgroup').css('margin-bottom', '2px');
	$('#topbar').height($('#back').height());
	$('#topbar').css('padding', 'auto auto auto 10px');
	$('#back').css('margin', 'auto 10px auto');
	$('#text').css('height', (height-4*($('#enter').height()+10)-($('#topbar').height()+6))+'px');
	$('#text').css('width', width*3/4-10+'px');
	$('#links').css('height', (height-4*($('#enter').height()+10)-($('#topbar').height()+6))+'px');
	$('#links').css('width', width/4-10+'px');
	$('.bottom_opt').css('width', width/5+'px');
}