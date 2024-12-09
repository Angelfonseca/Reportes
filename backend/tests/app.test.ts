import request from 'supertest';
import { app } from '../src/app';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Interfaz que define la estructura de un estudiante
interface Student {
  _id?: string; // ID del estudiante
  __v?: number; // Versión del documento
  nombre: string; // Nombre del estudiante
  contrasena: string; // Contraseña del estudiante
  semestre: string; // Semestre en el que está el estudiante
  grupo: string; // Grupo al que pertenece el estudiante
  usuario: string; // Usuario/ID del estudiante
  fotografia?: string; // URL de la fotografía del estudiante
  reportes?: string[]; // Array de IDs de reportes asociados al estudiant
  cambioContrasena?: boolean; // Indica si se ha cambiado la contraseña
  puntos?: number; // Puntos acumulados por el estudiante
  fueraSistema?: boolean; // Indica si el estudiante está fuera del sistema
}

// Estructura esperada para un estudiante en las respuestas de la API
const StudentExpected = {
  _id: expect.any(String),
  __v: expect.any(Number),
  nombre: expect.any(String),
  contrasena: expect.any(String),
  semestre: expect.any(String),
  grupo: expect.any(String),
  usuario: expect.any(String),
  fotografia: expect.any(String),
  reportes: expect.any(Array),
  cambioContrasena: expect.any(Boolean),
  puntos: expect.any(Number),
  fueraSistema: expect.any(Boolean)
};

// Datos de un estudiante que se utilizarán para crear un nuevo estudiante en la API
const studentToCreate: Student = {
  nombre: 'Test',
  contrasena: 'test',
  semestre: "4",
  grupo: 'A',
  usuario: '3112222122',
  fotografia: 'test'
};

// Nueva contraseña para actualizar la contraseña del estudiante
const newPass = '123456';
const students = [
  {
    "_id": "66edaa5b9b9236c115d1591d",
    "nombre": "true Paco",
    "contrasena": "1234",
    "semestre": "3",
    "grupo": "A",
    "usuario": "201050207",
    "fotografia": "https://res.cloudinary.com/dkdq8xhwq/image/authenticated/s--RWNctuzN--/v1729064681/uploads/201050207.jpeg.jpg",
    "reportes": [
      {
        "$oid": "66fab7f0e61480cfb2970eba"
      }
    ],
    "puntos": 20,
    "__v": 0,
    "cambioContrasena": true
  },
  {
    "_id": "66f17e658d1e792430a1e5e1",
    "nombre": "Ricardo",
    "contrasena": "",
    "semestre": "4",
    "grupo": "C",
    "usuario": "10103",
    "fotografia": "https://res.cloudinary.com/dkdq8xhwq/image/authenticated/s--a0N4AkXW--/v1729546421/uploads/10103.jpg",
    "reportes": [
      {
        "$oid": "66f182488d1e792430a1e5f8"
      }
    ],
    "puntos": 198,
    "__v": 0
  },
];


 // Rutas de la API de estudiantes
describe('Students API Routes', () => {
  let token = ''; // Token de autorización
  let studentId = ''; // ID del estudiante creado

  // Función para establecer el encabezado de autorización en las solicitudes
  const auth = () => ({ Authorization: `${token}` });

  // Antes de todas las pruebas, se obtiene un token de autorización
  beforeAll(async () => {
    const response = await request(app)
      .get('/api/estudiantes/test');
    token = response.body.token.tokenforTest;
  });

  // Prueba para crear un nuevo estudiante
  it('should return 201 and create a student', async () => {
    const response = await request(app)
      .post('/api/estudiantes')
      .send(studentToCreate)
      .set(auth());
    expect(response.body).toEqual(StudentExpected);
    expect(response.status).toBe(201);
    // Técnica: Partición de equivalencia (validar creación con datos válidos)
  });

  // Prueba para obtener todos los estudiantes
  it('should return more than one student', async () => {
    const response = await request(app)
      .get('/api/estudiantes')
      .set(auth());
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);
    // Técnica: Prueba de casos de uso (verificar la obtención de varios estudiantes)
  });

  // Prueba para obtener un estudiante que no existe
  it('should return 404 for non-existent student', async () => {
    const id = '60f3b3b3b3b3b3b3b3b3b3b3';
    const response = await request(app)
      .get(`/api/estudiantes/get/${id}`)
      .set(auth());
    expect(response.status).toBe(404);
    // Técnica: Análisis del valor límite (verificar cómo responde con un ID no válido)
  });

  // Prueba para obtener un estudiante por su nombre de usuario
  it('should return 200 and the student by username', async () => {
    const response = await request(app)
      .get(`/api/estudiantes/username/${studentToCreate.usuario}`)
      .set(auth());
    expect(response.body).toEqual(StudentExpected);
    studentId = response.body._id;
    expect(response.status).toBe(200);
    // Técnica: Partición de equivalencia (verificar obtención con un nombre de usuario válido)
  });

  // Prueba para obtener un estudiante por su ID
  it('should return 200 and the student by ID', async () => {
    const response = await request(app)
      .get(`/api/estudiantes/get/${studentId}`)
      .set(auth());
    expect(response.body).toEqual(StudentExpected);
    expect(response.status).toBe(200);
    // Técnica: Prueba de casos de uso (verificar obtención por ID)
  });

  // Prueba para actualizar la contraseña de un estudiante
  it('should return 200 and update the student password', async () => {
    const response = await request(app)
      .patch(`/api/estudiantes/auth/changePassword/${studentId}`)
      .send({ oldPass: studentToCreate.contrasena, newPass: newPass, change: true })
      .set(auth());
    expect(response.body).toEqual(StudentExpected);
    expect(response.status).toBe(200);
    // Técnica: Tabla de decisiones (verificar actualización de la contraseña)
  });

  // Prueba para actualizar el semestre de varios estudiantes
  it('should return 200 and update students\' semester', async () => {
    const response = await request(app)
      .post('/api/estudiantes/semestre')
      .send({ students: students.map(student => student._id?.toString()) })
      .set(auth());
    expect(response.body.length).toBeGreaterThan(1);
    expect(response.status).toBe(200);
    // Técnica: Prueba de casos de uso (verificar la actualización del semestre de varios estudiantes)
  });

  // Prueba para eliminar un estudiante
  it('should return 200 and delete the student', async () => {
    const response = await request(app)
      .delete(`/api/estudiantes/${studentId}`)
      .set(auth());
    expect(response.body).toEqual(StudentExpected);
    expect(response.status).toBe(200);
    // Técnica: Partición de equivalencia (verificar eliminación de un estudiante válido)
  });
});


// Estructura esperada para un maestro en las respuestas de la API
const TeacherExpected = {
  __v: expect.any(Number),
  _id: expect.any(String),
  nombre: expect.any(String),
  contrasena: expect.any(String),
  usuario: expect.any(String),
  fotografia: expect.any(String),
  isAdmin: expect.any(Boolean),
  cambioContrasena: expect.any(Boolean),
  nonAdmin: expect.any(Boolean)
};

// Datos de un maestro que se utilizarán para crear un nuevo maestro en la API
const teacherToCreate = {
  nombre: 'Test',
  contrasena: 'test',
  usuario: '123122224',
  isAdmin: false,
  nonAdmin: true
};


// Descripción de las pruebas para las rutas de la API de maestros
describe('Teachers API Routes', () => {
  let token = ''; // Token de autorización
  let teacherId = ''; // ID del maestro creado

  // Función para establecer el encabezado de autorización en las solicitudes
  const auth = () => ({ Authorization: `${token}` });

  // Antes de todas las pruebas, se obtiene un token de autorización
  beforeAll(async () => {
    const response = await request(app)
      .get('/api/estudiantes/test');
    token = response.body.token?.tokenforTest;
  });

  // Después de todas las pruebas, se eliminan los datos del maestro creado si existe
  afterAll(async () => {
    if (teacherId) {
      await request(app).delete(`/api/maestros/${teacherId}`).set(auth());
    }
  });

  // Prueba para crear un nuevo maestro
  it('should return 201 and create a teacher', async () => {
    const response = await request(app)
      .post('/api/maestros')
      .send(teacherToCreate)
      .set(auth());
    expect(response.status).toBe(201);
    expect(response.body).toEqual(TeacherExpected);
    teacherId = response.body._id; // Almacena el ID del maestro creado
    // Técnica: Partición de equivalencia (verificar creación de maestro con datos válidos)
  });

  // Prueba para obtener todos los maestros
  it('should return more than one teacher', async () => {
    const response = await request(app)
      .get('/api/maestros')
      .set(auth());
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0); // Verifica que haya al menos un maestro
    // Técnica: Prueba de casos de uso (verificar obtención de múltiples maestros)
  });

  // Prueba para obtener un maestro que no existe
  it('should return 404 for a non-existent teacher', async () => {
    const response = await request(app)
      .get('/api/maestros/get/60f3b3b3b3b3b3b3b3b3b3b3')
      .set(auth());
    expect(response.status).toBe(404); // Verifica que el estado de la respuesta sea 404
    // Técnica: Análisis del valor límite (verificar cómo responde con un ID no válido)
  });

  // Prueba para obtener un maestro por su nombre de usuario
  it('should return 200 and the teacher by username', async () => {
    const response = await request(app)
      .get(`/api/maestros/user/${teacherToCreate.usuario}`)
      .set(auth());
    expect(response.status).toBe(200);
    expect(response.body).toEqual(TeacherExpected); // Verifica que la respuesta sea la esperada
    // Técnica: Partición de equivalencia (verificar obtención con un nombre de usuario válido)
  });

  // Esta prueba verifica que se devuelve un estado 200 y el maestro por ID.
  it('should return 200 and the teacher by ID', async () => {
    const response = await request(app)
      .get(`/api/maestros/get/${teacherId}`)
      .set(auth());
    expect(response.status).toBe(200);
    expect(response.body).toEqual(TeacherExpected);
    // Técnica: Prueba de casos de uso (verificar obtención por ID)
  });
  
  // Esta prueba verifica que se devuelve un estado 200 y se actualiza la contraseña del maestro.
  it('should return 200 and update the teacher password', async () => {
    const newPassword = 'newPass123';
    const response = await request(app)
      .patch(`/api/maestros/auth/changePassword/${teacherId}`)
      .send({ oldPass: teacherToCreate.contrasena, newPass: newPassword, change: true })
      .set(auth());
    expect(response.status).toBe(200);
    expect(response.body).toEqual(TeacherExpected);
    // Técnica: Tabla de decisiones (verificar actualización de la contraseña)
  });

  // Esta prueba verifica que se devuelve un estado 200 y se elimina al maestro.
  it('should return 200 and delete the teacher', async () => {
    const response = await request(app)
      .delete(`/api/maestros/${teacherId}`)
      .set(auth());
    expect(response.status).toBe(200);
    expect(response.body).toEqual(TeacherExpected);
    teacherId = ''; 
    // Técnica: Partición de equivalencia (verificar eliminación de un maestro válido)
  });
});