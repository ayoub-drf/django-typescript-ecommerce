import Form from "../components/Form"
import { FC } from "react"
import { AuthenticationProps } from "../types/types"
import GoogleLoginButton from "../components/GoogleLoginButton"


const LoginPage: FC<AuthenticationProps> = ({ setIsAuthenticated, isAuthenticated }) => {
    return (
        <>
            <Form route='auth' setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} name="login" />
            <div className="w-fit mx-auto">
                <GoogleLoginButton setIsAuthenticated={setIsAuthenticated} />
            </div>
        </>
    )
}

export default LoginPage