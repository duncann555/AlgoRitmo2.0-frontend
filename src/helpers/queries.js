// ===================
// VARIABLES GLOBALES
// ===================
const URL_CANCIONES = import.meta.env.VITE_API_CANCIONES;
const URL_PLAYLIST = import.meta.env.VITE_API_PLAYLIST;
const URL_USUARIOS = import.meta.env.VITE_API_USUARIOS;

// Token desde localStorage
const obtenerToken = () => localStorage.getItem("token") || "";

// Usuario decodificado del token
import { jwtDecode } from "jwt-decode";
const obtenerUsuario = () => {
  const token = obtenerToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

/* ========================
       CANCIONES
========================= */

export const listarCanciones = async () => {
  try {
    const respuesta = await fetch(URL_CANCIONES);
    if (!respuesta.ok) return [];
    return await respuesta.json();
  } catch {
    return [];
  }
};

export const obtenerCancionPorId = async (id) => {
  try {
    const respuesta = await fetch(`${URL_CANCIONES}/${id}`);
    if (!respuesta.ok) return null;
    return await respuesta.json();
  } catch {
    return null;
  }
};

export const crearCancionAPI = async (cancion) => {
  try {
    const token = obtenerToken();
    const usuario = obtenerUsuario();

    const respuesta = await fetch(URL_CANCIONES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(cancion),
    });

    const data = await respuesta.json();
    return { status: respuesta.status, data };
  } catch (error) {
    console.error("Error creando canción", error);
    return { status: 500 };
  }
};

export const editarCancionAPI = async (id, cancion) => {
  try {
    const respuesta = await fetch(`${URL_CANCIONES}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${obtenerToken()}`,
      },
      body: JSON.stringify(cancion),
    });

    return await respuesta.json();
  } catch {
    return null;
  }
};

export const borrarCancionAPI = async (id) => {
  try {
    const respuesta = await fetch(`${URL_CANCIONES}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${obtenerToken()}`,
      },
    });

    return await respuesta.json();
  } catch {
    return null;
  }
};

/* ========================
        PLAYLIST
========================= */

export const obtenerPlaylist = async (userId) => {
  try {
    const respuesta = await fetch(`${URL_PLAYLIST}/${userId}`, {
      headers: {
        Authorization: `Bearer ${obtenerToken()}`,
      },
    });

    if (!respuesta.ok) return [];

    const data = await respuesta.json();

    return Array.isArray(data.canciones) ? data.canciones : [];
  } catch {
    return [];
  }
};

export const agregarAplaylistAPI = async (userId, cancionId) => {
  try {
    return await fetch(`${URL_PLAYLIST}/${userId}/agregar/${cancionId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${obtenerToken()}`,
      },
    });
  } catch {
    return null;
  }
};

export const borrarDePlaylistAPI = async (userId, cancionId) => {
  try {
    return await fetch(`${URL_PLAYLIST}/${userId}/borrar/${cancionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${obtenerToken()}`,
      },
    });
  } catch {
    return null;
  }
};
