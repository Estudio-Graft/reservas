# Sistema de Turnos

Sistema simple de reserva de turnos con panel de administración.

**Stack:** React + Vite (frontend) · Node + Express + Sequelize (backend) · PostgreSQL (base de datos)

## Estructura

```
turnos-app/
├── backend/     API en Node/Express
└── frontend/    App en React/Vite
```

## Requisitos

- Node.js instalado
- PostgreSQL instalado y corriendo
- Una cuenta de Gmail (para el envío de emails de confirmación/cancelación)

## 1. Configurar el backend

```bash
cd backend
npm install
```

Creá una base de datos en PostgreSQL (por ejemplo, con pgAdmin o por consola):

```sql
CREATE DATABASE turnos_db;
```

Copiá el archivo de ejemplo de variables de entorno y completalo con tus datos:

```bash
cp .env.example .env
```

Abrí `.env` y completá:
- `DB_PASSWORD`: la contraseña de tu usuario de PostgreSQL
- `JWT_SECRET`: cualquier frase larga y secreta que se te ocurra
- `EMAIL_USER` y `EMAIL_PASS`: tu Gmail y una ["contraseña de aplicación"](https://myaccount.google.com/apppasswords) (no tu contraseña normal)

Levantá el servidor:

```bash
npm run dev
```

La primera vez que arranca, crea automáticamente el usuario administrador con:
- **Email:** el que pusiste en `ADMIN_EMAIL_INICIAL` (por defecto `admin@turnos.com`)
- **Contraseña:** `A12345!` (te va a pedir cambiarla al ingresar la primera vez)

## 2. Configurar el frontend

En otra terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Esto levanta la app en `http://localhost:5173`.

## 3. Usar el sistema

- **Clientes:** entran a `http://localhost:5173` y reservan su turno directamente.
- **Administrador:** entra a `http://localhost:5173/admin`, ingresa con la clave inicial, la cambia,
  y desde ahí gestiona horarios, días bloqueados y confirma o cancela los turnos que van llegando.

## Reglas del sistema

- Los turnos deben reservarse con al menos **1 día de antelación**.
- No se pueden reservar dos turnos en el mismo día y horario (esto se valida en el backend, no solo en el front).
- Al confirmar o cancelar un turno, el cliente recibe un email automáticamente.
- Si se cancela un turno, el email invita al cliente a reagendar.
