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

	var yhtml = new Array();
	var x = xmlDoc.getElementsByTagName("LEVEL0");
	var xhtml = '<div id="toplevel" style="width:'+width+'">\n';
	xhtml += '<div id="control" data-role="controlgroup" data-type="horizontal">\n';
	for (var i = 0; i < x.length; i++) {
		xhtml += '<a id="btn'+i+'" class="opt" data-role="button" data-theme="a">'
			+ x[i].childNodes[0].nodeValue + '</a>\n';

		var zhtml = new Array();
		var y = x[i].getElementsByTagName("LEVEL1");
		yhtml[i] = '<div id="subtab'+i+'" class="subtab" >\n';
		yhtml[i] += '<div id="control'+i+'" class="control" data-role="controlgroup" data-type="horizontal">\n';
		for (var j = 0; j < y.length; j++) {
			yhtml[i] += '<a id="btn'+i+'-'+j+'" class="opt" data-role="button" data-theme="a">'
				+ y[j].childNodes[0].nodeValue + '</a>\n';
			
			zhtml[j] = '<div id="subtab'+i+'-'+j+'" class="subtab'+i+'" >\n';
			zhtml[j] += '<div id="control'+i+'-'+j+'" class="control'+i+'" data-role="controlgroup" data-type="horizontal">\n';
			var z = y[j].getElementsByTagName("LEVEL2");
			for (var k = 0; k < z.length; k++) {
				zhtml[j] += '<a id="btn'+i+'-'+j+'-'+k+'" class="opt" data-role="button" data-theme="a">'
					+ z[k].childNodes[0].nodeValue + '</a>\n';
			}
			zhtml[j] += '</div>\n';
		}
		yhtml[i] += '</div>\n';
		for (var z = 0; z < zhtml.length; z++)
			yhtml[i] += zhtml[z] + '</div>';
		yhtml[i] += '</div>\n';
	}
	xhtml += '</div>\n';
	for (var y = 0; y < yhtml.length; y++)
		xhtml += yhtml[y] + '</div>';
	xhtml += '</div>\n';
	$('#tabs').html($(xhtml)).trigger('create');
}

function addBindings(level) {
	function apply(level) {
		$('#control'+level+' .opt').bind('click', function() {
			var num = $(this).attr('id').substring(3);
			// $('#forms').css('display', 'none');
			$('#control'+level+' .opt').removeClass('ui-btn-down-b');
			$(this).addClass('ui-btn-down-b');
	
			$('.subtab'+level).css('display', 'none');
			$('#subtab'+num).css('display', 'block');
		});
	}
		
	var xmlhttp;
	if (window.XMLHttpRequest)
		xmlhttp = new XMLHttpRequest();
	else
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("GET", "tabs.xml", false);
	xmlhttp.send();
	var xmlDoc = xmlhttp.responseXML;
	
	$('.subtab').css('display', 'none');
	apply('');
	var x = xmlDoc.getElementsByTagName("LEVEL0");
	for (var i = 0; i < x.length; i++) {
		$('.subtab'+i).css('display', 'none');
		apply(i);
		var y = x[i].getElementsByTagName("LEVEL1");
		for (var j = 0; j < y.length; j++) {
			apply(i+'-'+j);
		}
	}
	
	
	// if (level < 2) {
		// $('#tabs'+level+' .opt').bind('click', function() {
			// $('#forms').css('display', 'none');
			// $('#tabs'+level+' #'+$(this).parent().attr('id')+' .opt').removeClass('ui-btn-down-b');
			// $(this).addClass('ui-btn-down-b');
			// $(this).parent().css('display', 'block');
			// if (level < 2) {
				// $('#tabs'+(level+1)).children().css('display', 'none');
				// $('#tabs'+(level+1)+' #' + $(this).parent().attr('id')
					// + $(this).attr('id').substring(3)+'-').css('display', 'block');
				// if (level < 1) {
					// $('#tabs'+(level+2)).children().css('display', 'none');
					// // show third level tabs corresponding to already highlighted second level tab
					// // but only if there exists a highlighted button 
					// var btn = $('#tabs'+(level+1)+' #subtabs' + $(this).attr('id').substring(3)
						// +'- .ui-btn-down-b').attr('id');
					// if (btn != undefined)
						// $('#tabs'+(level+2)+' #' + $(this).parent().attr('id')+$(this).attr('id').substring(3)+'-'
							// + btn.substring(3)+'-').css('display', 'block');
				// }
			// }
		// });
	// }
	// else {
		// $('#tabs2 .opt').bind('click', function() {
			// $('#forms').css('display', 'inline');
			// $('#tabs2 #'+$(this).parent().attr('id')+' .opt').removeClass('ui-btn-down-b');
			// $(this).addClass('ui-btn-down-b');
		// });
	// }
// 	
	// if (level > 0)
		// $('#tabs'+level).children().css('display', 'none');
	// $('#tabs'+level+' .opt').css('width', width/4-1+'px');
	//$('#tabs'+level+' .opt').css('width', '100px');
	//$('#tabs').css('width', width+'px');
}