const sql = require('mssql');
const express = require('express');
const cors = require('cors');
// Configuración de la conexión

const port = process.env.PORT || 8000;
const config = {
    user: 'pr3admin',
    password: 'Server123',
    server: 'pr3app.database.windows.net',
    database: 'pr3database',
    port: 1433,
    options: {
        encrypt: true // Usar cifrado para conexiones con Azure
    }
};
const app = express();
app.use(cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));
  app.use(express.json());

app.post('/Login', (req, res) => {
        const jsonData = req.body;
        console.log(jsonData);
        const {Nombre , Password  }= jsonData;

        const pool = new sql.ConnectionPool(config);

        pool.connect().then(() => {
            const consult = `SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS credcorrectas FROM Usuarios WHERE Usuario = '${Nombre}' AND Contraseña = '${Password}';`;
            return pool.request().query(consult);
        }).then(result => {
            pool.close();
            return res.json(result.recordset);
        }).catch(err => {
            console.error('Error de conexión', err);
        });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
})