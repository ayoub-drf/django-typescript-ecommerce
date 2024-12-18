import { 
    useState,
    FormEvent,
    useEffect
 } from "react"
import Footer from "../components/Footer"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { AxiosError } from "axios"
import { FC } from "react"
import { AuthenticationProps } from "../types/types"


const VerifyEmail: FC<AuthenticationProps> = ({ setIsAuthenticated, isAuthenticated }) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/")
            // toast.success("Your Email ALready verified")
        }
    });


    const [code, setCode] = useState<string>("");
    const [errors, setErrors] = useState<unknown>({});

    const verifyCode = async () => {
        try {
            const res = await api.post("/verify/", {code})
            setIsAuthenticated(true)
            toast.success("Email verified successfully")
            navigate('/')
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    setErrors(error.response.data)
                }
            }
            console.log(error.response.data)
        }
    }



    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await verifyCode()
    }

    return (
        <>        
            <form onSubmit={handleSubmit} className="flex px-8 max-md:p-0 w-[100%] text-center justify-center mt-[100px] items-center flex-col">
                <h1 className="text-[#2196F3] max-md:text-[16px] text-[33px] font-bold mb-12">If the email exists you'll receive a code</h1>
                <div className="w-full">
                    <input required value={code} onChange={(e) => setCode(e.target.value)} className="border-[#ccc] max-md:w-[95%] text-red-600 w-[80%] border-[1px] rounded p-2" type="text" placeholder="code" name="code" id="code" />
                    {errors.code &&  <div className="text-red-700 mt-4 font-bold">{errors.code[0]}</div>}
                </div>
                <div className="flex justify-center items-center w-full">
                    <input className="border-[#ccc] cursor-pointer max-md:w-[95%] w-[80%] mt-8 block bg-[#2196F3] text-white border-[1px] rounded px2 py-1 " type="submit" value="Reset Password"/>
                </div>
            </form>
            <Footer />
        </>
    )
}

export default VerifyEmail