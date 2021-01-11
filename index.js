const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('Orders'));
app.use(express.static('services'));
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9ypd.mongodb.net/${process.env
	.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
	const servicesCollection = client.db('creativeAgency').collection('services');
	const reviewsCollection = client.db('creativeAgency').collection('reviews');

	console.log('Creative Agency DataBase Connected');

	// Added all services Information
	app.post('/addServices', (req, res) => {
		const mainData = req.body;
		servicesCollection.insertMany(mainData).then((result) => {
			console.log(result);
			console.log(result.insertedCount, 'Data Inserted');
			res.send(result.insertedCount);
		});
	});

	// Get all services Information
	app.get('/Services', (req, res) => {
		servicesCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});


	// Added Review Information
	app.post('/addReviews', (req, res) => {
		const newVolunteer = req.body;
		reviewsCollection.insertMany(newVolunteer).then((result) => {
			console.log(result, 'Review Inserted');
			res.send(result.insertedCount > 0);
		});
	});

		// Get all reviewsInformation
		app.get('/Reviews', (req, res) => {
			reviewsCollection.find({}).toArray((err, documents) => {
				res.send(documents);
			});
		});

	
});

app.get('/', (req, res) => {
	res.send('<h1>Welcome to Creative Agency Server</h1>');
});

app.listen(process.env.PORT || 8080, () => console.log('I am listening from 8080'));
