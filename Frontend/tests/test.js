import { Builder, By, Key, until } from 'selenium-webdriver';

// Variables
const url = "https://2g4tp0th-5173.usw3.devtunnels.ms/";

const loginCredentials = {
    username: '123332',
    password: '1234'
};

const reporteData = {
    nombre: 'Estudiante Prueba',
    razon: 'Test',
    puntos: 1,
    clase: 'Español',
};

const estudianteData = {
    nombre: 'Estudiante Prueba',
    contrasena : '1234',
    semestre: '3',
    grupo: 'A',
    carrera: 'Ingeniería en Sistemas',
    identificador: '1233311'
};

const docenteData = {
    nombre: 'prueba Docente',
    contrasena: '1234',
    identificador: '3123232',
    isAdmin: true,
};

// Función de login sin cerrar sesión
const loginNoClose = async (driver) => {
    await driver.get(url);
    await driver.wait(until.urlIs(`${url}`), 5000);
    
    // Envía las credenciales de login
    const username = await driver.findElement(By.id('username'));
    await username.sendKeys(loginCredentials.username);
    const password = await driver.findElement(By.id('password'));
    await password.sendKeys(loginCredentials.password);
    const loginButton = await driver.findElement(By.id('Btnlogin'));
    await loginButton.click();

    await driver.wait(until.urlIs(`${url}consulta`), 5000);
    if (await driver.getCurrentUrl() === `${url}consulta`) {
        console.log('Login successful');
    } else {
        console.log('Login failed');
    }
    return driver;
    // Técnica de prueba de condición múltiple
};

// Función de logout
const logout = async (driver) => {
    await driver.wait(until.elementLocated(By.id('cerrar')), 5000);
    const logoutButton = await driver.findElement(By.id('cerrar'));
    await logoutButton.click();
    
    await driver.wait(until.urlIs(`${url}`), 5000);
    if (await driver.getCurrentUrl() !== `${url}`) {
        console.log('Logout failed');
    }
    // Técnica de prueba de condición
};

// Función de login con cierre de sesión después
const login = async (driver) => {
    await driver.get(url);
    const username = await driver.findElement(By.id('username'));
    await username.sendKeys(loginCredentials.username);
    const password = await driver.findElement(By.id('password'));
    await password.sendKeys(loginCredentials.password);
    const loginButton = await driver.findElement(By.id('Btnlogin'));
    await loginButton.click();
    await driver.wait(until.urlIs(`${url}consulta`), 5000);
    
    // Verifica si el login fue exitoso
    if (await driver.getCurrentUrl() === `${url}consulta`) {
        console.log('Login successful');
    } else {
        console.log('Login failed');
    }
    await logout(driver);  // Cierra sesión después de probar login
    // Técnica de prueba de decisión
    
};

// Función de consulta de estudiante
const consulta = async (driver) => {
    await loginNoClose(driver); 
    await driver.wait(until.urlIs(`${url}consulta`), 5000); 

    try {
        // Localiza la caja de texto y escribe el nombre
        const textBox = await driver.wait(until.elementLocated(By.className('identifier')), 5000);
        await textBox.clear();
        await textBox.sendKeys(reporteData.nombre);

        await driver.wait(until.elementLocated(By.css(".results-list")), 5000);

        const resultItem = await driver.wait(
            until.elementLocated(By.css(".results-list .result-item")),
            8000
        );

        await driver.wait(until.elementIsVisible(resultItem), 5000);

        const updatedResultItem = await driver.findElement(By.css(".results-list .result-item"));
        const resultText = await updatedResultItem.getText();
        if (resultText === "No se encontraron estudiantes.") {
            console.log('.');
        } else if (resultText === `Ricardo (10103)`) {
            console.log('Consulta successful');
        } else {
            console.log('Consulta failed: Resultado inesperado');
        }
    } catch (error) {
        console.error('Error en consulta:', error.message);
    } finally {
        await logout(driver);
    }
    // Técnica de prueba de ruta
};

// Función para generar un reporte
const generarReporte = async (driver) => {
    await loginNoClose(driver);  
    await driver.get(`${url}reporte`);
    await driver.wait(until.urlIs(`${url}reporte`), 5000);

    try {
        // Completa el formulario de reporte
        const nameLabel = await driver.wait(until.elementLocated(By.id('nombreEstudiante')), 5000);
        await nameLabel.sendKeys(reporteData.nombre);

        const suggestionItems = await driver.wait(until.elementsLocated(By.className('suggestion-item')), 5000);
        for (let item of suggestionItems) {
            const text = await item.getText();
            if (text === reporteData.nombre) {
                await item.click();

                const razon = await driver.wait(until.elementLocated(By.id('razonReporte')), 5000);
                await razon.sendKeys(reporteData.razon);

                const puntos = await driver.wait(until.elementLocated(By.id('puntos')), 5000);
                await puntos.sendKeys(reporteData.puntos);

                const clase = await driver.wait(until.elementLocated(By.id('clase')), 5000);
                await clase.sendKeys(reporteData.clase);

                const submitButton = await driver.findElement(By.className('submit-button'));
                await submitButton.click();

                try {
                    await driver.wait(until.alertIsPresent(), 2000);
                    const alert = await driver.switchTo().alert();
                    await alert.dismiss();
                } catch (alertError) {
                    console.log('.'); 
                }

                try {
                    const toastSuccess = await driver.wait(until.elementLocated(By.className('v-toast__item--success')), 5000);
                    if (toastSuccess) {
                        console.log('Generar reporte successful');
                    }
                } catch (successError) {
                    console.log('Generar reporte failed: No success or error toast found');
                }
                break;  // Sale del bucle después de generar el reporte
            }
        }
    } catch (error) {
        console.error('Error in generating report:', error.message);
    } finally {
        await logout(driver);
    }
    // Técnica de prueba de casos de uso
};

// Función para añadir estudiante
const añadirEstudiante = async (driver) => {
    await loginNoClose(driver);
    await driver.get(`${url}subir`);
    await driver.wait(until.urlIs(`${url}subir`), 5000);

    try {
        // Rellena el formulario de estudiante
        const nombre = await driver.wait(until.elementLocated(By.id('nombre')), 5000);
        await nombre.sendKeys(estudianteData.nombre);

        const apellido = await driver.wait(until.elementLocated(By.id('contrasena')), 5000);
        await apellido.sendKeys(estudianteData.contrasena);

        const grado = await driver.wait(until.elementLocated(By.id('semestre')), 5000);
        await grado.sendKeys(estudianteData.semestre);

        const grupo = await driver.wait(until.elementLocated(By.id('grupo')), 5000);
        await grupo.sendKeys(estudianteData.grupo);
        
        const identificador = await driver.wait(until.elementLocated(By.id('identificador')), 5000);
        await identificador.sendKeys(estudianteData.identificador);

        const button = await driver.wait(until.elementLocated(By.id('add-btn')), 5000);
        await button.click();

        // Manejo de alertas y toasts
        try {
            await driver.wait(until.alertIsPresent(), 2000);
            const alert = await driver.switchTo().alert();
            await alert.dismiss();
        } catch (alertError) {
            console.log('.');
        }

        try {
            const toastSuccess = await driver.wait(until.elementLocated(By.className('v-toast__item--success')), 5000);
            if (toastSuccess) {
                console.log('Estudiante añadido successful');
            }
        }
        catch (successError) {
            console.log('Estudiante añadido failed: No success or error toast found');
        }
    } catch (error) {
        console.error('Error in añadir estudiante:', error.message);
    } finally {
        await logout(driver);
    }
    // Técnica de prueba de tabla de decisiones
};

// Función para ejecutar todas las pruebas
const runTests = async () => {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        await login(driver);
        await consulta(driver);
        await añadirEstudiante(driver);
        await generarReporte(driver);
        await modificarEstudiante(driver);
        await añadirDocente(driver);
        await cambiarContrasenaDocente(driver);
        await cambiarContrasenaEstudiante(driver);
    } catch (error) {
        console.error('Error during tests:', error.message);
    } finally {
        await driver.quit();
    }
};

runTests();
C:/Users/quelo/OneDrive/Documents/GitHub/Reportes/backend/src/config