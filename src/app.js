const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de Handlebars como motor de plantillas
app.set('view engine', 'handlebars');
app.set('views', __dirname+'/views');
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', handlebars.create());


AudioParamMap.set('view engine', 'handlebars');

// Ruta para mostrar la vista de inicio
app.get('/home', (req, res) => {
    const products = loadProductsFromFile();
    res.render('home', { products });
});

// Monta los enrutadores en sus rutas respectivas
const productRouter = require('./routes/product'); 
const cartsRouter = require('./routes/carts'); 

app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;

Server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

