
var config = {
    apiKey: "AIzaSyArXvsc-twrJ7P9DUVplqFyNGpZ-ZL0-oM",
    authDomain: "trainscheduler-26ffb.firebaseapp.com",
    databaseURL: "https://trainscheduler-26ffb.firebaseio.com",
    projectId: "trainscheduler-26ffb",
    storageBucket: "trainscheduler-26ffb.appspot.com",
    messagingSenderId: "839503650115"
  };
  firebase.initializeApp(config);

function clearDB() {
	if( confirm("Are you sure you want to delete the entire train schedule? This can not be undone!") )
		firebase.database().ref().remove();
}

var entries = []; 
var col_names = ["train_name", "destination", "frequency", "next_arrival", "minutes_away"]; 

function updateHTML() {
	for( var i = 0; i < entries.length; i++ ) {
		var entry = entries[i];

		var table_data = {
			train_name: entry.train_name,
			destination: entry.destination,
			frequency: entry.frequency,
			next_arrival: null, 
			minutes_away: null  
		};


		table_data.next_arrival = "12:00"; 
		  
		table_data.minutes_away = "5:00"

		for( var j = 0; j < col_names.length; j++ ) {
			var col_name = col_names[j];
			var td = $("#train-schedule tr[data-train_name='" + entry.train_name + "'] td[data-col_name='" + col_name + "']");
			td.text( table_data[col_name] );
		}
	}
}

$( function() {

	var database = firebase.database();
	database.ref().on("child_added", function(snapshot) {
		var tr = $("<tr>");
		for( var i = 0; i < col_names.length; i++ ) {
			var td = $("<td>");
			td.attr( "data-col_name", col_names[i] );
			tr.append(td);
		}
		tr.attr( "data-train_name", snapshot.val().train_name );
		$("#train-schedule tbody").append(tr);

		entries.push( snapshot.val() );

		updateHTML();
	});

	$("#addTrain-form").on("submit", function(event) {
		event.preventDefault();

		var name = $("#addTrain-form [name='name']").val();
		var dest = $("#addTrain-form [name='dest']").val();
		var initTime = $("#addTrain-form [name='initTime']").val();
		var freq = $("#addTrain-form [name='freq']").val();

		database.ref().push({
			train_name: name,
			destination: dest,
			initial_time: initTime,
			frequency: freq
		});
	});

} );
