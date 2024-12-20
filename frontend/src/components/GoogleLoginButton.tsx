import { GoogleLogin } from '@react-oauth/google';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN, } from '../constants';
import { useNavigate } from "react-router-dom"
import { formProps } from "../types/types"
import { FC } from "react"



const GoogleLoginButton: FC<formProps>  = ({ setIsAuthenticated }) => {
    const navigate = useNavigate()
    const handleLogin = async (response) => {
        if (response.credential) {
            const googleToken = response.credential;
            
            try {
                const res = await api.post("auth/google/", { token: googleToken },
                    {
                        headers: {
                            Authorization: null
                        }
                    }
                )
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthenticated(true)
                navigate("/")
            } catch (error) {
                console.log(error.response)
            }
        }

    }

    return <GoogleLogin onSuccess={handleLogin} />
};

export default GoogleLoginButton;
