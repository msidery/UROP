var width = window.innerWidth;
var height = window.innerHeight;

var numtabs = 4;

/* time for tab groups to slide along */
var slideSpeed = 500;
/* number of tabs in each tab group */
var tablengths;

/* amount each tab group has been moved */
var xmove; // top level tab
var ymove; // second level tabs
var zmove; // third level tabs

/* setup the user interface */
function initUI() {
	createTabs();
	addBindings();
	initDisplay();
	setupDimensions();
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
	var xhtml = '<div id="toplevel" class="sub" style="width:'+width+'">\n';
	xhtml += '<div id="control" class="controlgroup" data-role="controlgroup" data-type="horizontal">\n';
	
	// top level elements
	for (var i = 0; i < x.length; i++) {
		var y = x[i].getElementsByTagName("LEVEL1");
		ymove[i] = 0;
		zmove[i] = new Array();
		tablengths[i] = new Array();
		
		xhtml += '<a id="btn'+i+'" class="opt" data-role="button" data-theme="a"';
		// add a left arrow icon if there are more buttons left of this one
		if (i != 0 && i%numtabs == 0)
			xhtml += ' data-icon="arrow-l"';
		// add a right arrow icon if there are more buttons right of this one
		else if (i%numtabs == 3 && i != x.length-1)
			xhtml += ' data-icon="arrow-r" data-iconpos="right"';
		xhtml += '>' + x[i].childNodes[0].nodeValue + '</a>\n';
		var zhtml = new Array();
		yhtml[i] = '<div id="subtab'+i+'" class="subtab sub" >\n';
		yhtml[i] += '<div id="control'+i+'" class="control controlgroup" data-role="controlgroup" data-type="horizontal">\n';
		
		// second level elements
		for (var j = 0; j < y.length; j++) {
			var z = y[j].getElementsByTagName("LEVEL2");
			zmove[i][j] = 0;
			tablengths[i][j] = z.length;
			
			yhtml[i] += '<a id="btn'+i+'-'+j+'" class="opt" data-role="button" data-theme="a"';
			if (j != 0 && j%numtabs == 0)
				yhtml[i] += ' data-icon="arrow-l"';
			else if (j%numtabs == 3 && j != y.length-1)
				yhtml[i] += ' data-icon="arrow-r" data-iconpos="right"';
			yhtml[i] += '>' + y[j].childNodes[0].nodeValue + '</a>\n';
			
			zhtml[j] = '<div id="subtab'+i+'-'+j+'" class="subtab'+i+' sub" >\n';
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
function addBindings(level) {
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
			$(this).addClass('ui-btn-down-b');
			$('#text').text(document.getElementById('text').value+';'+$(this).text());
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
		// add stuff to the DB
		resetEntries();
	});
	
	$('#cancel').bind('click', function() {
		resetEntries();
	});
}

/* hide all tab groups apart from the first of each sub group */
function initDisplay() {
	// hide all tab groups
	$('.sub').css('display', 'none');
	// show the first of each tab group
	$('#toplevel').css('display', 'block');
	$('#btn0').addClass('ui-btn-down-b');
	$('#subtab0').css('display', 'block');
	$('#btn0-0').addClass('ui-btn-down-b');
	$('#subtab0-0').css('display', 'block');
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
	$('.controlgroup').css('margin-top', '1px');
	$('.controlgroup').css('margin-bottom', '2px');
	$('#text').css('height', (height-4*($('#enter').height()+10))+'px');
	$('.bottom_opt').css('width', (width-3)/5+'px');
}