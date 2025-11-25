const URL_CANCIONES = import.meta.env.VITE_API_CANCIONES;
const URL_PLAYLIST = import.meta.env.VITE_API_PLAYLIST;
const URL_USUARIOS = import.meta.env.VITE_API_USUARIOS;

// Token: se lee siempre de donde lo guardás en el Login
const obtenerToken = () => {
  return localStorage.getItem("token") || "";
};

/* --------------- CANCIONES --------------- */

export const listarCanciones = async () => {
  try {
    const respuesta = await fetch(URL_CANCIONES);

    if (!respuesta.ok) {
      console.error("Error al listar canciones:", respuesta.status);
      return []; // devolvemos SIEMPRE array
    }

    const data = await respuesta.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error de red al listar canciones", error);
    return [];
  }
};

export const obtenerCancionPorId = async (id) => {
  try {
    const respuesta = await fetch(`${URL_CANCIONES}/${id}`);

    if (!respuesta.ok) {
      console.error("Error al obtener canción por ID:", respuesta.status);
      return null; // para que el front muestre "Canción no encontrada"
    }

    const data = await respuesta.json();
    // si tu back devuelve directamente la canción, esto ya está bien
    return data || null;
  } catch (error) {
    console.error("Error de red al obtener canción por ID", error);
    return null;
  }
};

export const crearCancionAPI = async (cancion) => {
  try {
    const respuesta = await fetch(URL_CANCIONES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": obtenerToken(),
      },
      body: JSON.stringify(cancion),
    });

    // Devolvemos el Response crudo para que el componente use .status /.ok
    return respuesta;
  } catch (error) {
    console.error("Error de red al crear canción", error);
    return null;
  }
};

export const editarCancionAPI = async (id, cancion) => {
  try {
    const respuesta = await fetch(`${URL_CANCIONES}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-token": obtenerToken(),
      },
      body: JSON.stringify(cancion),
    });

    return respuesta;
  } catch (error) {
    console.error("Error de red al editar canción", error);
    return null;
  }
};

export const borrarCancionAPI = async (id) => {
  try {
    const respuesta = await fetch(`${URL_CANCIONES}/${id}`, {
      method: "DELETE",
      headers: {
        "x-token": obtenerToken(),
      },
    });

    return respuesta;
  } catch (error) {
    console.error("Error de red al borrar canción", error);
    return null;
  }
};

/* --------------- PLAYLIST --------------- */

export const obtenerPlaylist = async (userId) => {
  try {
    const respuesta = await fetch(`${URL_PLAYLIST}/${userId}`);

    if (!respuesta.ok) {
      console.error("Error al obtener playlist:", respuesta.status);
      return [];
    }

    const data = await respuesta.json();

    // Asumo que tu back manda algo tipo { canciones: [...] }
    if (Array.isArray(data.canciones)) {
      return data.canciones;
    }

    // Por si tu back devuelve directamente un array
    if (Array.isArray(data)) {
      return data;
    }

    return [];
  } catch (error) {
    console.error("Error de red al obtener playlist", error);
    return [];
  }
};

export const agregarAplaylistAPI = async (userId, cancionId) => {
  try {
    const respuesta = await fetch(
      `${URL_PLAYLIST}/${userId}/agregar/${cancionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-token": obtenerToken(), // protegida por token
        },
      }
    );

    return respuesta; // el componente mira .ok
  } catch (error) {
    console.error("Error de red al agregar a playlist", error);
    return null;
  }
};

export const borrarDePlaylistAPI = async (userId, cancionId) => {
  try {
    const respuesta = await fetch(
      `${URL_PLAYLIST}/${userId}/borrar/${cancionId}`,
      {
        method: "DELETE",
        headers: {
          "x-token": obtenerToken(),
        },
      }
    );

    return respuesta;
  } catch (error) {
    console.error("Error de red al borrar de playlist", error);
    return null;
  }
};
