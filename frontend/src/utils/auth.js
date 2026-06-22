export const getUser = () => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } };
export const setAuth = (user, token) => { localStorage.setItem('user', JSON.stringify(user)); localStorage.setItem('token', token) };
export const logout = () => { localStorage.removeItem('user'); localStorage.removeItem('token'); location.href = '/login' };
