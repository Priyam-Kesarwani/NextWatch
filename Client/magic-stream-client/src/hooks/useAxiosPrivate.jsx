import {useEffect, useRef, useMemo} from 'react';
import axios from 'axios';

import useAuth from './useAuth';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const useAxiosPrivate = () =>{

    const {setAuth} = useAuth();
    
    // Create a stable axios instance using useMemo
    const axiosAuth = useMemo(() => {
        return axios.create({
            baseURL: apiUrl,
            withCredentials: true, // important for HTTP-only cookies
        });
    }, []); // Only create once

    // Use refs to track state that shouldn't trigger re-renders
    const isRefreshingRef = useRef(false);
    const failedQueueRef = useRef([]);

    // Helper to process queued requests after token refresh
    const processQueue = (error, response = null) => {
        failedQueueRef.current.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(response);
            }
        });
        failedQueueRef.current = [];
    };

    useEffect(() => {
        // Set up interceptor only once
        const interceptorId = axiosAuth.interceptors.response.use(
            response => response,
            async error => {
                console.log('⚠ Interceptor caught error:', error);
                const originalRequest = error.config;

                // If refresh endpoint fails with 401, don't retry - token is invalid
                if (originalRequest.url.includes('/refresh') && error.response?.status === 401) {
                    console.error('❌ Refresh token has expired or is invalid.');
                    localStorage.removeItem('user');
                    setAuth(null); // Clear auth state only when refresh token is invalid
                    return Promise.reject(error);
                }

                // Only try to refresh on 401 errors (unauthorized), not network errors
                if (error.response && error.response.status === 401 && !originalRequest._retry) {

                    if (isRefreshingRef.current) {
                        return new Promise((resolve, reject) => {
                            failedQueueRef.current.push({ resolve, reject });
                        })
                        .then(() => axiosAuth(originalRequest))
                        .catch(err => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    isRefreshingRef.current = true;

                    return new Promise((resolve, reject) => {
                        axiosAuth
                        .post('/refresh')
                        .then(() => {
                            processQueue(null);
                            axiosAuth(originalRequest)
                                .then(resolve)
                                .catch(reject);
                        })
                        .catch(refreshError => {
                            processQueue(refreshError, null);
                            
                            // Only log out if refresh fails with 401 (invalid token)
                            // Don't log out on network errors
                            if (refreshError.response?.status === 401) {
                                console.error('❌ Refresh failed - logging out');
                                localStorage.removeItem('user');
                                setAuth(null);
                            } else {
                                console.error('⚠ Refresh failed (non-auth error):', refreshError);
                            }
                            reject(refreshError);
                        })
                        .finally(() => {
                            isRefreshingRef.current = false;
                        });
                    });
                }

                return Promise.reject(error);
            }
        );

        // Cleanup: remove interceptor when component unmounts
        return () => {
            axiosAuth.interceptors.response.eject(interceptorId);
        };
    }, [axiosAuth, setAuth]); // Only depend on axiosAuth (stable) and setAuth (stable)

    return axiosAuth;
}

export default useAxiosPrivate;