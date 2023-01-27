const { Student, Course } = require('../models');

// TODO: Crear una función agregada para obtener la cantidad de estudiantes en general
const headCount = async () =>
  Student.aggregate()
    // Su código aquí
    .then((numberOfStudents) => numberOfStudents);

// TODO: Crear una función que ejecute el método agregado en el modelo de estudiante y que calcule la calificación general utilizando el operador $prom
const grade = async (studentId) =>
  Student.aggregate([
    {
      $unwind: '$assignments',
    },
    {
      // Su código aquí
    },
  ]);

module.exports = {
  // Obtiene todos los estudiantes
  getStudents(req, res) {
    Student.find()
      .then(async (students) => {
        const studentObj = {
          students,
          headCount: await headCount(),
        };
        return res.json(studentObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Obtiene un solo estudiante
  getSingleStudent(req, res) {
    Student.findOne({ _id: req.params.studentId })
      .select('-__v')
      .lean()
      .then(async (student) =>
        !student
          ? res.status(404).json({ message: 'No student with that ID' })
          : res.json({
              student,
              grade: await grade(req.params.studentId),
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // crea un nuevo estudiante
  createStudent(req, res) {
    Student.create(req.body)
      .then((student) => res.json(student))
      .catch((err) => res.status(500).json(err));
  },
  // Eliminar a un estudiante y eliminarlo del curso
  deleteStudent(req, res) {
    Student.findOneAndRemove({ _id: req.params.studentId })
      .then((student) =>
        !student
          ? res.status(404).json({ message: 'No such student exists' })
          : Course.findOneAndUpdate(
              { students: req.params.studentId },
              { $pull: { students: req.params.studentId } },
              { new: true }
            )
      )
      .then((course) =>
        !course
          ? res.status(404).json({
              message: 'Student deleted, but no courses found',
            })
          : res.json({ message: 'Student successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Agregar una asignación a un estudiante
  addAssignment(req, res) {
    console.log('You are adding an assignment');
    console.log(req.body);
    Student.findOneAndUpdate(
      { _id: req.params.studentId },
      { $addToSet: { assignments: req.body } },
      { runValidators: true, new: true }
    )
      .then((student) =>
        !student
          ? res
              .status(404)
              .json({ message: 'No student found with that ID :(' })
          : res.json(student)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Eliminar la asignación de un estudiante
  removeAssignment(req, res) {
    Student.findOneAndUpdate(
      { _id: req.params.studentId },
      { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
      { runValidators: true, new: true }
    )
      .then((student) =>
        !student
          ? res
              .status(404)
              .json({ message: 'No student found with that ID :(' })
          : res.json(student)
      )
      .catch((err) => res.status(500).json(err));
  },
};
