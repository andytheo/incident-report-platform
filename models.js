const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
	name: String,
	locale: String,
	desc: String,
	img:
	{
		data: Buffer,
		contentType: String
	}
});

module.exports = new mongoose.model('Image', imageSchema);
