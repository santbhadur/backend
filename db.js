const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://yrohan645:yoHHVZ82lZkG4Kt3@rohan.zysfuhl.mongodb.net/New?retryWrites=true&w=majority&appName=Rohan';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB database');
})
.catch((err) => {
  console.error('❌ Error connecting to MongoDB:', err);
});

module.exports = mongoose;
