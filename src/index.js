// Importar los módulos
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto')
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
    // res.sendFile('admin.html', { root: path.join(__dirname, '../public') })
    res.render('admin', {datos});

})

app.post('/insert', (req, res) => {
    const destino = req.body
    // destino.id = Date.now().toLocaleString()
    destino.id = crypto.randomUUID()
    datos.push(destino)
    fs.writeFileSync( path.join( __dirname, '../data/travels.json'), JSON.stringify(datos, null, 2), (err, data) => { 
        if (err) console.log(err)
        });
    res.redirect("/admin")
})

app.delete("/eliminar/:id", (req, res) => {
    const id = req.params.id
    // console.log("id = ", id);
    let newData = datos.filter(destino => destino.id !== id )
    // console.log(newData);
    fs.writeFileSync( path.join( __dirname, '../data/travels.json'), JSON.stringify(newData, null, 2), (err) => { 
        if (err) res.json({"mensaje": "Problema con el borrado"})
        });
        res.json({"mensaje": "Elemento borrado correctamente"})
})

app.listen(PORT, () => { console.log(`Servidor en http://localhost:${PORT}`) });