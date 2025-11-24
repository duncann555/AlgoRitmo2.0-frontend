import { fromApiSong, toApiSong } from "./mappers";

const BASE = "http://localhost:3000/api/canciones";

export const getCanciones = async () => {
  const r = await fetch(BASE);
  const data = await r.json();
  return data.map(fromApiSong);
};

export const crearCancionApi = async (songFront) => {
  const r = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiSong(songFront)),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.mensaje || "Error creando canción");
  return fromApiSong(data.cancion);
};

export const editarCancionApi = async (id, songFront) => {
  const r = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiSong(songFront)),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.mensaje || "Error editando canción");
  return fromApiSong(data.cancion);
};

export const borrarCancionApi = async (id) => {
  const r = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  const data = await r.json();
  if (!r.ok) throw new Error(data.mensaje || "Error borrando canción");
  return true;
};
