import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('operaciones.db');

// Crear la tabla de operaciones
export const createTables = () => {
  try {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS operaciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tipo_operacion TEXT NOT NULL,
          operando1 REAL,
          operando2 REAL,
          operando3 REAL,
          resultado REAL
        );`,
        [],
        () => console.log('Tabla de operaciones creada'),
        (tx, error) => console.error('Error al crear tabla de operaciones', error)
      );
    });
  } catch (error) {
    console.error('Error al iniciar la base de datos', error);
  }
};

// Insertar una operación
export const insertOperacion = (tipo_operacion, operando1, operando2, operando3, resultado) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO operaciones (tipo_operacion, operando1, operando2, operando3, resultado) VALUES (?, ?, ?, ?, ?);',
      [tipo_operacion, operando1, operando2, operando3, resultado],
      (txObj, resultSet) => console.log('Operación insertada', resultSet),
      (txObj, error) => console.error('Error al insertar operación', error)
    );
  });
};

// Obtener todas las operaciones
export const getOperaciones = (setOperaciones) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM operaciones;',
      [],
      (txObj, { rows: { _array } }) => setOperaciones(_array),
      (txObj, error) => console.error('Error al obtener operaciones', error)
    );
  });
};
