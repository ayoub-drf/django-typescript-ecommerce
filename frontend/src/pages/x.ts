import { CartProps, Product } from "../types/types";
import { FC, useState, useEffect } from "react";
import api from "../api"
import { loadStripe } from "@stripe/stripe-js"
import { Elements  } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

interface CheckoutButtonProps {
    email: string;
    totalPrice: number;
    isFormValid: boolean;
}

const CheckoutButton: FC<CheckoutButtonProps> = ({ email, totalPrice, isFormValid }) => {
    const handleClick = async () => {
      const res = await api.post("create-checkout-session/", {email: email, totalPrice: totalPrice})
  
      const session = res.data;
  
      const stripe = await stripePromise;
  
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
  
      if (error) {
        console.error('Error:', error);
      }
    };
  
    return (
      <input type="submit" value="Continue"  disabled={!isFormValid} className="block p-3 my-4 border-[2px] bg-red-700 font-bold rounded text-white border-[#ccc] w-[70%]" onClick={handleClick} />
    );
  };

const CheckoutPage: FC<CartProps> = ({ cart }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productTotalPrice, setProductTotalPrice] = useState<number>(0);

  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("")

  const getProducts = async () => {
    try {
      const res = await api.get("products/");
      let count: number = 0;
      const filtered = res.data.filter((product: Product) => {
        if (cart[product.id]) {
          product["quantity"] = cart[product.id]["quantity"];
          count += Number(product.price) * product["quantity"];
          setProductTotalPrice(count.toFixed(2));
          return product;
        }
      });
      setFilteredProducts(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts()

  }, []);

  const validateEmail = (email: string) => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateForm = () => {
    if (email && address && postalCode && validateEmail(email)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    validateForm();
  }, [email, address, postalCode]);


  return (
    <section className="container mt-[44px] flex justify-between items-center">
      <div className="w-[50%] ">
        <form action="w-full">
          <input
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="block rounded p-3 my-4 border-[2px] border-[#ccc] w-[70%] "
            type="email"
            placeholder="Email"
          />
          {emailError && <span className="text-red-500 text-sm">{emailError}</span>} {/* Email error message */}
          <input
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            required
            className="block rounded p-3 my-4 border-[2px] border-[#ccc] w-[70%] "
            type="text"
            placeholder="Address"
          />
          <input
            onChange={(e) => setPostalCode(e.target.value)}
            value={postalCode}
            required
            className="block rounded p-3 my-4 border-[2px] border-[#ccc] w-[70%] "
            type="text"
            placeholder="Postal code"
          />
          <Elements stripe={stripePromise}>
            <CheckoutButton email={email} totalPrice={productTotalPrice} isFormValid={isFormValid} />
          </Elements>
        </form>
      </div>
      <div className="w-[50%] ">
        <a
          className="block font-bold w-fit mb-8 text-[33px] text-white bg-black py-1 rounded px-4 "
          href="/cart/"
        >
          Back to cart
        </a>
        <h2>Order Summary</h2>

        <div className="products">
            {
                filteredProducts.map((elem, index) => {
                    return <div key={index} className="flex justify-between items-center">
                        <img src={elem.image} width={100} alt="" />
                        <div className="name">{elem.name}</div>
                        <p>{elem.quantity}</p>
                    </div>
                })
            }
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
        </div>
      </div>
    </section>
  );
};

  
export default CheckoutPage;
