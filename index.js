var PORT = process.env.PORT || 5000;

const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

var http = require('http');
var server = http.Server(app);


server.listen(PORT, function() {
    console.log('vidly server running');
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.on('message', function(msg) {
    io.emit('message', msg);
  });
});


app.get('/', function(req,res){
    res.send('Hello World');
});

const genres= [
    { id: 1, name: "Action" },
    { id: 2, name: "Horror" },
    { id: 3, name: "Comedy" }
]

app.get('/api/genres', (req,res)=>{
    res.send(genres);
});

app.get('/api/genres/:id', (req, res)=>{
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The course with given id is not found');
    res.send(genre);
});

app.post('/api/genres', (req,res)=>{
    const { error } = validateGenres(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});


app.put('/api/genres/:id',(req, res)=>{
    
    const genre = genres.find(g => g.id ===parseInt(req.params.id));
    if(!genre) return res.status(404).send('The course with given id is not found');

    //const result = validateGenres(req.body);
    const { error } = validateGenres(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;

    res.send(genre);
});

app.delete('/api/genres/:id', (req,res)=>{
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The course with given id is not found');

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);

})

function validateGenres(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
}
