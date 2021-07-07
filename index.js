//Make sure you have those modules installed
var express = require('express');
const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
// Usage is basically sending a post request to your node.js server with notification info, make sure you include registrationToken
const port = process.env.PORT || 3001;

var app = express();
app.use(express.urlencoded());
app.use(express.json());



app.listen(port, () => {
	console.log('Listening on port ' + port);
});

var admin = require("firebase-admin");

//Service account example ./URL-firebase-adminsdk-phbcw-tag.json
//databaseURL is your firebase db URL
var serviceAccount = require("changeme");
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "changeme"
});


app.post('/firebase/notification', (req, res) => {
	//Setup what you want to get from the body, make sure you include the registrationToken with it.
	//For example, you can relay data in the notification as shown below
	//modify the code accordingly to your liking.
	//console.log(req.body);
	const registrationToken = req.body.registrationToken

	if (req.body.Type == "1") {
		var test = req.body.test;
		var payload = {
			notification: {
				title: "New Notification!",
				body: "Press Ok to Proceed"
			},
			data: {
				"myTest": test
			}
		};
		var options = {
			priority: "normal",
			timeToLive: 60 * 60
		};
	}
	else if (req.body.Type == "2") {
		var payload = {
			notification: {
				title: "This is notification type 2!",
				body: "Peep poop you got a notification!"
			}
		};
		var options = {
			priority: "normal",
			timeToLive: 60 * 60
		};
	}
	sendNotif(registrationToken, payload, options, res);

})


function sendNotif(registrationToken, payload, options, res) {
	admin.messaging().sendToDevice(registrationToken, payload, options)
		.then(function (response) {
			console.log("Successfully sent message:", response);
			res.json({ result: `Message sent` });
		})
		.catch(function (error) {
			console.log("Error sending message:", error);
			res.json({ result: `Message failed to send` });
		});
}
