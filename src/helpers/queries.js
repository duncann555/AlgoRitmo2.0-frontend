const URL_CANCIONES = import.meta.env.VITE_API_CANCIONES; 
const URL_PLAYLIST = import.meta.env.VITE_API_PLAYLIST; 
const URL_USUARIOS = import.meta.env.VITE_API_USUARIOS;

const obtenerToken = () => {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioKey'));
    return usuario ? usuario.token : '';
};

export const listarCanciones = async () => {
    try {
        const respuesta = await fetch(URL_CANCIONES);
        const data = await respuesta.json();
        return data; 
    } catch (error) {
        console.error("Error al listar canciones", error);
        return null;
    }
};

export const obtenerCancionPorId = async (id) => {
    try {
        const respuesta = await fetch(`${URL_CANCIONES}/${id}`);
        const data = await respuesta.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const crearCancionAPI = async (cancion) => {
    try {
        const respuesta = await fetch(URL_CANCIONES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-token': obtenerToken()
            },
            body: JSON.stringify(cancion)
        });
        return respuesta;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const editarCancionAPI = async (id, cancion) => {
    try {
        const respuesta = await fetch(`${URL_CANCIONES}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-token': obtenerToken()
            },
            body: JSON.stringify(cancion)
        });
        return respuesta;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const borrarCancionAPI = async (id) => {
    try {
        const respuesta = await fetch(`${URL_CANCIONES}/${id}`, {
            method: 'DELETE',
            headers: {
                'x-token': obtenerToken()
            }
        });
        return respuesta;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// --- PLAYLIST ---

export const obtenerPlaylist = async (userId) => {
    try {
        const respuesta = await fetch(`${URL_PLAYLIST}/${userId}`);
        const data = await respuesta.json();
        return data.canciones || [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const agregarAplaylistAPI = async (userId, cancionId) => {
    try {
        const respuesta = await fetch(`${URL_PLAYLIST}/${userId}/agregar/${cancionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return respuesta;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const borrarDePlaylistAPI = async (userId, cancionId) => {
    try {
        const respuesta = await fetch(`${URL_PLAYLIST}/${userId}/borrar/${cancionId}`, {
            method: 'DELETE'
        });
        return respuesta;
    } catch (error) {
        console.error(error);
        return null;
    }
};