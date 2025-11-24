import { fromApiSong } from "./mappers";

const BASE = "http://localhost:3000/api/playlist";

export const getPlaylist = async (userId) => {
  const r = await fetch(`${BASE}/${userId}`);
  const data = await r.json();
  return (data.canciones || []).map(fromApiSong);
};

export const addToPlaylistApi = async (userId, cancionId) => {
  const r = await fetch(`${BASE}/${userId}/agregar/${cancionId}`, {
    method: "POST",
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.mensaje || "Error agregando a playlist");
  return true;
};

export const removeFromPlaylistApi = async (userId, cancionId) => {
  const r = await fetch(`${BASE}/${userId}/borrar/${cancionId}`, {
    method: "DELETE",
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.mensaje || "Error borrando de playlist");
  return true;
};
