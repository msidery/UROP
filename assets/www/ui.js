var width = window.innerWidth;
var height = window.innerHeight;
var slideSpeed = 500;
var tablengths;
var xmove, ymove, zmove;

function initUI() {
	createTabs();
	addBindings();
	initDisplay();
	setupDimensions();
}

function createTabs() {
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
	for (var i = 0; i < x.length; i++) {
		var y = x[i].getElementsByTagName("LEVEL1");
		ymove[i] = 0;
		zmove[i] = new Array();
		tablengths[i] = new Array();
		
		xhtml += '<a id="btn'+i+'" class="opt" data-role="button" data-theme="a"';
		if (i != 0 && i%4 == 0)
			xhtml += ' data-icon="arrow-l"';
		else if (i%4 == 3 && i != x.length-1)
			xhtml += ' data-icon="arrow-r" data-iconpos="right"';
		xhtml += '>' + x[i].childNodes[0].nodeValue + '</a>\n';
		var zhtml = new Array();
		yhtml[i] = '<div id="subtab'+i+'" class="subtab sub" >\n';
		yhtml[i] += '<div id="control'+i+'" class="control controlgroup" data-role="controlgroup" data-type="horizontal">\n';
		for (var j = 0; j < y.length; j++) {
			var z = y[j].getElementsByTagName("LEVEL2");
			zmove[i][j] = 0;
			tablengths[i][j] = z.length;
			
			yhtml[i] += '<a id="btn'+i+'-'+j+'" class="opt" data-role="button" data-theme="a"';
			if (j != 0 && j%4 == 0)
				yhtml[i] += ' data-icon="arrow-l"';
			else if (j%4 == 3 && j != y.length-1)
				yhtml[i] += ' data-icon="arrow-r" data-iconpos="right"';
			yhtml[i] += '>' + y[j].childNodes[0].nodeValue + '</a>\n';
			
			zhtml[j] = '<div id="subtab'+i+'-'+j+'" class="subtab'+i+' sub" >\n';
			zhtml[j] += '<div id="control'+i+'-'+j+'" class="control'+i+' controlgroup" data-role="controlgroup" data-type="horizontal">\n';
			for (var k = 0; k < z.length; k++) {
				zhtml[j] += '<a id="btn'+i+'-'+j+'-'+k+'" class="opt" data-role="button" data-theme="a"';
				if (k != 0 && k%4 == 0)
					zhtml[j] += ' data-icon="arrow-l"';
				else if (k%4 == 3 && k != z.length-1)
					zhtml[j] += ' data-icon="arrow-r" data-iconpos="right"';
				zhtml[j] +='>' + z[k].childNodes[0].nodeValue + '</a>\n';
			}
			zhtml[j] += '</div>\n';
		}
		yhtml[i] += '</div>\n';
		for (var z = 0; z < zhtml.length; z++)
			yhtml[i] += zhtml[z] + '</div>';
		//yhtml[i] += '</div>\n';
	}
	xhtml += '</div>\n';
	for (var y = 0; y < yhtml.length; y++)
		xhtml += yhtml[y] + '</div>';
	xhtml += '</div>\n';
	$('#tabs').html($(xhtml)).trigger('create');
	//document.write(xhtml);
}

function addBindings(level) {
	$('.controlgroup .opt').bind('click', function() {
		var num = $(this).attr('id').substring(3);
		var lev = $(this).parent().attr('id').substring(7);
		if (lev.length < 1) {
			//$('#subtab'+$('#subtab'+num+' .ui-btn-down-b').attr('id').substring(3)).css('display', 'block');
		}
		if (lev.length < 3) {
			// $('#forms').css('display', 'none');
			$('#control'+lev+' .opt').removeClass('ui-btn-down-b');
			$(this).addClass('ui-btn-down-b');
	
			$('.subtab'+lev).css('display', 'none');
			$('#subtab'+num).css('display', 'block');
			resetEntries();
		}
		else {
			$(this).addClass('ui-btn-down-b');
			$('#text').text(document.getElementById('text').value+';'+$(this).text());
		}
	});
	$('.controlgroup').bind('swipeleft', function() {
		var index = $(this).attr('id').substring(7).split('-');
		var move = 0;
		switch (index.length) {
			case 0:
			case 1: {
				if (!index[0]) {
					xmove = Math.max(xmove-1, -Math.floor((tablengths.length-1)/4));
					move = xmove;
				}
				else {
					ymove[index[0]] = Math.max(ymove[index[0]]-1, -Math.floor((tablengths[index[0]].length-1)/4));
					move = ymove[index[0]];
				}
				break;
			}
			case 2: {
				zmove[index[0]][index[1]] = Math.max(zmove[index[0]][index[1]]-1, -Math.floor((tablengths[index[0]][index[1]]-1)/4));
				move = zmove[index[0]][index[1]];
				break;
			}
		}
		$(this).animate({ marginLeft: move*width }, slideSpeed, function () {});
	});
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

function initDisplay() {
	$('.sub').css('display', 'none');
	$('#toplevel').css('display', 'block');
	$('#btn0').addClass('ui-btn-down-b');
	$('#subtab0').css('display', 'block');
	$('#btn0-0').addClass('ui-btn-down-b');
	$('#subtab0-0').css('display', 'block');
	$('#btn1-0').addClass('ui-btn-down-b');
	$('#subtab1-0').css('display', 'block');
}

function resetEntries() {
	$('.sub .sub .sub .ui-btn-down-b').removeClass('ui-btn-down-b');
	$('#text').text('');
}

function setupDimensions() {
	$('.opt').css('width', width/4+'px');
	//$('#tabs').css('width', width+'px');
	//$('#tabs').css('overflow', 'hidden');
	$('.sub').css('width', width+'px');
	$('.sub').css('overflow', 'hidden');
	$('.controlgroup').css('width', 4*width+'px');
	$('#text').css('height', (height-4*($('#enter').height()+15))+'px');
	$('.bottom_opt').css('width', (width-3)/5+'px');
}
