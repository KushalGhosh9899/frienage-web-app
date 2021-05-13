const express =  require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');


mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.connection.on('connected',()=>{
    console.log("Connected to mongo Server");
})
mongoose.connection.on('error',(error)=>{
    console.log("Connection error: ",error);
})


require('./models/user');
require('./models/post');
require('./models/messages');
require('./models/conversation');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));
app.use(require('./routes/messages'));

app.listen(PORT,()=>{
    console.log("server is running on ",PORT);
})