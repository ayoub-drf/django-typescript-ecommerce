import { ACCESS_TOKEN, BASE_URL } from "./constants";
import axios, {AxiosInstance, AxiosError} from "axios";

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL
})

api.interceptors.request.use(
    (config) => {
        const token: string | null = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            // console.log(config.url);
            if (config.url != "/verify/" && config.url != "/register/") {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config
    }, (error: AxiosError) => {
        return Promise.reject(error)
    }
)

export default api;
