import { FC, useState, FormEvent, useEffect } from "react"
import { formProps } from "../types/types"
import api from "../api";
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { AxiosError } from "axios"
import { toast } from "react-toastify"

const Form: FC<formProps> = ({ route, name, setIsAuthenticated }) => {
    const navigate = useNavigate()

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [errors, setErrors] = useState<unknown>({})

    const registerNewUser = async (username: string, email: string, password: string): Promise<void> => {
        try {
            const res = await api.post(`/${route}/`, {username, email, password})
            localStorage.setItem(ACCESS_TOKEN, res.data.access)
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
            toast.success("You need to verify your email")
            navigate("/verify/")
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    setErrors(error.response.data)
                }
            }
            // console.log(error)
        }
    };

    const loginUser = async (email: string, password: string) => {
        try {
            const res = await api.post(`${route}/`, {email, password})
            localStorage.setItem(ACCESS_TOKEN, res.data.access)
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
            toast.success("User logged successfully")
            setIsAuthenticated(true)
            navigate("/")
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    console.log(error.response.data)
                    setErrors(error.response.data)
                }
            }
             else {
                console.log(error)
            }
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({})
        if (name.toLowerCase() != "login") {
            await registerNewUser(username, email, password)
        } else {
            await loginUser(email, password)
        }

    }
    return (
        <>
            <form onSubmit={handleSubmit} className="mt-[100px] flex p-8 flex-col items-center justify-center">
                <h1 className="mb-[20px] mt-4 text-[33px] text-[#2196F3] font-bold ">
                    {
                        name.toLowerCase() == "login" ? "Welcome back" : "Hi Create a new account"
                    }
                </h1>
                {
                    name.toLowerCase() != "login"
                    ?
                    (
                        <>
                            <div className="w-[70%] max-md:flex-col max-md:w-[100%] rounded flex items-center justify-between mb-4">
                                <label htmlFor="username" className="mr-4 max-md:mb-4">Username: </label>
                                <input required className="border-[#ccc] max-md:w-[100%] border-[1px] w-[75%] " type="text" onChange={(e) => setUsername(e.target.value)} value={username} name="username" id="username" />
                            </div>  
                            {errors.username && <div className="text-yellow-800 font-bold text-sm ">{errors.username}</div>}
        
                        </>
                    ) : null
                }
                <div className="w-[70%] max-md:flex-col max-md:w-[100%] rounded flex items-center justify-between mb-4">
                    <label htmlFor="email" className="mr-4 max-md:mb-4" >Email: </label>
                    <input required className="border-[#ccc] max-md:w-[100%] border-[1px] w-[75%]" onChange={(e) => setEmail(e.target.value)} value={email} type="text" name="email" id="email" />
                </div>
                {errors.email && <div className="text-yellow-800 font-bold text-sm ">{errors.email}</div>}
                <div className="w-[70%] max-md:flex-col max-md:w-[100%] rounded flex items-center justify-between mb-4">
                    <label htmlFor="password" className="mr-4 max-md:mb-4">password: </label>
                    <input required className="border-[#ccc] max-md:w-[100%] border-[1px] w-[75%]" onChange={(e) => setPassword(e.target.value)} value={password} type="text" name="password" id="username" />
                </div>
                <div>
                    {errors.detail && <div className="text-yellow-800 font-bold text-sm ">{errors.detail}</div>}
                </div>
                <div className="w-[70%] max-md:flex-col max-md:w-[100%] rounded flex items-center justify-center mb-4">
                    <button type="submit" className="bg-[#2196F3] rounded mt-4 p-1 w-full text-white font-eborder-x-neutral-900 ">Submit</button>
                </div>
                <br />
                {
                    name.toLowerCase() == "login" ? <a href="/reset-password/">Reset your password</a> : null
                }
            </form>
        </>
    )
}

export default Form;