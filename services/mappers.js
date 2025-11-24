// Mapea lo que viene de Mongo a tu formato frontend
export const fromApiSong = (c) => ({
  id: c._id,
  nombre: c.nombre,
  artista: c.artista,
  categoria: c.categoria,
  album: c.album,
  anio: c.anio,
  imagen: c.imagen,
  duracion: c.duracion,
});

// Mapea lo que manda tu front al formato backend
export const toApiSong = (c) => ({
  nombre: c.nombre,
  artista: c.artista,
  categoria: c.categoria,
  album: c.album,
  anio: c.anio,
  imagen: c.imagen,
  duracion: c.duracion,
});
