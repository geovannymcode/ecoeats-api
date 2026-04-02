# 🍃 EcoEats API

API backend para EcoEats - Aplicación de comida colombiana saludable. Desarrollada con NestJS, TypeORM y PostgreSQL.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Local](#-instalación-local)
- [Configuración de Variables de Entorno](#-configuración-de-variables-de-entorno)
- [Base de Datos](#-base-de-datos)
- [Despliegue en Railway](#-despliegue-en-railway)
- [Endpoints](#-endpoints)
- [Estructura del Proyecto](#-estructura-del-proyecto)

## ✨ Características

- ✅ Registro de usuarios con validaciones
- ✅ Autenticación con JWT (expiración configurable)
- ✅ Recuperación de contraseña con OTP por email
- ✅ Catálogo de platos colombianos con seed automático
- ✅ Arquitectura modular con NestJS
- ✅ Validaciones robustas con class-validator
- ✅ Documentación Swagger automática
- ✅ Manejo de errores centralizado
- ✅ Rate limiting con Throttler
- ✅ Health check endpoint

## 🛠 Tecnologías

- **NestJS** - Framework backend
- **TypeScript** - Lenguaje de programación
- **TypeORM** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **Passport + JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **Resend** - Envío de emails
- **Swagger** - Documentación de API
- **Docker Compose** - Entorno local

## 📦 Requisitos Previos

- Node.js (v18 o superior)
- Docker y Docker Compose (para base de datos local)
- Cuenta de Railway (para despliegue)
- Cuenta de Resend (para envío de emails)

## 💻 Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/geovannymcode/ecoeats-api.git
cd ecoeats-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crea un archivo `.env` en la raíz del proyecto (ver sección de Variables de Entorno)

4. **Levantar la base de datos**
```bash
docker compose up -d db
```

5. **Iniciar el servidor en modo desarrollo**
```bash
npm run start:dev
```

El servidor estará corriendo en `http://localhost:3000` y Swagger en `http://localhost:3000/docs`

## ⚙️ Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Entorno
NODE_ENV=development
PORT=3000

# Base de datos PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=ecoeats
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# JWT (genera un secret seguro)
JWT_SECRET=tu_jwt_secret_super_seguro_aqui_min_32_chars
JWT_EXPIRATION=24h

# Resend (para emails)
RESEND_API_KEY=re_tu_api_key_de_resend
RESEND_FROM_EMAIL=noreply@tudominio.resend.app
RESEND_FROM_NAME=EcoEats

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

### Generar JWT_SECRET

Puedes generar un JWT_SECRET seguro usando Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🗄 Base de Datos

### Con Docker Compose (recomendado)

```bash
# Levantar PostgreSQL
docker compose up -d db

# Verificar que está corriendo
docker compose ps
```

TypeORM con `synchronize: true` (en desarrollo) creará las tablas automáticamente al iniciar la app. El seed se ejecuta automáticamente e inserta:
- Un usuario admin (`admin@ecoeats.com` / `123456`)
- 12 platos colombianos con imágenes y datos nutricionales

### Limpiar y recrear la base de datos

```bash
docker compose down -v
docker compose up -d db
# Espera unos segundos y luego:
npm run start:dev
```

### Tablas

- **users** - Información de usuarios
  - `id`, `numero_documento`, `nombres`, `apellidos`, `email`, `password`, `token_firebase_auth`, `created_at`, `updated_at`

- **password_reset_tokens** - Tokens para recuperación de contraseña
  - `id`, `otp`, `user_id`, `expires_at`, `used`, `created_at`

- **dishes** - Catálogo de platos
  - `id`, `name`, `description`, `image`, `thumbails`, `price`, `carbohydrates`, `proteins`, `rating`, `ingredients`, `flag_header`, `created_at`, `updated_at`

## 🚀 Despliegue en Railway

### Paso 1: Preparar el Repositorio

1. Asegúrate de tener todos los archivos en tu repositorio Git
2. El `package.json` debe tener los scripts `build` y `start:prod`

### Paso 2: Crear Proyecto en Railway

1. Ve a [Railway](https://railway.app/)
2. Inicia sesión o créate una cuenta
3. Haz clic en "New Project"
4. Selecciona "Deploy from GitHub repo"

### Paso 3: Configurar Base de Datos PostgreSQL

1. En tu proyecto de Railway, haz clic en "New"
2. Selecciona "Database" → "Add PostgreSQL"
3. Railway generará automáticamente la variable `DATABASE_URL`

### Paso 4: Crear las tablas

1. Configura `NODE_ENV=development` temporalmente para que `synchronize` cree las tablas
2. Haz deploy y verifica que las tablas se crearon
3. Cambia `NODE_ENV=production` para desactivar `synchronize`

### Paso 5: Configurar Variables de Entorno

En Railway, ve a tu servicio API y configura:

- `DATABASE_URL` - Railway la genera automáticamente al vincular PostgreSQL
- `NODE_ENV` - `production` (después de crear tablas)
- `PORT` - Railway lo asigna automáticamente
- `JWT_SECRET` - Genera uno seguro
- `JWT_EXPIRATION` - `24h`
- `RESEND_API_KEY` - Tu API key de Resend
- `RESEND_FROM_EMAIL` - Email verificado en Resend
- `RESEND_FROM_NAME` - `EcoEats`
- `ALLOWED_ORIGINS` - URLs permitidas para CORS

### Paso 6: Configurar Resend

1. Ve a [Resend](https://resend.com/) y crea una cuenta
2. Verifica tu dominio o usa el dominio de prueba (`onboarding@resend.dev`)
3. Genera una API Key
4. Configura las variables en Railway

### Paso 7: Verificar Despliegue

Visita `https://tu-app.railway.app/api/health` para verificar que el servidor está funcionando.

## 📡 Endpoints

Base URL: `/api/securities`

### Registro

#### `POST /api/securities/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "numero_documento": "12345678",
  "nombres": "Geovanny",
  "apellidos": "Mendoza",
  "correo": "geovanny@example.com",
  "password": "password123"
}
```

**Validaciones:**
- `numero_documento`: Obligatorio, único
- `nombres`: Obligatorio
- `apellidos`: Obligatorio
- `correo`: Formato email válido, obligatorio, único
- `password`: Mínimo 6 caracteres, obligatorio

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "data": {
    "user": {
      "id": "uuid",
      "numero_documento": "12345678",
      "nombres": "Geovanny",
      "apellidos": "Mendoza",
      "correo": "geovanny@example.com"
    }
  }
}
```

### Login

#### `POST /api/securities/login`
Inicia sesión con email y contraseña.

**Body:**
```json
{
  "email": "admin@ecoeats.com",
  "password": "123456"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": "uuid",
    "email": "admin@ecoeats.com",
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenFirebaseAuth": ""
  }
}
```

### Recuperación de Contraseña

#### `POST /api/securities/forgot-password`
Solicita recuperación de contraseña. Envía un código OTP de 6 dígitos por email.

**Body:**
```json
{
  "email": "geovanny@example.com"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Se envió un código de verificación a tu email",
  "data": null
}
```

#### `POST /api/securities/verify-otp`
Verifica el código OTP recibido por email.

**Body:**
```json
{
  "email": "geovanny@example.com",
  "otp": "547378"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "OTP válido",
  "data": {
    "valid": true
  }
}
```

#### `POST /api/securities/reset-password`
Cambia la contraseña usando el OTP verificado.

**Body:**
```json
{
  "email": "geovanny@example.com",
  "otp": "547378",
  "newPassword": "nuevaPassword123"
}
```

**Validaciones:**
- `newPassword`: Mínimo 6 caracteres

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Contraseña restablecida exitosamente",
  "data": null
}
```

### Platos

#### `GET /api/dishes`
Obtiene el catálogo de platos colombianos (requiere autenticación JWT).

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### Health Check

#### `GET /api/health`
Verifica que el servidor y la base de datos están funcionando.

## 📁 Estructura del Proyecto

```
ecoeats-api/
├── src/
│   ├── common/
│   │   ├── dto/
│   │   │   └── api-response.dto.ts      # DTO genérico de respuesta
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts  # Filtro global de excepciones
│   │   └── interceptors/
│   │       └── logging.interceptor.ts    # Interceptor de logging
│   ├── config/
│   │   ├── app.config.ts                 # Configuración de la app
│   │   ├── config.validation.ts          # Validación de env con Joi
│   │   ├── database.config.ts            # Configuración PostgreSQL
│   │   ├── jwt.config.ts                 # Configuración JWT
│   │   └── resend.config.ts              # Configuración Resend
│   ├── database/
│   │   └── seeds/
│   │       ├── seed.module.ts            # Módulo de seeds
│   │       └── seed.service.ts           # Seed de usuarios y platos
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── dto/                      # DTOs de autenticación
│   │   │   ├── entities/
│   │   │   │   ├── user.entity.ts        # Entidad de usuario
│   │   │   │   └── password-reset-token.entity.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts     # Guard de autenticación
│   │   │   ├── interfaces/
│   │   │   │   └── jwt-payload.interface.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts       # Estrategia Passport JWT
│   │   │   ├── auth.controller.ts        # Controlador de auth
│   │   │   ├── auth.module.ts            # Módulo de auth
│   │   │   └── auth.service.ts           # Servicio de auth
│   │   ├── dishes/
│   │   │   ├── entities/
│   │   │   │   └── dish.entity.ts        # Entidad de plato
│   │   │   ├── dishes.controller.ts      # Controlador de platos
│   │   │   ├── dishes.module.ts          # Módulo de platos
│   │   │   └── dishes.service.ts         # Servicio de platos
│   │   ├── email/
│   │   │   ├── email.module.ts           # Módulo de email
│   │   │   └── email.service.ts          # Servicio de email con Resend
│   │   └── health/
│   │       ├── health.controller.ts      # Health check
│   │       └── health.module.ts
│   ├── app.module.ts                     # Módulo raíz
│   └── main.ts                           # Punto de entrada
├── postman/
│   └── EcoEats-API.postman_collection.json
├── docker-compose.yml                    # Docker Compose (PostgreSQL)
├── Dockerfile                            # Dockerfile para producción
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Seguridad

- Las contraseñas se almacenan con hash usando **bcrypt** (10 rounds)
- Los tokens JWT tienen expiración configurable (default: 24h)
- Los códigos OTP de 6 dígitos expiran en **15 minutos**
- Los tokens OTP se invalidan después de ser usados
- Validación de datos con **class-validator** en todos los endpoints
- Rate limiting con **@nestjs/throttler** (100 requests/minuto)
- Protección con **Helmet** para headers HTTP
- CORS configurable por variable de entorno
- `synchronize` desactivado en producción

## 🐛 Solución de Problemas

### Error: "column numero_documento contains null values"
- La tabla `users` ya tiene registros sin los nuevos campos
- Solución: `docker compose down -v && docker compose up -d db` y reiniciar la app

### Error: "EADDRINUSE port 3000"
- Otro proceso está usando el puerto 3000
- Solución: `lsof -ti:3000 | xargs kill -9`

### Error: "Unable to connect to the database"
- PostgreSQL no está corriendo
- Solución: `docker compose up -d db`

### Error 403 en Resend (Domain not verified)
- El dominio en `RESEND_FROM_EMAIL` no está verificado en Resend
- Solución: Usa `onboarding@resend.dev` para pruebas o verifica tu dominio en Resend

### Emails no llegan
- Verifica que `RESEND_API_KEY` sea correcto
- Verifica que `RESEND_FROM_EMAIL` use un dominio verificado
- Revisa la pestaña **Logs** en el dashboard de Resend (no "Receiving")
- Con plan gratuito de Resend, solo puedes enviar al email con el que te registraste

## 📄 Licencia

MIT

## 👤 Autor

Desarrollado por Geovanny Mendoza

---

**¿Problemas o preguntas?** Revisa los logs del servidor o la sección de Solución de Problemas.
