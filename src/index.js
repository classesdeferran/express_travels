// Importar los módulos
const path = require('path');
const express = require('express');
const app = express();

const morgan = require('morgan');

// Recuperar el valor del puerto de conexión
process.loadEnvFile()
const PORT = process.env.PORT;
// console.log(PORT)

// Cargar los datos
const datos = require('../data/travels.json');
const arrayDestinos = []
datos.forEach(destino => {
    arrayDestinos.push(destino.lugar)
})
// console.log(arrayDestinos)

// Configuración de la plantilla
app.set('view engine', 'ejs');
app.set('views', './views');

// Middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))

// Indicar la carpeta con recursos estáticos
app.use(express.static(path.join(__dirname, '../public')));


// Rutas
datos.forEach(destino => {
    app.get(`${destino.ruta}`, (req, res) => {
        res.render("index", { h2: `${destino.nombre}`, img: `${destino.img}`, descripcion: `${destino.descripcion}`, precio: `${destino.precio}`, destinos: datos })
    })
})

app.get('/admin', (req, res) => {
    res.sendFile('admin.html', { root: path.join(__dirname, '../public') })
})

app.post('/insert', (req, res) => {
    const destino = req.body
    datos.push(destino)
    
})

app.listen(PORT, () => { console.log(`Servidor en http://localhost:${PORT}`) });