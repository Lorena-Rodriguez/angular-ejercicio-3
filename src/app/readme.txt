DOCUMENTACIÓN DEL PROYECTO - LABORATORIO 12

===========================================================
1. DESCRIPCIÓN GENERAL
===========================================================
Este proyecto es una aplicación Angular que gestiona la autenticación y registro de usuarios, así como la navegación por diferentes secciones (Clientes, Productos, etc.). Utiliza Angular Material para el diseño visual y json-server como backend simulado (API REST) para almacenar y consultar los datos de usuarios y otras entidades.

===========================================================
2. ESTRUCTURA DE CARPETAS Y FICHEROS PRINCIPALES
===========================================================
- src/app/
  - app.module.ts           --> Módulo principal de la aplicación.
  - app-routing.module.ts   --> Configuración de rutas.
  - app.component.ts/html   --> Componente raíz.
  - home/
    - home.component.ts/html/css --> Componente principal con la barra de navegación.
  - usuarios/
    - servicio-usuarios.service.ts   --> Servicio para operaciones CRUD y autenticación de usuarios.
    - usuarios-auth/
      - usuarios-auth.component.ts/html/css --> Componente de login (modal).
    - usuarios-registro/
      - usuarios-registro.component.ts/html/css --> Componente de registro de usuario (modal).

- API-DATOS/
  - db.json                 --> Base de datos simulada para json-server.
  - readme.txt              --> Instrucciones para iniciar json-server.

===========================================================
3. FUNCIONAMIENTO GENERAL
===========================================================
- El usuario accede a la aplicación y ve la barra de navegación en la parte superior.
- Si no está logado, solo puede acceder a la opción "Login" y "Salir".
- Al pulsar "Login", se abre un modal para autenticarse.
- Si el usuario no tiene cuenta, puede pulsar "Registro" en el modal de login, que abre otro modal para registrarse.
- Tras el login correcto, el nombre y apellidos del usuario aparecen en la barra superior y se habilitan las opciones "Clientes" y "Productos".
- El botón "Salir" cierra la sesión y la aplicación.

===========================================================
4. EXPLICACIÓN DE LOS COMPONENTES Y SUS FICHEROS
===========================================================

---------------------------
4.1. home.component.*
---------------------------
- Muestra la barra de navegación principal.
- Gestiona el estado de usuario logado y la visibilidad de las opciones del menú.
- Permite abrir el modal de login y cerrar sesión.
- home.component.ts: Lógica del componente.
- home.component.html: Estructura y accesibilidad del menú.
- home.component.css: Estilos modernos y accesibles.

---------------------------
4.2. usuarios-auth.component.*
---------------------------
- Componente de login mostrado como modal.
- Permite introducir email y contraseña.
- Valida los campos y muestra mensajes de error accesibles.
- Permite abrir el modal de registro.
- usuarios-auth.component.ts: Lógica de login, apertura de registro y cierre del modal.
- usuarios-auth.component.html: Formulario accesible y botones de acción.
- usuarios-auth.component.css: Estilos modernos y accesibles.

---------------------------
4.3. usuarios-registro.component.*
---------------------------
- Componente de registro mostrado como modal.
- Solicita email, confirmación de email, nombre, apellidos, contraseña y confirmación de contraseña.
- Realiza validaciones exhaustivas (formato, coincidencia, existencia en base de datos, seguridad de contraseña).
- Muestra mensajes de error claros y accesibles.
- usuarios-registro.component.ts: Lógica de validación, registro y cierre del modal.
- usuarios-registro.component.html: Formulario accesible y botones de acción.
- usuarios-registro.component.css: Estilos modernos y accesibles.

---------------------------
4.4. servicio-usuarios.service.ts
---------------------------
- Servicio Angular inyectable para operaciones con usuarios.
- Métodos:
  - getUsuarioByEmail(email): Busca usuario por email.
  - login(email, password): Valida usuario y contraseña.
  - registrar(usuario): Registra un nuevo usuario.
- Utiliza HttpClient para comunicarse con la API REST (json-server).

---------------------------
4.5. db.json (API-DATOS)
---------------------------
- Base de datos simulada para json-server.
- Contiene la colección "usuarios" y otras entidades como "poblaciones".
- Permite operaciones CRUD mediante peticiones HTTP.

===========================================================
5. ACCESIBILIDAD Y DISEÑO
===========================================================
- Todos los formularios y menús cumplen con los estándares WCAG AA/AAA.
- Uso de roles, aria-labels, aria-live y foco visible.
- Contraste alto y diseño responsive.
- Iconos de ojo para mostrar/ocultar contraseñas.
- Navegación por teclado garantizada.

===========================================================
6. INSTRUCCIONES DE USO
===========================================================
1. Inicia el backend simulado:
   - Ve a la carpeta API-DATOS y ejecuta:
     json-server --watch db.json --port 3000

2. Inicia la aplicación Angular:
   - Ejecuta:
     ng serve

3. Accede a la aplicación en tu navegador en http://localhost:4200

===========================================================
7. NOTAS FINALES
===========================================================
- Todos los componentes NO son standalone y están declarados en el módulo correspondiente.
- El código está exhaustivamente comentado con Better Comments para facilitar el mantenimiento y la comprensión.
- El diseño sigue las últimas tendencias de Material Design y accesibilidad.
