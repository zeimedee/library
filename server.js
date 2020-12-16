const express = require('express');
const cors = require('cors');
const connectDB = require('./connection')
const PORT = 4000;

const route = require('./routes');

const app = express();

app.use(express.json());
app.use(cors());

connectDB();


app.use('/library', route);
app.listen(PORT,()=>{
        console.log(`server is running on port: ${PORT}`);
})