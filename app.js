// jshint esversion:6

require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
const fs = require('fs');
const path = require('path');

mongoose.connect(process.env.DATABASE,
	{ useNewUrlParser: true, useUnifiedTopology: true }, err => {
		console.log('connected')
	});

  const multer = require('multer');

  const storage = multer.diskStorage({
  	destination: (req, file, cb) => {
  		cb(null, 'uploads')
  	},
  	filename: (req, file, cb) => {
  		cb(null, file.fieldname + '-' + Date.now())
  	}
  });

  const upload = multer({ storage: storage });

  const imgModel = require('./models');

app.get("/", (req, res) => {
	res.render("home");
});
  app.get('/main', (req, res) => {
  	imgModel.find({}, (err, items) => {
  		if (err) {
  			console.log(err);
			}
  		else {
  			res.render('main', { items: items });
  		}
  	});
  });

  app.post('/main', upload.single('image'), (req, res, next) => {

  	const obj = {
  		name: req.body.name,
			locale: req.body.locale,
  		desc: req.body.desc,
  		img: {
  			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
  			contentType: 'image/png'
  		}
  	}
  	imgModel.create(obj, (err, item) => {
  		if (err) {
  			console.log(err);
  		}
  		else {
  			item.save();
  			res.redirect('/main');
  		}
  	});
  });

  const port = process.env.PORT || '3000';
  app.listen(port, () => {
  	console.log('Server listening on port', port)
  });
