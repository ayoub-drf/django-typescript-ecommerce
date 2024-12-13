import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmail from './pages/VerifyEmail'



const App = () => {

    return (
        <>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />         
                <Route path='/login/' element={<LoginPage />} />         
                <Route path='/register/' element={<RegisterPage />} />         
                <Route path='/verify/' element={<VerifyEmail />} />         
            </Routes>
        </>
    )
}

export default App