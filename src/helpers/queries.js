// 1. Definimos las URL base usando variables de entorno (Como hace tu profe)
// Asegurate de tener estas variables en tu archivo .env
const URL_CANCIONES = import.meta.env.VITE_API_CANCIONES; 
const URL_PLAYLIST = import.meta.env.VITE_API_PLAYLIST; 
const URL_USUARIOS = import.meta.env.VITE_API_USUARIOS; // Si tenés login

// --- FUNCIONES AUXILIARES ---

// Función para sacar el token del SessionStorage (Tal cual lo hace tu profe)
const obtenerToken = () => {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioKey'));
    return usuario ? usuario.token : '';
};

// --- CANCIONES ---

export const listarCanciones = async () => {
    try {
        const respuesta = await fetch(URL_CANCIONES);
        // OJO: Tu profe devuelve 'respuesta' (el objeto fetch). 
        // Vos antes devolvías 'data'. Si tus componentes esperan data,
        // vas a tener que hacer .json() en el componente o hacerlo acá.
        // Lo hago acá para que sea más fácil de usar:
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
                'x-token': obtenerToken() // Acá inyectamos el token
            },
            body: JSON.stringify(cancion)
        });
        return respuesta; // Devolvemos respuesta para chequear status en el componente
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
        return data.canciones || []; // Manejo de errores defensivo
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
                // Si tu backend pide token para esto, agregá 'x-token': obtenerToken()
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
             // Si tu backend pide token para esto, agregá 'x-token': obtenerToken()
        });
        return respuesta;
    } catch (error) {
        console.error(error);
        return null;
    }
};