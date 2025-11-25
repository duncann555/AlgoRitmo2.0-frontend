// ===================
// VARIABLES GLOBALES
// ===================
const URL_CANCIONES = import.meta.env.VITE_API_CANCIONES;
const URL_PLAYLIST = import.meta.env.VITE_API_PLAYLIST;
const URL_USUARIOS = import.meta.env.VITE_API_USUARIOS;

// ===================
// HELPERS AUTH
// ===================
const obtenerToken = () => localStorage.getItem("token") || "";

const esAdminPanelFront = () => {
  const raw = sessionStorage.getItem("usuarioKey");
  if (!raw) return false;

  try {
    const user = JSON.parse(raw);
    return user?.admin === true && user?.id === "admin_panel";
  } catch {
    return false;
  }
};

const getAuthHeaders = () => {
  const headers = {};
  const token = obtenerToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (esAdminPanelFront()) {
    // Se lo come validarJWT en el backend
    headers["x-admin-front"] = "true";
  }

  return headers;
};

/* ========================
       CANCIONES
========================= */

export const listarCanciones = async () => {
  try {
    const respuesta = await fetch(URL_CANCIONES);

    if (!respuesta.ok) return [];

    const data = await respuesta.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al listar canciones", error);
    return [];
  }
};

export const obtenerCancionPorId = async (id) => {
  try {
    const respuesta = await fetch(`${URL_CANCIONES}/${id}`);
    if (!respuesta.ok) return null;
    return await respuesta.json();
  } catch (error) {
    console.error("Error al obtener canción", error);
    return null;
  }
};

export const crearCancionAPI = async (cancion) => {
  try {
    const respuesta = await fetch(URL_CANCIONES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(cancion),
    });
    return respuesta;
  } catch (error) {
    console.error("Error al crear canción", error);
    return null;
  }
};

export const editarCancionAPI = async (id, cancion) => {
  try {
    const respuesta = await fetch(`${URL_CANCIONES}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(cancion),
    });
    return respuesta;
  } catch (error) {
    console.error("Error al editar canción", error);
    return null;
  }
};

export const borrarCancionAPI = async (id) => {
  try {
    const respuesta = await fetch(`${URL_CANCIONES}/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });
    return respuesta;
  } catch (error) {
    console.error("Error al borrar canción", error);
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
        ...getAuthHeaders(),
      },
    });

    if (!respuesta.ok) return [];

    const data = await respuesta.json();

    // Tu backend devuelve { usuario, canciones: [...] }
    if (Array.isArray(data.canciones)) return data.canciones;
    if (Array.isArray(data)) return data;

    return [];
  } catch (error) {
    console.error("Error al obtener playlist", error);
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
          ...getAuthHeaders(),
        },
      }
    );
    return respuesta;
  } catch (error) {
    console.error("Error al agregar a playlist", error);
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
          ...getAuthHeaders(),
        },
      }
    );
    return respuesta;
  } catch (error) {
    console.error("Error al borrar de playlist", error);
    return null;
  }
};
