// Importar los módulos
const express = require('express');
const app = express();

// Recuperar el valor del puerto de conexión
process.loadEnvFile()
const PORT = process.env.PORT || 3000;
