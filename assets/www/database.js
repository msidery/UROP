var db;

function initDB() {
    db = window.openDatabase("Test", "1.0", "Test database", 100000);
    db.transaction(createTables, errorCB, successCB);
	db.transaction(populateDB, errorCB, successCB);
}

// Populate the database 
//
function createTables(tx) {
    tx.executeSql('DROP TABLE IF EXISTS DEMO');
	tx.executeSql('CREATE TABLE IF NOT EXISTS tabs0 (level0, category)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS tabs1 (level0, level1, category)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS tabs2 (level0, level1, level2, category)');
}

function populateDB(tx) {
	tx.executeSql('SELECT 1 FROM tabs0', [], populateSuccess, errorCB);
}

function populateSuccess(tx, results) {
	var num = results.rows.length;
	
	if (num == 0) {
		tx.executeSql('INSERT INTO tabs0 (level0, category) VALUES (0, "Comment")');
		tx.executeSql('INSERT INTO tabs0 (level0, category) VALUES (1, "Enthusiasm")');
		tx.executeSql('INSERT INTO tabs1 (level0, level1, category) VALUES (0, 0, "Cat1")');
		tx.executeSql('INSERT INTO tabs1 (level0, level1, category) VALUES (0, 1, "Cat2")');
		tx.executeSql('INSERT INTO tabs1 (level0, level1, category) VALUES (1, 0, "Cat3")');
		tx.executeSql('INSERT INTO tabs1 (level0, level1, category) VALUES (1, 1, "Cat4")');
		tx.executeSql('INSERT INTO tabs2 (level0, level1, level2, category) VALUES (0, 0, 0, "Type1")');
		tx.executeSql('INSERT INTO tabs2 (level0, level1, level2, category) VALUES (0, 1, 0, "Type2")');
		tx.executeSql('INSERT INTO tabs2 (level0, level1, level2, category) VALUES (1, 0, 0, "Type3")');
		tx.executeSql('INSERT INTO tabs2 (level0, level1, level2, category) VALUES (1, 1, 0, "Type4")');
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

function go() {
    //db.transaction(addDB, errorCB, successCB);
}

function addDB(tx) {
	var f = document.getElementById("fname").value;
	var l = document.getElementById("lname").value;
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES ('+f+', "'+l+'")');
}

function readDB() {
	//db.transaction(queryDB, errorCBB);
}

function queryDB(tx) {
	//tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCBB);
}

function querySuccess(tx, results) {
	var text = document.getElementById("text");
	text.value = "RESULTS\n"
	text.value += "Returned rows = " + results.rows.length + "\n";
	for (var i = 0; i < results.rows.length; i++)
		text.value += results.rows.item(i).id + ": " + results.rows.item(i).data + "\n";
	// this will be true since it was a select statement and so rowsAffected was 0
	// if (!resultSet.rowsAffected) {
	  // console.log('No rows affected!');
	  // return false;
	// }
	// for an insert statement, this property will return the ID of the last inserted row
	//console.log("Last inserted row ID = " + results.insertId);
}