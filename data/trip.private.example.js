// PLANTILLA — copia este archivo como "trip.private.js" (mismo directorio) y
// completa los datos reales. trip.private.js está en .gitignore, así que nunca
// se sube a GitHub: solo existe en tu computadora.
//
//   cp data/trip.private.example.js data/trip.private.js
//
// La app lo carga automáticamente si existe y completa los datos sensibles
// (teléfono, número de reserva) que en la versión pública quedan ocultos.

const TRIP_PRIVATE = {
  bruselas: {
    hotel: {
      phone: "+32 X XXX XX XX",
      reservationName: "Nombre Apellido"
    }
  },
  amsterdam: {
    hotel: {
      reservationNumber: "0000000000",
      reservationName: "Nombre Apellido"
    }
  }
};
