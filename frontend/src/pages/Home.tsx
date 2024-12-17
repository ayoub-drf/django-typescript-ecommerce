import { useEffect, useState, FC } from "react"
import Landing from "../components/Landing"
import api from "../api";
import { Product } from "../types/types"
import Card from "../components/Card";
import { CartProps } from "../types/types"

const Home: FC<CartProps> = ({ cart, setCart }) => {
    const [products, setProducts] = useState<Product[]>([]);

    const getProducts = async () => {
        try {
            const res = await api.get("products/");
            setProducts(res.data)
        } catch (error) {
           console.log(error) 
        }

    };

    useEffect(() => {
        getProducts()

    }, [])
    return (
        <>
            <Landing />
            <div className="container py-8">
                <h2 className="text-[#2195F3] text-center text-[40px] mb-12 ">Popular Products</h2>
                <div className="cards max-md:grid-cols-1 max-lg:grid-cols-2 place-items-center rounded gap-4 grid items-center grid-cols-3 mt-12">
                    {products.map((elem: Product, index: number) => {
                        return <Card cart={cart} setCart={setCart} key={index} product={elem} />
                    })}
                </div>
            </div>
        </>
    )
}

export default Home