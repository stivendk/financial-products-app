# Financial Products App
## Descripción
Prueba técnica sobre integración de servicios a proyecto frontend en Angular
Este proyecto es una aplicación Angular para gestionar productos financieros. Permite visualizar, buscar, agregar, editar y eliminar productos. La aplicación también está configurada para realizar pruebas unitarias con Jest y para analizar la cobertura del código.

## Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/stivendk/financial-products-app.git
   cd financial-products-app
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
## Ejecución de la aplicación:
Para iniciar la aplicación en modo desarrollo, usa:
```bash
ng serve
```
O tambien:
```bash
npm run start
```
La aplicación estará disponible en http://localhost:4200.

## Ejecución de Pruebas
Para ejecutar las pruebas unitarias con Jest, usa:
```bash
npm test
```
El informe de cobertura se generará en el directorio coverage.

## Estructura de Pruebas
Las pruebas están organizadas en archivos .spec.ts ubicados junto a los archivos de código fuente correspondientes. Las pruebas están configuradas para usar Jest como framework de pruebas.

# Nota
El proyecto de repo-interview-main no tiene habilitado la configuración de CORS, para que funcione correctamente el consumo de este micro servicio, se debe descomentar la opción 
en la clase main.ts
```typescript
cors:true
```
   
