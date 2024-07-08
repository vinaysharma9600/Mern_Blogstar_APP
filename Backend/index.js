const connectToMongo = require('./db');
connectToMongo();
const express = require('express')
const app = express()
const port = 5000;
const cors = require('cors')

//Middleware  for use req json object
app.use(cors());
app.use(express.json());

//Available Routes
app.use('/api/auth',require('./Routes/auth'))
app.use('/api/notes',require('./Routes/notes'))



app.listen(port, () => {
  console.log(`Blogstar app listening on port ${port}`);
})  