const mongoose = require('mongoose');

const tourShema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'the tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    price: {
        type: Number,
        required: true
    }
});

const Tour = mongoose.model('Tour',tourShema);
module.exports = Tour;