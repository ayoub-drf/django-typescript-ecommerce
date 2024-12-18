import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmail from './pages/VerifyEmail'
import { ToastContainer } from "react-toastify"
import "react-toastify/ReactToastify.css"
import { useState, useEffect } from 'react'
import api from './api'
import { AxiosError } from 'axios'
import Loader from "./components/Loader"
import ResetPasswordPage from './pages/ResetPasswordPage'
import ResetPasswordDonePage from './pages/ResetPasswordDonePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const checkIsAuthenticated = async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/is-auth/")
            if (res.status === 200) {
                setIsAuthenticated(true)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error)
            }
        } finally {
            setIsLoading(false)
        }
    };

    const getCookie = (name: string) => {
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                if (name === cookies[i].split('=')[0].trim()) {
                    return JSON.parse(decodeURIComponent(cookies[i].split('=')[1]));
                }
            }
                  
        }
        return null;
    };

    const [cart, setCart] = useState<null | object>(getCookie("cart"))
    const [cartCount, setCartCount] = useState<number>(0)

    
    useEffect(() => {
        checkIsAuthenticated()
    }, [])

    useEffect(() => {
        if (cart) {
            setCartCount(Object.values(cart).reduce((acc, current) => acc + current.quantity , 0))
        } else {
            document.cookie = `cart=${JSON.stringify({})}; path=/; secure; samesite=strict`
            setCart(getCookie("cart"))
        }
    }, [cart])


    if (isLoading) return <Loader/>

    return (
        <>
            <Navbar cartCount={cartCount} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <Routes>
                <Route path='/' element={<Home cart={cart} setCart={setCart} />} />         
                <Route path='/login/' element={<LoginPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />         
                <Route path='/register/' element={<RegisterPage />} />         
                <Route path='/verify/' element={<VerifyEmail isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />         
                <Route path='/reset-password/' element={<ResetPasswordPage />} />         
                <Route path='/reset-password-done/:token/' element={<ResetPasswordDonePage />} />         
                <Route path='/cart/' element={<CartPage cart={cart} setCart={setCart} />} />         
                <Route path='/checkout/' element={<CheckoutPage cart={cart} />} />         
            </Routes>
            <ToastContainer />
        </>
    )
}

export default App