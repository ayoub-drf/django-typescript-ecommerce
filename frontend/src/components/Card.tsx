import { 
    CardProps,
    Category,
} from "../types/types"
import { FC, useState, useEffect } from "react"
import moment from 'moment';
import api from "../api";


const Card: FC<CardProps> = ({ product }) => {
    const [categoryName, setCategoryName] = useState<Category>({name: ''});

    const getCategoryName = async () => {
        try {
            const res = await api.get(`category/${product.category}/`)
            setCategoryName(res.data)
        } catch (error) {
            console.log(error) 
        }
    };

    useEffect(() => {
        getCategoryName()

    }, [])

    return (
        <div className="border border-[#ccc] ">
            <img src={product.image}  alt="" />
            <a className="text-center block text-[30px] my-2 font-bold text-[#2196F3] ">{product.name}</a>
            <div className="flex justify-between text-[15px] items-center p-2">
                <p className="font-bold">
                    Category:  
                    <span className="text-[#2196F3]"> {categoryName.name}</span>
                </p>
                <div className="font-bold">
                    {moment(product.created).fromNow()}
                </div>
            </div>
        </div>
    )
}

export default Card