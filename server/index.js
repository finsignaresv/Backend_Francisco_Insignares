//Modulos importados
const   http        = require('http'),
        express     = require('express'),
        bodyParser  = require('body-Parser'),
        path        = require('path');


//Variables globales
var     port      = process.env.PORT || 8082,
        app       = express(),
        Server    = http.createServer(app);

 //Configuración de app
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded(
   {
     extended: true
   }));
 app.use(express.static(path.join(__dirname, '../public'))) //Pagina index.htmlde inicio

 Server.listen(port, function()
  {
    console.log("Servidor funcionando en puerto: " + port);
  });
