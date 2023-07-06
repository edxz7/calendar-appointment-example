# Appointment basic app

Esta app muestra lo basico que se require para construir un calendario para agendar citas

El modelo de datos de usuario contiene dos roles `Admin` y `User`

```js
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: false,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User'
    },
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
```

Los usuarios normales se crean a traves del formulario de `sign-up`


Los usuarios Admin se crean primero como usuarios normales y posteriormente se cambia su `roles` directamente en la base de datos usando un cliente como Mongo Compass o `mongosh`. 

## Creacion de calendarios y citas

Los usuarios Admin pueden crear un unico calendario. El cual muestra las fechas en las que el se encuentra disponibles para atender a sus clientes


Los usuarios normales, pueden ver los calendarios de los usuarios admin y con eso agendar una cita (appointment) en las fechas que tienen disponibles

Hay dos middleware claves en esta aplicación `isLoggedin` y `isAdmin` los cuales le dejan saber a cada ruta si el usuario en sesión esta logueado y si adicionalmente es admin o no


dependiendo de si es admin o no tendra una interacción con el calendario