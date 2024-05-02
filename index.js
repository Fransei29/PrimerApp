// --- Importación de módulos y configuración básica

const express = require('express'); // Importar Express
const app = express(); // Crear una instancia de la aplicación Express
const path = require('path'); // Importar el módulo 'path' para manejar rutas de archivos
const { getName, sayHello } = require('./public/functions/functions.js'); // Importar funciones desde un archivo
const cookieParser = require('cookie-parser'); // Importar el módulo 'cookie-parser' para manejar cookies
const session = require('express-session'); // Importar el módulo 'express-session' para manejar sesiones
const bodyParser = require('body-parser'); // Importar el módulo 'body-parser' para analizar datos de formularios POST
const { Pool } = require('pg') // Importar el objeto 'Pool' de Postgres (Base de Datos) [Ahora usaremos Sequelize]
// const { Sequelize, Model, DataTypes } = require('sequelize') // Importar 'Sequelize' para coneccion de Base de datos Postgres
require('dotenv').config(); //Importar y cargar las variables de entorno desde el archivo .env

app.set("view engine", "pug"); // Configurar el motor de vistas como Pug
app.set('views', path.join(__dirname, 'views')); // Establecer la ubicación de las vistas

// --- Configuración de middleware y rutas

app.use(express.static('public')); // Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(cookieParser()); // Middleware para manejar cookies
app.use(bodyParser.urlencoded({ extended: false })); // Middleware para analizar datos de formularios URL-encoded
app.use(express.urlencoded({ extended: true })); // Middleware para analizar datos de formularios

app.post('/submit-form', (req, res) => {
    const username = req.body.username; // Obtener el valor del campo 'username' del formulario POST
    console.log('Username submitted:', username); // Imprimir el nombre en la consola
    res.end(); // Finalizar la respuesta
});

app.use(session({
    'secret': '343ji43j4n3jn4jk3sn', // Clave secreta para firmar la sesión
    resave: false,  // Evitar guardar sesiones sin cambios
    saveUninitialized: false // Evitar guardar sesiones no inicializadas
}));

app.get('/about', (req, res) => {
    res.render('about',  { title: 'About Us' }); // Renderizar la página 'about' con Pug
});

app.get('/index', (req, res) => {
    res.cookie('username', 'Flavio', { domain: '.flaviocopes.com', path: '/administrator', secure: true })// Establecer la cookie 'username' con el valor 'Flavio'
    res.render('index', { title: 'Home Page' }); // Renderizar la página 'index' con Pug
    console.log(req.query); // Imprimir los parámetros de consulta en la consola
});

// Configuración de la base de datos PostgreSQL
// Primero configuramos las variables de entorno en la terminal con el comando 'set' (para no escribir data sensible en el codigo) Ejemplo:
// set PGHOST=localhost
// set PGUSER=tu_usuario_postgres
// set PGDATABASE=tu_nombre_db_postgres
// set PGPASSWORD=tu_contraseña_postgres
// set PGPORT=tu_puerto_postgres


// Creamos el objeto 'Pool' que se utiliza para manejar las conexiones a la base de dato. Se configura con las variables de entorno anteriores.
const pool = new Pool({              
    user: process.env.USER,
    host: process.env.HOST,                       
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
});

// Ejemplo de ejecución de una consulta SQL
// En este caso estamos solicitando los tipos de datos disponibles en la base de datos, osea qué:
// Seleccionamos la COLUMNA {typtype} de la  TABLA {pg_type})

// FORMA 1psql -U tu_usuario
// pool.query('SELECT typtype FROM pg_type', (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return;
//     }
//     console.log('Query results:', results.rows);
// });

// FORMA 2
// (async () => {
//     const res = await pool.query('SELECT typtype FROM pg_type')
//     for (const row of res.rows) {
//       console.log(row.typtype)
//     }
//   })()



// INSERT INTO query para ingresar data a una tabla using node-postgres
// async function insertData() {
//   const name = 'Roger';
//   const age = 8;
  
//   try {
//     await pool.query('INSERT INTO dogs VALUES ($1, $2)', [name, age]);
//     console.log('Datos insertados correctamente');
// } catch(err) {
//     console.error('Error al insertar datos:', err);
// }
// }
  
// Llamar a la función insertData para insertar los datos
// insertData();

// UPDATE query para actualizar data 
// igual que la anterior pero cambiamos el query y luego llamamos la funcion
// ('UPDATE dogs SET age = $2 WHERE name = $1', [name, age])


// --- Prueba de una correcta coneccion con las variables de entorno
const port = process.env.PORT;
console.log('El puerto es:', port);

const password = process.env.PASSWORD;
console.log('La contraseña es:', password);


// --- Inicio del servidor
app.listen(8080, () => console.log('Server ready'))