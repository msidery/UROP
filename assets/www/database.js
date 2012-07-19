var db;

function initDB() {
    db = window.openDatabase("test", "1.0", "Test database", 100000);
    db.transaction(createTables, errorCB, successCB);
	//db.transaction(populateDB, errorCB, successCB);
}

/*
 * sessionID timestamp comment ---1-----N--- sessionID timestamp tag
 * 
 */

/* Create the tables */
function createTables(tx) {
	function dropTables() {
		tx.executeSql('DROP TABLE IF EXISTS Session');
		tx.executeSql('DROP TABLE IF EXISTS Comments');
		tx.executeSql('DROP TABLE IF EXISTS Tags');
	}
	//dropTables();
	tx.executeSql('CREATE TABLE IF NOT EXISTS Session (sessionID unique, fname, lname, date, subject, module)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Comments (sessionID, timestamp, comment)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Tags (sessionID, timestamp, tag)');
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
	//alert("success!");
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