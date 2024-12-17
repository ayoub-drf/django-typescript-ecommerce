import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api"
import { AxiosError } from "axios";

const ResetPasswordDonePage = () => {
    const navigate = useNavigate()
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<unknown>({})

    const { token } = useParams()

    const checkToken = async () => {
        try {
            const res = await api.post("/check-token/", { token })
        } catch (error) {
            toast("Not found page")
            navigate('/')
            console.log(error)
        }
    };

    const updatePassword = async () => {
        try {
            const res = await api.post(`/reset-password-done/${token}/`, { password })
            if (res.status == 200) {
                toast("Password has been update successfully no you can login to your account")
                navigate('/login/')
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    setErrors(error.response.data)
                }
            }
            console.log(error)

        }
    }

    useEffect(() => {
        checkToken()
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await updatePassword()
        console.log(password)
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center mt-[100px] ">
            <div className="w-full flex justify-center items-center">
                <input onChange={(e) => setPassword(e.target.value)} value={password} className="border-[3px] border[#ccc] p-2 w-[50%] font-bold rounded" required placeholder="Enter your new password" type="password" name="password" id="password" />
            </div>
            {errors.password && <div>{errors.password[0]}</div>}
            <div className="w-full flex justify-center items-center mt-14">
                <input type="submit" value="update your password" className="cursor-pointer border-[3px] border[#ccc] text-[#fff] bg-[#2196F3] p-2 w-[50%] font-bold rounded" />
            </div>
        </form>
    )
}

export default ResetPasswordDonePage