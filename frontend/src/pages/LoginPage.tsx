import Form from "../components/Form"
import { FC } from "react"

import { AuthenticationProps } from "../types/types"


const LoginPage: FC<AuthenticationProps> = ({ setIsAuthenticated, isAuthenticated }) => {
    return (
        <>
            <Form route='auth' setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} name="login" />
        </>
    )
}

export default LoginPage