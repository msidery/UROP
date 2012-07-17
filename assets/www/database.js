var db;
var width = window.innerWidth;

function init() {
	initDB();
	initUI();
}

function initDB() {
    db = window.openDatabase("test", "1.0", "Test database", 100000);
    db.transaction(createTables, errorCB, successCB);
	db.transaction(populateDB, errorCB, successCB);
}

function initUI() {
	$('#forms').css('display', 'none');
	
	addAllTabs();
	
	$('#done').bind('click', function() {
		$('#forms').css('display', 'none');
	});
	
	$('#cancel').bind('click', function() {
		$('#forms').css('display', 'none');
	});
}

// Populate the database 
//
function createTables(tx) {
	tx.executeSql('DROP TABLE IF EXISTS Tabs0');
	tx.executeSql('DROP TABLE IF EXISTS Tabs1');
	tx.executeSql('DROP TABLE IF EXISTS Tabs2');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Tabs0 (level0, category)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Tabs1 (level0, level1, category)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Tabs2 (level0, level1, level2, category)');
	tx.executeSql('DROP TABLE IF EXISTS Demo');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Demo (id unique, data)');
	tx.executeSql('INSERT INTO Demo (id, data) VALUES (1, "First row")');
	tx.executeSql('INSERT INTO Demo (id, data) VALUES (2, "Second row")');
}

function populateDB(tx) {
	tx.executeSql('SELECT * FROM Tabs0', [], populateSuccess, errorCB);
}

function populateSuccess(tx, results) {
	var xmlhttp;
	if (window.XMLHttpRequest)
		xmlhttp = new XMLHttpRequest();
	else
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("GET", "tabs.xml", false);
	xmlhttp.send();
	var xmlDoc = xmlhttp.responseXML;

	var x = xmlDoc.getElementsByTagName("LEVEL0");
	for (var i = 0; i < x.length; i++) {
		tx.executeSql('INSERT INTO Tabs0 (level0, category) VALUES ('+i+', "'+x[i].childNodes[0].nodeValue+'")');
		var y = x[i].getElementsByTagName("LEVEL1");
		for (var j = 0; j < y.length; j++) {
			tx.executeSql('INSERT INTO Tabs1 (level0, level1, category) VALUES ('+i+', '+j+', "'+y[j].childNodes[0].nodeValue+'")');
			var z = y[j].getElementsByTagName("LEVEL2");
			for (var k = 0; k < z.length; k++) {
				tx.executeSql('INSERT INTO Tabs2 (level0, level1, level2, category) VALUES ('+i+', '+j+', '+k+', "'+z[k].childNodes[0].nodeValue+'")');
			}
		}
	}
}

// Transaction error callback
//
function errorCB(tx, err) {
    alert("Error processing SQL: "+err);
}

function errorCBB(err) {
    alert("Error processing SQL: "+err.code);
}

// Transaction success callback
//
function successCB() {
	//alert("success!");
}

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
					$('#tabs'+(level+2)+' #' + $(this).parent().attr('id')+$(this).attr('id').substring(3)+'-'
						+ $('#tabs'+(level+1)+' #subtabs' + $(this).attr('id').substring(3)
						+'- .ui-btn-down-b').attr('id').substring(3)+'-').css('display', 'block');
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
}

function go() {
    db.transaction(addDB, errorCB, successCB);
}

function addDB(tx) {
	var f = document.getElementById("fname").value;
	var l = document.getElementById("lname").value;
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES ('+f+', "'+l+'")');
}

function readDB() {
	db.transaction(queryDB, errorCBB);
}

function queryDB(tx) {
	tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCBB);
}

function querySuccess(tx, results) {
	var text = document.getElementById("text");
	text.value = "RESULTS\n"
	text.value += "Returned rows = " + results.rows.length + "\n";
	for (var i = 0; i < results.rows.length; i++)
		text.value += results.rows.item(i).id + ": " + results.rows.item(i).data + "\n";
}