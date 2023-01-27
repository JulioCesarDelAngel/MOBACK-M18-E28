const connection = require('../config/connection');
const { Course, Student } = require('../models');
const { getRandomName, getRandomAssignments } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Descarta cursos existentes
  await Course.deleteMany({});

  // Descarta los estudiantes existentes
  await Student.deleteMany({});

  // Crea una matriz vacía para contener a los estudiantes
  const students = [];

  // Obtiene algunos objetos de asignación aleatoria utilizando una función auxiliar que importamos de ./data
  const assignments = getRandomAssignments(20);

  // Crea un bucle 20 veces; agregar estudiantes a la matriz de estudiantes
  for (let i = 0; i < 20; i++) {
    const fullName = getRandomName();
    const first = fullName.split(' ')[0];
    const last = fullName.split(' ')[1];
    const github = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;

    students.push({
      first,
      last,
      github,
      assignments,
    });
  }

  // Agrega estudiantes a la recopilación y esperar los resultados
  await Student.collection.insertMany(students);

  // Agrega cursos a la recopilación y esperar los resultados
  await Course.collection.insertOne({
    courseName: 'UCLA',
    inPerson: false,
    students: [...students],
  });

  // Cierra la sesión de los datos de siembra para indicar lo que debería aparecer en la base de datos
  console.table(students);
  console.table(assignments);
  console.info('Seeding complete! ðŸŒ±');
  process.exit(0);
});
