import { useState, FormEvent } from "react";
import api from "../api";
import { toast } from "react-toastify"

const ResetPasswordPage = () => {
    const [email, setEmail] = useState<string>("");

    const sendResetEmail = async () => {
        try {
            const res = await api.post('/reset-password/', {email})
            if (res.status == 200) {
                toast("A reset password link has been sent to your email")
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await sendResetEmail()
    };
    
    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center mt-[100px] ">
            <div className="w-full flex justify-center items-center">
                <input onChange={(e) => setEmail(e.target.value)} value={email} className="border-[3px] border[#ccc] p-2 w-[50%] font-bold rounded" required placeholder="Enter your email" type="email" name="email" id="email" />
            </div>
            <div className="w-full flex justify-center items-center mt-14">
                <input type="submit" value="Reset your password" className="cursor-pointer border-[3px] border[#ccc] text-[#fff] bg-[#2196F3] p-2 w-[50%] font-bold rounded" />
            </div>
        </form>
    )
}

export default ResetPasswordPage