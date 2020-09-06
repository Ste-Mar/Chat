var express = require("express");
var bodyParser = require ("body-parser")
var app = express();
var http =require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require ('mongoose')
var port = process.env.PORT || 5000 // En el caso de que no se asigne un puerto, localmente se encuentra en 5000


app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dbUrl = 'mongodb+srv://.....' //Aca se debe colocar el connection string de la web mlab. Colocar la url con adm y contraseña personal

var Mensaje = mongoose.model('Mensaje',{

    nombre: String,
    mensaje: String
})

app.get('/mensajes', (req, res) => {
    Mensaje.find({}, (err, mensajes) =>{
    res.send(mensajes); //localhost:xxxx/mensajes 
    })
});

app.post('/mensajes', (req, res) => {
    var mensaje = new Mensaje(req.body)
    mensaje.save((err) => {
        if (err)
            sendStatus(500) //Error server
        else
            io.emit('mensaje',req.body)
            res.sendStatus(200)
    })
});

io.on('connection', (socket)=>{   
    console.log('usuario conectado')
})

mongoose.connect(dbUrl,(err) => {
    console.log('mongodb conexion completa')


});

var server = http.listen(port, () => {
	console.log("Server funcionando en el puerto %d", port);
});




