// Datos del viaje. Edita este archivo para actualizar la app — no hay que tocar el diseño.
// Fechas en formato ISO (YYYY-MM-DDTHH:MM). Marca confirmed:false en lo que aún no esté cerrado.

const TRIP = {
  name: "Europa 2026",
  subtitle: "París · Bruselas · Ámsterdam",
  startDate: "2026-10-02",
  travelers: ["Edison", "Bryan", "Alejandro", "Heidy"],

  // Cosas que aún faltan por confirmar o agregar — se muestran en la sección "Pendientes".
  pending: [
    "Vuelo/tren de Edison hasta París (sale desde otro destino, no desde Madrid).",
    "Tour en París — aún no reservado.",
    "Actividades y tours en Bruselas.",
    "Actividades y tours en Ámsterdam.",
    "Fotos del grupo en assets/fotos/."
  ],

  cities: [
    {
      id: "paris",
      name: "París",
      country: "Francia",
      flag: "🇫🇷",
      dateFrom: "2026-10-02",
      dateTo: "2026-10-03",

      transportIn: {
        type: "flight",
        confirmed: true,
        company: "Transavia France",
        code: "TO 4639",
        from: "Madrid",
        to: "París – Aeropuerto de Orly (ORY)",
        departure: "2026-10-02T20:45",
        arrival: "2026-10-02T22:50",
        passengers: ["Bryan", "Alejandro", "Heidy"],
        note: "Edison llega a París por separado — falta agregar su vuelo/tren."
      },

      hotel: {
        name: "MIJE Marais",
        address: "6 Rue de Fourcy, 4e arr., 75004 París",
        checkIn: "2026-10-02",
        checkOut: "2026-10-03",
        confirmed: true
      },

      gettingToHotel: {
        from: "Aeropuerto de Orly (ORY)",
        options: [
          "Orlyval (tren automático) hasta Antony + RER B hasta Châtelet-Les-Halles (~35-40 min), luego Metro L1 hasta Saint-Paul (~10 min a pie al hotel).",
          "Bus Orlybus hasta Denfert-Rochereau + Metro L4 hasta Cité o Saint-Michel (~45-55 min).",
          "Taxi / Uber directo (~30-40 min)."
        ],
        tip: "Confirmar el último horario de RER/metro de la noche — llegan a las 22:50 y toca moverse después."
      },

      activities: [
        { name: "Tour por París", status: "pendiente", note: "Aún no reservado." }
      ]
    },

    {
      id: "bruselas",
      name: "Bruselas",
      country: "Bélgica",
      flag: "🇧🇪",
      dateFrom: "2026-10-03",
      dateTo: "2026-10-04",

      transportIn: {
        type: "train",
        confirmed: true,
        company: "OUIGO",
        code: "SZ56AC",
        from: "París Gare du Nord",
        to: "Bruselas",
        departure: "2026-10-03T19:27",
        arrival: "2026-10-03T22:40"
      },

      hotel: {
        name: "Safestay Brussels Grand Place",
        address: "Rue Grétry 53, 1000 Bruselas",
        confirmed: true,
        privateNote: "Teléfono y nombre de la reserva en el chat del grupo."
      },

      gettingToHotel: {
        from: "Estación de llegada del tren en Bruselas",
        options: [
          "A pie desde Bruselas-Central (~10-12 min) si el tren para ahí.",
          "Metro líneas 2/6 hasta De Brouckère + 5 min a pie (~10-15 min en total).",
          "Taxi / Uber (~10 min)."
        ],
        tip: "Confirmar en qué estación para el OUIGO (Bruselas-Midi/Sur o Bruselas-Central) para elegir la mejor ruta al hotel."
      },

      activities: []
    },

    {
      id: "amsterdam",
      name: "Ámsterdam",
      country: "Países Bajos",
      flag: "🇳🇱",
      dateFrom: "2026-10-04",
      dateTo: "2026-10-06",

      transportIn: {
        type: "bus",
        confirmed: true,
        company: "FlixBus",
        code: "Ruta X810",
        from: "Estación Bruselas-Norte — Bd du Roi Albert II / Koning Albert II-laan, 1030 Bruselas",
        to: "Ámsterdam Sloterdijk",
        departure: "2026-10-04T15:45",
        arrival: "2026-10-04T18:35"
      },

      hotel: {
        name: "Clink Hostels",
        nights: 2,
        confirmed: true,
        privateNote: "Número de reserva y nombre en el chat del grupo."
      },

      gettingToHotel: {
        from: "Ámsterdam Sloterdijk",
        options: [
          "Tren directo Sloterdijk → Ámsterdam Centraal (~10 min), luego ~15 min a pie o tranvía hasta el hostel.",
          "Metro/tranvía desde Sloterdijk combinando (~15-20 min)."
        ],
        tip: "Los trenes locales a Centraal salen cada 10-15 min, no hace falta reservarlos."
      },

      activities: []
    }
  ]
};
