# CopyPaste - Trabajo Integrador del Cuarto Semestre Año 2023

![Logo Copy:Paste](https://user-images.githubusercontent.com/103675851/232830051-f665dac5-7813-4c63-8612-a451b562bdf7.jpg)

<div id="header" align="end">
		<h3 align="end">Repositorio del trabajo integrador en JavaScript del grupo CopyPaste</h3>
		<h4 align="end">En este repositorio se encuentra el trabajo integrador del cuarto semestre</h4>
</div>

<div >
  <h2> 📚 Tecnologías del repositorio: </h2>
	<br>
  <div align="center">
	  <img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-plain.svg" title="JavaScrip" alt="JS" width="35" height="35">&nbsp; JAVASCRIPT
	   <br> <br>
	  <img src="https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-original.svg" title="nodeJS" alt="nodeJS" width="35" height="35">&nbsp; NODE
	  <br> <br>
	  <img src="https://github.com/devicons/devicon/blob/master/icons/css3/css3-original.svg" title="Css3" alt="CSS3" width="35" height="35">&nbsp; CSS3
	   <br> <br>
	  <img src="https://github.com/devicons/devicon/blob/master/icons/html5/html5-original.svg" title="Html5" alt="HTML5" width="35" height="35">&nbsp; HTML5
	   <br> <br>
	  <img src="https://github.com/devicons/devicon/blob/master/icons/postgresql/postgresql-original.svg" title="PostgreSql" alt="POSTGRESQL" width="35" height="35">&nbsp; POSTGRESQL
    <br>
  </div>
</div>

<h2> 🗂 Proyecto del repositorio:</h2>
<br>
<h4>  Nuestro página web es in e-commerce especializado en la venta de productos orgánicos frescos y saludables. El enfoque principal es ser el nexo entre el consumidor y el productor dándole a este último la posibilidad y facilidad de hacerlo mediante una web y sin moverse de su domicilio. <br> 
      En el e-commerce se podrá comprar con envío a domicilio y diferentes métodos de pago. </h4>

<h2><strong><u> 👤 Integrantes</u></strong></h2>

<div align="center">	
<h3>	  
  Britez Neira Leila
  <br>
  Solán Leonardo
  <br>
  Viola Jésica
 </div>
 
   <br>

   <hr>
<h3><strong><u> ✅ Funcionalidades del e-commerce: </u></strong></h3>
<br>
	✔️ Compra de la seleccion de frutas y verduras. <br>
	✔️ Elección de pago con Mercado Pago : Efectivo, tarjeta, pago por medio de la app con QR . <br>
	✔️ Elección de envio a domicilio o retiro por tienda. <br>
<br>
<br>
<h3><strong><u> ▶️ Puesta en marcha del proyecto: </u></strong></h3>
1. Luego de clonar el repositorio : `git clone https://github.com/CodeSystem2022/CopyPaste_CuartoSemestre-ProyectoIntegrador.git `.<br>
2. Vamos a la carpeta del proyecto : `cd CopyPaste_CuartoSemestre-ProyectoIntegrador `.<br> 
3. Vamos a la carpeta del server que contiene la carpeta node_modules: `cd server `.<br> 
4. Instalamos los package que requiere el e-commerce : `npm install `.<br>
5. Creamos una base de datos local en PostgreSQL. <br>
6. Modificamos el archivo server.js para conectar el proyecto con la base de datos PostgreSQL recién creada: <br> <br>
    ```
    const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'verduleria', 
    password: 'postgres',
    port: 5432,
});
    ```
   <br>
7. Rellenamos nuestra base de datos local `"verduleria" ` con las tabla: `"productos" ` columnas: `"name", "quantity", "img", "price" `.<br>
8. Lanzamos nuestro servidor: `npm start`.<br>
