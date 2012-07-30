var database;
var sessionID;

function initdatabase() {
	/* Create the tables */
	function createTables(tx) {
		function dropTables() {
			tx.executeSql('DROP TABLE IF EXISTS session');
			tx.executeSql('DROP TABLE IF EXISTS comment');
			tx.executeSql('DROP TABLE IF EXISTS tag');
		}
		dropTables();
		tx.executeSql('CREATE TABLE IF NOT EXISTS session (sessionID unique, date, fname, lname, subject, module)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS comment (sessionID, commentID, timestamp, cat1, cat2, comment)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS tag (sessionID, commentID, tag)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS photo (sessionID, commentID, file)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS video (sessionID, commentID, file)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS audio (sessionID, commentID, file)');
	}
	function fail() {
		alert('Failed to create tables!');
	}
    database = window.openDatabase("test", "1.0", "Test database", 100000);
    database.transaction(createTables, fail, successCB);
	//database.transaction(populatedatabase, errorCB, successCB);
}

/*
 * sessionID timestamp comment ---1-----N--- sessionID timestamp tag
 * 
 */
/* Insert data into the given table using all columns */
function insertData(table, data) {
	function insert(tx) {
		console.log(table+': '+data);
		tx.executeSql('INSERT INTO '+table+' VALUES ('+data+')');
	}
	function fail(tx, err) {
		alert('Failed to insert '+data+' into '+table+'!');
	}
	database.transaction(insert, fail, successCB);
}

function selectData(sql, success, failtext) {
	function select(tx) {
		function fail(err) {
			alert(failtext);
		}
		tx.executeSql(sql, [], success, fail);
	}
	database.transaction(select, errorCB, successCB);
}

/* Transaction error callback */
function errorCB(tx, err) {
    alert("Error processing SQL: "+err);
}

function errorCBB(err) {
    alert("Error processing SQL: "+err.code);
}

/* Transaction success callback */
function successCB() {
	alert("success of insertion!");
}

/* generate the date */
function getDate() {
	var d, s = "";
	var c = "/";
	d = new Date();
	s += d.getDate() + c;
	s += (d.getMonth()+1) + c;
	s += d.getFullYear();
	return s;
}

function go() {
    database.transaction(adddatabase, errorCB, successCB);
}

function adddatabase(tx) {
	var f = document.getElementById("fname").value;
	var l = document.getElementById("lname").value;
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES ('+f+', "'+l+'")');
}

function readdatabase() {
	database.transaction(querydatabase, errorCBB);
}

function querydatabase(tx) {
	tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCBB);
}

function querySuccess(tx, results) {
	var text = document.getElementById("text");
	text.value = "RESULTS\n"
	text.value += "Returned rows = " + results.rows.length + "\n";
	for (var i = 0; i < results.rows.length; i++)
		text.value += results.rows.item(i).id + ": " + results.rows.item(i).data + "\n";
}