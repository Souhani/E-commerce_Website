import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Spinner from "@/components/Spinner";
import Table from "@/components/Table";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import { useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useContext, useEffect, useState } from "react";
import { styled } from "styled-components";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin: 40px 0;
  table thead tr th:nth-child(3){
    text-align: right;
  }
  table tbody tr td:nth-child(3){
    text-align: right;
  }
  table tbody tr.subtotal td:nth-child(2){
    text-align: right;
    font-size: 1.4rem;
  }
  table tbody tr.subtotal td{
    padding: 15px 0;
  }
  table tbody tr.total td{
    padding: 15px 0;
    font-weight: 700;
  }
  table tbody tr.total td:nth-child(2){
    text-align: right;
    font-size: 1.4rem;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
`;


const  ProductInfoCell = styled.td`
   padding: 10px 0;
   
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  border: 1px solid rgb(0,0,0,.1);
  padding: 2px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 70px;
    height: 100px;
    img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const Quantity = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityLabel = styled.span`
  padding: 0 7px;
  display: block;
`;

const CityHolder = styled.div`
 display: flex;
 gap: 5px;
`

export default function Cart() {
    const { data: session } = useSession();  
    const {cartProducts, addProductToCart, removeProductFromCart, clearCart} = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [successedPayment, setSuccessedPayment] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);
    const [shippingFee, setShippingFee] = useState('');

    useEffect(() =>{
        if(cartProducts.length > 0){
            axios.post('/api/cart', {ids:cartProducts}).then(
                response => setProducts(response.data)
            )
        }else{{
          setProducts([])
        }}
    }
    ,[cartProducts]);

    let productsTotalPrice = 0;
    for(const productId of cartProducts){
      const price = products.find(product => productId==product._id)?.price || 0;
      productsTotalPrice += price;
    }

    async function goToPayment() {
       const response = await axios.post('/api/checkout', {
        name,email,city,postalCode,streetAddress,country,cartProducts,
      });
      if(response?.data?.url){
            window.location = response.data.url;
      }
    };
    useEffect(()=>{
      if(typeof window !== "undefined" && window.location.href.includes("success")){
        setSuccessedPayment(true);
        clearCart();
      }
    },[])
    useEffect(()=>{
      if(session?.user) {
        setIsLoaded(false)
        axios.get('api/account')
      .then(res => {
        setName(res.data.name);
        setEmail(res.data.email);
        setCity(res.data.city);
        setCountry(res.data.country);
        setPostalCode(res.data.postalCode);
        setStreetAddress(res.data.streetAddress);
        setIsLoaded(true)
      })
      }
    },[session]);
    useEffect(() => {
      axios.get('api/settings?name=shippingFee')
      .then(response => setShippingFee(response.data.value))
    },[])
    if(successedPayment) {
      if(window !== undefined) {
        window.localStorage.removeItem('cart')
      }
      return(
        <>
          <Header />
          <Center>
            <ColumnsWrapper>
             <WhiteBox>
               <h1>Thanks for your order</h1>
               <p>we will email you when your order will be sent.</p>
             </WhiteBox>
            </ColumnsWrapper>
          </Center>
        </>
      )
    };
    return(
        <div>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <RevealWrapper delay={0}>
                      <WhiteBox>
                          <h2>Cart</h2>
                          {!cartProducts?.length && <div>Your cart is empty</div>}
                          {products?.length > 0  && (
                              <Table>
                                <thead>
                                  <tr>
                                      <th>Product</th>
                                      <th>Quantity</th>
                                      <th>Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                      {products.map(product => {
                                          return(
                                              <tr key={product._id}>
                                                  <ProductInfoCell>
                                                      <ProductImageBox>
                                                        <img src={product.images[0]} alt='' />
                                                      </ProductImageBox>
                                                        {product.title}
                                                  </ProductInfoCell>
                                                  <td>
                                                    <Quantity>
                                                      <Button onClick={() => {removeProductFromCart(product._id)}}>-</Button>
                                                      <QuantityLabel>
                                                        {cartProducts.filter(id => id==product._id).length}
                                                      </QuantityLabel>                                                    
                                                      <Button onClick={() => {addProductToCart(product._id)}}>+</Button>
                                                    </Quantity>
                                                  </td>
                                                  <td>${parseFloat((cartProducts.filter(id => id==product._id).length*product.price).toFixed(2))}</td>
                                              </tr>
                                          )
                                })}
                                              <tr className="subtotal">
                                                <td colSpan={2}>Products</td>
                                                <td>${parseFloat(productsTotalPrice.toFixed(2))}</td>
                                              </tr>
                                              <tr className="subtotal">
                                                <td colSpan={2}>Shipping</td>
                                                <td>${parseFloat(shippingFee)}</td>
                                              </tr>
                                              <tr className="total">
                                                <td colSpan={2}>Total</td>
                                                <td>${parseFloat(productsTotalPrice.toFixed(2))+parseFloat(shippingFee)}</td>
                                              </tr>
                                </tbody>
                              </Table>
                          )}
                      </WhiteBox>
                    </RevealWrapper>
                    {!!cartProducts?.length && (
                    <RevealWrapper delay={100}>
                      <WhiteBox>
                          <h2>Order information</h2>
                          {!isLoaded &&
                          <Spinner fullWdith={true}/>
                          }
                          {isLoaded && 
                          <div>
                            <Input type="text" 
                                    placeholder="Name" 
                                    value={name}
                                    name='name'
                                    onChange={ev => setName(ev.target.value)} />
                            <Input type="text"
                                    placeholder="Email"
                                    value={email} 
                                    name='email'
                                    onChange={ev => setEmail(ev.target.value)} />
                            <CityHolder>
                              <Input type="text" 
                                      placeholder="City" 
                                      value={city} 
                                      name='city'
                                      onChange={ev => setCity(ev.target.value)} />
                              <Input type="text" 
                                      placeholder="Postal Code" 
                                      value={postalCode} 
                                      name='postalCode'
                                      onChange={ev => setPostalCode(ev.target.value)} />
                            </CityHolder>
                            <Input type="text" 
                                    placeholder="Street Address" 
                                    value={streetAddress} 
                                    name='streetAddress'
                                    onChange={ev => setStreetAddress(ev.target.value)} />
                            <Input type="text" 
                                    placeholder="Country" 
                                    value={country}
                                    name='country'
                                    onChange={ev => setCountry(ev.target.value)} />
                            <Button black={1} block={1} onClick={goToPayment}>Continue to payment</Button>
                          </div>}
                      </WhiteBox> 
                    </RevealWrapper>
                    )}

                </ColumnsWrapper>
            </Center>
        </div>
    )
}