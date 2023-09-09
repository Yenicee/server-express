const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const fs = require('fs');
const handlebars = 'express-handlebars';
const app = express();
const bodyParser = require('body-parser');
const productRouter = require('./routes/product'); 
const cartsRouter = require('./routes/carts'); 

// Configura el motor de plantillas Handlebars
//app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

// Ruta para mostrar la vista de inicio
app.get('/home', (req, res) => {
    const products = loadProductsFromFile();
    res.render('home', { products });
});

// Monta los enrutadores en sus rutas respectivas
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

const server = http.createServer(app);
const io = new Server(server);

const PORT = 8080;

server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
