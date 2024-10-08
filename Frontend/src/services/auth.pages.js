function parseJWT(token) {
    try {
        const base64Url = token.split('.')[1];  // Parte del payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
}

export function validateJWT() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    
    if (!token) {
        window.location.href = '/';
        return false;
    }

    const decoded = parseJWT(token);

    if (!decoded) {
        window.location.href = '/';
        return false;
    }

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        localStorage.removeItem('user');
        window.location.href = '/';
        return false;
    }

    return true; 
}

export function validateAdmin() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.user || !user.user.isAdmin) {
        window.location.href = '/unauthorized'; 
        return false;
    }

    return true; 
}
