import { useState, useEffect, FC } from "react";
import api from "../api";
import { Product } from "../types/types";
import { CartProps } from "../types/types";

const CartPage: FC<CartProps> = ({ cart, setCart }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productTotalPrice, setProductTotalPrice] = useState<number>(0);

  const getProducts = async () => {
    try {
      const res = await api.get("products/");
      let count: number = 0;
      const filtered = res.data.filter((product: Product) => {
        if (cart[product.id]) {
            product["quantity"] = cart[product.id]["quantity"]
            count += (Number(product.price) * product['quantity'])
            setProductTotalPrice(count.toFixed(2))
            return product
        }
      });
      setFilteredProducts(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  const removeTargetProduct = (id: number) => {
    delete cart[id]
    // setProductTotalPrice(0)
    document.cookie = `cart=${JSON.stringify(cart)}; path=/; secure; samesite=strict`
    setCart( {...cart} )
  }

  const increaseTargetProduct = (id: number) => {
    cart[id]["quantity"] += 1
    document.cookie = `cart=${JSON.stringify(cart)}; path=/; secure; samesite=strict`
    setCart( {...cart} )
  }

  const deCreaseTargetProduct = (id: number) => {
    cart[id]["quantity"] -= 1
    if (cart[id]["quantity"] == 0) {
        removeTargetProduct(id)
    }
    document.cookie = `cart=${JSON.stringify(cart)}; path=/; secure; samesite=strict`
    setCart( {...cart} )
  }

  useEffect(() => {
    getProducts();
    if (Object.keys(cart).length === 0) {
      setProductTotalPrice(0);
    }
  }, [cart]);

  return (
    <div className="cart">
      <div className="container p-4">
        <table className="w-[100%]">
          <thead>
            <tr>
              <th className="text-[#2196F3] bg-[#ddd] text-center p-4 ">
                Product
              </th>
              <th className="text-[#2196F3] bg-[#ddd] text-center p-4 ">
                Name
              </th>
              <th className="text-[#2196F3] bg-[#ddd] text-center p-4 ">
                Price
              </th>
              <th className="text-[#2196F3] bg-[#ddd] text-center p-4 ">
                Quantity
              </th>
              <th className="text-[#2196F3] bg-[#ddd] text-center p-4 ">
                Handle
              </th>
            </tr>
          </thead>
          {
            filteredProducts.map((elem, index) => 
                <tbody key={index}>
                    <tr>
                    <td className="text-center">
                        <img src={elem.image} width={100} alt="" />
                    </td>
                    <td className="text-center">{elem.name}</td>
                    <td className="text-center">{elem.price ? elem.price : "1000"} $</td>
                    <td className="text-center">
                        <button
                        className="bg-blue-900 mr-3 text-white border-none rounded-[50%] cursor-pointer w-[30px] h-[30px] "
                        id="minus"
                        onClick={() => deCreaseTargetProduct(elem.id)}
                        data-name="minus"
                        data-product=""
                        >
                        -
                        </button>
                        <span>
                            {elem.quantity}
                        </span>
                        <button
                        className="bg-green-700 ml-3 text-white border-none rounded-[50%] cursor-pointer w-[30px] h-[30px] "
                        id="plus"
                        onClick={() => increaseTargetProduct(elem.id)}
                        data-name="plus"
                        data-product=""
                        >
                        +
                        </button>
                    </td>
                    <td className="text-center">
                        <button onClick={() => removeTargetProduct(elem.id)}
                        className="bg-red-700 text-white border-none rounded-[50%] cursor-pointer w-[30px] h-[30px] "
                        id="xmark"
                        data-name="remove"
                        data-product=""
                        >
                        x
                        </button>
                    </td>
                    </tr>
                </tbody>
            )
          }
        </table>
      </div>
      <div className="container mt-2 p-4">
        <h1 className="text-[22px] font-bold ">Cart total</h1>
        <div>
            <p className="items">
                Items: 
                <span>
                  {Object.values(cart).reduce((acc, current) => acc + current.quantity, 0)}
                </span>
            </p>
            <p className="price">
                {productTotalPrice}
            </p>
        </div>
        <a href="/checkout/" className="bg-[#2196F3] rounded w-fit block mt-8 px-8 py-4 text-white font-bold text-[23px] ">Proceed to checkout</a>
      </div>
    </div>
  );
};

export default CartPage;
