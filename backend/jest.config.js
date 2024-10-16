// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.ts'], // Asegúrate de que las pruebas estén en .ts y en la carpeta /test
    moduleFileExtensions: ['ts', 'js'],         // Para que Jest busque archivos .ts y .js
    transform: {
      '^.+\\.ts$': 'ts-jest',                   // Transforma los archivos .ts usando ts-jest
    },
  };
  