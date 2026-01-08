import {createContext, useState,useEffect} from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState();
    const [loading, setLoading] = useState(true);
    
    // Load auth from localStorage on mount
    useEffect(() => {
        try { 
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setAuth(parsedUser);
            }
        } catch (error) {
            console.error('Failed to parse user from localStorage', error);
            // Clear corrupted data
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);
    
    // Persist auth to localStorage when it changes
    useEffect(() => {
        if (auth) {
            try {
                localStorage.setItem('user', JSON.stringify(auth));
            } catch (error) {
                console.error('Failed to save user to localStorage', error);
            }
        } else {
            localStorage.removeItem('user');
        }
    }, [auth]);

    return (
        <AuthContext.Provider value = {{auth, setAuth, loading}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContext;