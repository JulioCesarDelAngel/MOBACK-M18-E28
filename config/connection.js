const { connect, connection } = require('mongoose');

// Después de crear su aplicación de Heroku, visite https://dashboard.heroku.com/apps/, selecciona el nombre de la aplicación y agregue su cadena de conexión Atlas como Var de configuración
// El nodo buscará esta variable de entorno y, si existe, la utilizará. De lo contrario, asumirá que está ejecutando esta aplicación localmente
const connectionString =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/studentsDB';

connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

  useCreateIndex: true,
    useFindAndModify: false,
});

module.exports = connection;
