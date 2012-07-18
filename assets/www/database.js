var db;

function initDB() {
    db = window.openDatabase("test", "1.0", "Test database", 100000);
    db.transaction(createTables, errorCB, successCB);
	db.transaction(populateDB, errorCB, successCB);
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