  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCF4t3oMUIWvt_bDz7i9ppyqTBz0ka_USQ",
    authDomain: "first-awesome-project-dda00.firebaseapp.com",
    databaseURL: "https://first-awesome-project-dda00.firebaseio.com",
    projectId: "first-awesome-project-dda00",
    storageBucket: "first-awesome-project-dda00.appspot.com",
    messagingSenderId: "753958578625",
    appId: "1:753958578625:web:560395e2115649cd"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

  var trains = database.ref("/trains");

  $("#submit").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var frequency = $("#frequency").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
      name: trainName,
      destination: destination,
      start: firstTrainTime,
      rate: frequency
    };
    // Uploads employee data to the database
    trains.push(newTrain);
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.rate);

    alert("Train successfully added");

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
  });

  trains.on("child_added", function (childSnapshot) {
    console.log(childSnapshot);
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = moment(childSnapshot.val().start, "HH:mm").format("HH:mm");
    // var firstTrainTimeA = moment(firstTrainTime).format("hh:mm A");
    var frequency = childSnapshot.val().rate;

    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    // Calculate the months worked using hardcore math
    // To calculate the months worked
    var currentTime = moment().format("HH:mm");
    console.log("currentTime: " + currentTime);

    // Calculate the total billed rate
    var currentTimeSplit = currentTime.split(":");
    console.log(currentTimeSplit);
    var firstTrainSplit = firstTrainTime.split(":");
    console.log(firstTrainSplit);

    let currentHour = parseInt(currentTimeSplit[0]);
    let currentMinute = parseInt(currentTimeSplit[1]);

    function getMinuteDiff() {
      let firstTrainHour = parseInt(firstTrainSplit[0]);
      let firstTrainMinute = parseInt(firstTrainSplit[1]);

      if (firstTrainTime > currentTime) {
        return ((firstTrainHour - currentHour) * 60) + (firstTrainMinute - currentMinute);
      } else if (firstTrainTime == currentTime) {
        return 0;
      } else {
        let diff = frequency - ((currentHour - firstTrainHour) * 60 + currentMinute - firstTrainMinute) % frequency;

        if (currentHour * 60 + currentMinute + diff < 24 * 60) {
          return diff;
        } else {
          return (24 + firstTrainHour - currentHour) * 60 + (firstTrainMinute - currentMinute);
        }
      }

    }

    var minuteDifference = getMinuteDiff();
    var minutesAway = minuteDifference;
    console.log("minutes away: " + minutesAway);

    function nextArrivalTime() {
      if (currentTime < firstTrainTime) {
        return firstTrainTime;
      }
      var data = currentMinute + minutesAway + currentHour * 60;
      var hourPart = (Math.floor(data / 60)) % 24;
      var minutePart = data % 60;

      if (hourPart < 10) {
        hourPart = "0" + hourPart;
      }

      if(data / 60 >= 24) {
        hourPart = "Tomorrow " + hourPart;
      }

      if (minutePart < 10) {
        minutePart = "0" + minutePart;
      }
      return hourPart + ":" + minutePart;
    }

    nextArrival = nextArrivalTime();
    // var nextArrivalA =  moment(nextArrival).format("hh:mm A");

    var deleteButton = $("<button>").addClass("btn btn-danger").html('<i class="fas fa-trash-alt"></i> Delete').attr("data-key", childSnapshot.key);

    deleteButton.on("click", function () {
      let key = $(this).attr("data-key");
      database.ref('trains/' + key).remove();
      $(this).parent().parent().remove();
    });
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(firstTrainTime),
      $("<td>").text(nextArrival),
      $("<td>").text(minutesAway),
      $("<td>").append(deleteButton)
      // $("<td>").html('')
    );

    // Append the new row to the table
    $("#current-trains table").append(newRow);

  });

  $("#delete").on("click", function (event) {
    event.preventDefault();

  });