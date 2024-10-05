const express = require('express');
require('./config/db');
const PORT = 4000; // assigining port number to start the server

const cpu = require('./routes/AssetIteam/cpu.js')
const empname = require('./routes/EmployeeName/employeename.js')
const History = require('./routes/AssetIteam/History.js')
const Keyboard = require('./routes/AssetIteam/keyboard.js')

const cors = require('cors');

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cpu);
app.use(empname);
app.use(History);
app.use(Keyboard);

// Set up CORS middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 ,// For legacy browser support
    methods: "GET, PUT, POST"
};
// CORS end





app.listen(PORT, () => {  // starting the server to listen on the above mentioned port number
    console.log(`The server is running on port ${PORT}`);  //display message in console
});
