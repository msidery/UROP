var width = window.innerWidth;
var slideSpeed = 500;

function initUI() {
	$('#forms').css('display', 'none');
	
	addAllTabs();
	
	$('#done').bind('click', function() {
		$('#forms').css('display', 'none');
	});
	
	$('#cancel').bind('click', function() {
		$('#forms').css('display', 'none');
	});
	
	$('#tabs').children().bind('swipeleft', function(){
		$(this).animate({ marginLeft: -width }, slideSpeed, function () {});
	});
	
	$('#tabs').children().bind('swiperight', function(){
		$(this).animate({ marginLeft: 0 }, slideSpeed, function () {});
	});
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

	var yhtml = [];
	var x = xmlDoc.getElementsByTagName("LEVEL0");
	var xhtml = '<div id="toplevel" style="width:'+width+'">\n';
	xhtml += '<div data-role="controlgroup" data-type="horizontal">\n';
	for (var i = 0; i < x.length; i++) {
		xhtml += '<a id="btn'+i+'" class="opt" data-role="button" data-theme="a">'
			+ x[i].childNodes[0].nodeValue + '</a>\n';
		
		var zhtml = [];
		var y = x[i].getElementsByTagName("LEVEL1");
		yhtml += ['<div id="subtab'+i+'" >'];
		yhtml[i] += '<div data-role="controlgroup" data-type="horizontal">\n';
		for (var j = 0; j < y.length; j++) {
			yhtml[i] += '<a id="btn'+i+'-'+j+'" class="opt" data-role="button" data-theme="a">'
				+ y[j].childNodes[0].nodeValue + '</a>\n';
			
			zhtml += ['<div id="subtab'+i+'-'+j+'" >'];
			zhtml[j] += '<div data-role="controlgroup" data-type="horizontal">\n';
			var z = y[j].getElementsByTagName("LEVEL2");
			for (var k = 0; k < z.length; k++) {
				zhtml += '<a id="btn'+i+'-'+j+'-'+k+'" class="opt" data-role="button" data-theme="a">'
					+ z[k].childNodes[0].nodeValue + '</a>\n';
			}
		}
		yhtml += '</div>';
		for (var z = 0; z < zhtml.length; z++)
			yhtml += zhtml[z];
		yhtml += '</div>';
	}
	xhtml += '</div>';
	for (var y = 0; y < yhtml.length; y++)
		xhtml += yhtml[y];
	xhtml += '</div>';
	$('#tabs').html($(xhtml)).trigger('create');
}

// <div toplevel style="width:800px;"  ontouchmove="touchmove(event)" >
	// <div data-role="controlgroup" data-type="horizontal">
		// <a data-role="button">AAAAAAAA</a>
		// <a data-role="button">BBBBBBBB</a>
		// <a data-role="button">CCCCCCCC</a>
		// <a data-role="button">DDDDDDDD</a>
	// </div>
	// <div subtab0 style="display:inline;" >
		// <div data-role="controlgroup" data-type="horizontal">
			// <a data-role="button">1</a>
			// <a data-role="button">2</a>
			// <a data-role="button">3</a>
		// </div>
		// <div subtab0-0 style="display:inline;" >
			// <div data-role="controlgroup" data-type="horizontal">
				// <a data-role="button">a</a>
				// <a data-role="button">b</a>
				// <a data-role="button">c</a>
			// </div>
		// </div>
	// </div>
	// <div subtab1 style="display:inline;" >
		// <div data-role="controlgroup" data-type="horizontal">
			// <a data-role="button">4</a>
			// <a data-role="button">5</a>
			// <a data-role="button">6</a>
		// </div>
		// <div subtab1-0 style="display:inline;" >
			// <div data-role="controlgroup" data-type="horizontal">
				// <a data-role="button">d</a>
				// <a data-role="button">e</a>
				// <a data-role="button">f</a>
			// </div>
		// </div>
	// </div>
// </div>

function addAllTabs() {
	addTabs(0, []);
}

function addTabs(level, selection) {
	function tabQuery(tx) {
		function tabSuccess(tx, results) {
			var buttons = '<div id="subtabs';
			for (var i = 0; i < selection.length; i++)
				buttons += selection[i] + '-';
			buttons += '" data-role="controlgroup" data-type="horizontal">';
			for (var i = 0; i < results.rows.length; i++) {
				if (level < 2) {
					var next = [];
					for (var j = 0; j < selection.length; j++)
						next += selection[j];
					next += i;
					addTabs(level+1, next);
				}
				buttons += '<a id="btn'+i+'" class="opt" data-role="button" data-theme="a">'+results.rows.item(i).category+'</a>';
			}
			buttons += '</div>';
			$('#tabs'+level).append(buttons).trigger('create');
			addBindings(level);
		}
		var queryString = 'SELECT * FROM Tabs'+level;
		for (var i = 0; i < level; i++) {
			if (i == 0)
				queryString += ' WHERE';
			else
				queryString += ' AND';
			queryString += ' level' + i + '=' + selection[i];
		}
		// alert(queryString);
		tx.executeSql(queryString, [], tabSuccess, errorCB);
	}
	db.transaction(tabQuery, errorCB, successCB);
}

function addBindings(level) {
	if (level < 2) {
		$('#tabs'+level+' .opt').bind('click', function() {
			$('#forms').css('display', 'none');
			$('#tabs'+level+' #'+$(this).parent().attr('id')+' .opt').removeClass('ui-btn-down-b');
			$(this).addClass('ui-btn-down-b');
			$(this).parent().css('display', 'block');
			if (level < 2) {
				$('#tabs'+(level+1)).children().css('display', 'none');
				$('#tabs'+(level+1)+' #' + $(this).parent().attr('id')
					+ $(this).attr('id').substring(3)+'-').css('display', 'block');
				if (level < 1) {
					$('#tabs'+(level+2)).children().css('display', 'none');
					// show third level tabs corresponding to already highlighted second level tab
					// but only if there exists a highlighted button 
					var btn = $('#tabs'+(level+1)+' #subtabs' + $(this).attr('id').substring(3)
						+'- .ui-btn-down-b').attr('id');
					if (btn != undefined)
						$('#tabs'+(level+2)+' #' + $(this).parent().attr('id')+$(this).attr('id').substring(3)+'-'
							+ btn.substring(3)+'-').css('display', 'block');
				}
			}
		});
	}
	else {
		$('#tabs2 .opt').bind('click', function() {
			$('#forms').css('display', 'inline');
			$('#tabs2 #'+$(this).parent().attr('id')+' .opt').removeClass('ui-btn-down-b');
			$(this).addClass('ui-btn-down-b');
		});
	}
	
	if (level > 0)
		$('#tabs'+level).children().css('display', 'none');
	$('#tabs'+level+' .opt').css('width', width/4-1+'px');
	//$('#tabs'+level+' .opt').css('width', '100px');
	//$('#tabs').css('width', width+'px');
}