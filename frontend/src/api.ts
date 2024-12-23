import { ACCESS_TOKEN, BASE_URL } from "./constants";
import axios, {AxiosInstance, AxiosError} from "axios";

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL
})

api.interceptors.request.use(
    (config) => {
        const token: string | null = localStorage.getItem(ACCESS_TOKEN);
        const routes: string[] = ["verify/", "register/", "auth/google/", "products/", "category/"];
        if (token) {
            routes.every((route: string) => {
                if (config.url?.includes(route) || config.url === `/${route}`) {
                    delete config.headers.Authorization;
                    return false
                }
                config.headers.Authorization = `Bearer ${token}`;
                return true
            })
        }
        return config
    }, (error: AxiosError) => {
        return Promise.reject(error)
    }
)

export default api;
