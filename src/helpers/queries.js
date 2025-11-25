// ===================
// VARIABLES GLOBALES
// ===================
const URL_CANCIONES = import.meta.env.VITE_API_CANCIONES;
const URL_PLAYLIST = import.meta.env.VITE_API_PLAYLIST;
const URL_USUARIOS = import.meta.env.VITE_API_USUARIOS;

// Token desde localStorage
const obtenerToken = () => localStorage.getItem("token") || "";

/* ========================
       CANCIONES
========================= */

export const listarCanciones = async () => {
  try {
    const respuesta = await fetch(URL_CANCIONES);
    if (!respuesta.ok) return [];
    const data = await respuesta.json();
    return Array.isArray(data) ? data : [];
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

    const respuesta = await fetch(URL_CANCIONES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-admin-front": usuarioLogueado?.rol === "admin" ? "true" : "false",
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
    return await fetch(`${URL_CANCIONES}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${obtenerToken()}`,
      },
      body: JSON.stringify(cancion),
    });
  } catch {
    return null;
  }
};

export const borrarCancionAPI = async (id) => {
  try {
    return await fetch(`${URL_CANCIONES}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${obtenerToken()}`,
      },
    });
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

    if (Array.isArray(data.canciones)) return data.canciones;
    if (Array.isArray(data)) return data;

    return [];
  } catch {
    return [];
  }
};

export const agregarAplaylistAPI = async (userId, cancionId) => {
  try {
    return await fetch(`${URL_PLAYLIST}/${userId}/agregar/${cancionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
