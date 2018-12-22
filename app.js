
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAo7GPN6P6-BF5UySwp8w9uPlRTvcMzqwo",
    authDomain: "train-schedular-mp.firebaseapp.com",
    databaseURL: "https://train-schedular-mp.firebaseio.com",
    projectId: "train-schedular-mp",
    storageBucket: "train-schedular-mp.appspot.com",
    messagingSenderId: "493313594229"
};
firebase.initializeApp(config);


var database = firebase.database();

// 2. Button for adding Employees
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainStart = moment($("#start-input").val().trim(), "HH:mm A").format("X");
    var frequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainStart: firstTrainStart,
        frequency: frequency
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrainStart);
    console.log(newTrain.frequency);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrainStart = childSnapshot.val().firstTrainStart;
    var frequency = childSnapshot.val().frequency;

    // Employee Info
    console.log(trainName);
    console.log(destination);
    console.log(firstTrainStart);
    console.log(frequency);
   

    var newfirstTrainStart = moment(firstTrainStart, "HH:mm").subtract(1, "years");
    console.log(newfirstTrainStart);

    var difference = moment().diff(moment(newfirstTrainStart), "minutes");
    console.log("DIFFERENCE IN TIME: " + difference);

    var remainder = difference % frequency;
    console.log(remainder);

    var minAway = frequency - remainder;
    console.log("MINUTES TILL TRAIN: " + minAway);

    var nextTrainTime = moment().add(minAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrainTime).format("hh:mm A"));


    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(moment(nextTrainTime).format("hh:mm A")),
        $("<td>").text(minAway),

    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});

