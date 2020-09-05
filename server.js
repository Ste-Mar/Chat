//Se utilizo mondgodB ATLAS - HEROKU - git


var express = require("express");
var bodyParser = require ("body-parser")
//const { request } = require("express");
var app = express();
var http =require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require ('mongoose')
var port = process.env.PORT || 5000 // En el caso de que no se asigne un puerto, localmente se encuentra en 5000


app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dbUrl = 'mongodb+srv://adm:thehives@proyectoudemy.2lps3.mongodb.net/ProyectoUdemy?retryWrites=true&w=majority'

var Mensaje = mongoose.model('Mensaje',{

    nombre: String,
    mensaje: String
})

/*var mensajes = [
    {nombre:"Leandro", mensaje:"Como esta esa barba"},
    {nombre:"Bulga", mensaje:"El hacker"}
]*/

app.get('/mensajes', (req, res) => {
    Mensaje.find({}, (err, mensajes) =>{
    res.send(mensajes); //localhost:40xx/mensajes 
    })
});

app.post('/mensajes', (req, res) => {
    var mensaje = new Mensaje(req.body)
    mensaje.save((err) => {
        if (err)
            sendStatus(500) //Error server
        else
            //mensajes.push(req.body)
            io.emit('mensaje',req.body)
            res.sendStatus(200)
    })
});

io.on('connection', (socket)=>{   
    console.log('usuario conectado')
})

/* Otra forma de expresar las lineas de arriba

io.sockets.on('connection', function(socket){
    console.log("new client connected");
});*/


mongoose.connect(dbUrl,(err) => {
    console.log('mongodb conexion completa')


});

var server = http.listen(port, () => {
	console.log("Server funcionando en el puerto %d", port);
});




