import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ProductBox from "@/components/ProductBox";
import SingleOrder from "@/components/SingleOrder";
import Spinner from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import WhiteBox from "@/components/WhiteBox";
import CheckIcon from "@/components/icons/CheckIcone";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin: 40px 0;
  @media screen and (min-width: 768px) { 
    grid-template-columns: 1.2fr 0.8fr;
  }

`;
const CityHolder = styled.div`
 display: flex;
 gap: 5px;
`;

const StyledSave = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
 
`
const WishlistProductsGrid = styled.div`
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: 50px;
`;

const WishlistEmpty = styled(Link)`
color: #555;
`;


export default function AccountPage() {
  const { data: session } = useSession();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isAddressLoaded, setIsAddressLoaded] = useState(true);
  const [isWishlistLoaded, setIsWishlistLoaded] = useState(true);
  const [isOrdersLoaded, setisOrdersLoaded] = useState(true)
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false)
  const [wishedProducts, setWishedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Orders');
  const [orders, setOrders] = useState([]);
  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    })
  };
  async function login() {
    await signIn('google', {
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    })
  };
  async function saveAccountInfo() {
    setSaving(true)
    const data = { name, email, city, country, postalCode, streetAddress }
    await axios.put('/api/account', data)
    setSaving(false)
    setSaved(true);
  };
  async function fetchWishedProducts() {
      setIsWishlistLoaded(false)
      await axios.get('/api/wishlist')
      .then(response => {
        if(response.data!=='not loged in'){
           setWishedProducts(response.data.map(wished => wished.product))
        }
      })
      setIsWishlistLoaded(true)
  };
  async function fetchAddress() {
      setIsAddressLoaded(false)
      await axios.get('/api/account')
      .then(res => {
        setName(res.data?.name || '');
        setEmail(res.data?.email || '');
        setCity(res.data?.city || '');
        setCountry(res.data?.country || '');
        setPostalCode(res.data?.postalCode || '');
        setStreetAddress(res.data?.streetAddress || '');
      });
     setIsAddressLoaded(true);
  };
  async function fetchOrders() {
    setisOrdersLoaded(false)
    await axios.get('/api/orders')
    .then(response => {setOrders(response.data)});
    setisOrdersLoaded(true);
  }
  useEffect(() => {
    if(session?.user){
      fetchAddress(); 
      fetchWishedProducts();
      fetchOrders();
  
    };
      }, [session]);

  function removedFromWishlist(removedProduct){
    setWishedProducts(products => {
      return [...products.filter(p => p._id.toString() !== removedProduct)]
    })
  }
  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <RevealWrapper delay={0}>
            <WhiteBox>
              <Tabs tabs={['Orders','Wishlist']} activeTab={activeTab} onChange={newTab => setActiveTab(newTab)} />
              {activeTab==='Wishlist' && 
              <>
                {session?.user ?
                
                <>
                  { !isWishlistLoaded && 
                          <Spinner fullWdith={true}/>}
                  { isWishlistLoaded && 
                    <WishlistProductsGrid>
                    {wishedProducts.length > 0 && wishedProducts.map(product => (
                        <ProductBox key={product._id} {...product} wished={true} onRemoveFromWishlist={removedFromWishlist} />
                    ))}
                      </WishlistProductsGrid>}
                  { isWishlistLoaded && wishedProducts.length===0 && 
                    <WishlistEmpty href={'/products'}>
                      Add products to your wishlist
                    </WishlistEmpty> } 
                </>
                  :            
                <>
                  Login to see your wishlist
                </>    
                }
              </>}
              {activeTab==='Orders' && 
               <>
                  {session?.user ? 
                  <>
                    {!isOrdersLoaded && 
                    <Spinner fullWdith={true} />
                    }
                    {isOrdersLoaded  &&
                    <div>{orders.map(order => (
                        <SingleOrder {...order} />
                      ))}
                    </div>}
                  </>
                  :
                  <>
                  Login to see your orders
                  </>
                 }
               </>
              }
            </WhiteBox>
          </RevealWrapper>
          <RevealWrapper>
            <WhiteBox delay={100}>
              <h2>
                {session?.user ? 
                <>Account details</>:
                <>Login with google</>}
              </h2>
              {!isAddressLoaded &&
                <Spinner fullWdith={true} />
              }
              {isAddressLoaded && session?.user &&
                <div>
                  <Input type="text"
                    placeholder="Name"
                    value={name}
                    name='name'
                    onChange={ev => { setName(ev.target.value); setSaved(false) }} />
                  <Input type="text"
                    placeholder="Email"
                    value={email}
                    name='email'
                    onChange={ev => { setEmail(ev.target.value); setSaved(false) }} />
                  <CityHolder>
                    <Input type="text"
                      placeholder="City"
                      value={city}
                      name='city'
                      onChange={ev => { setCity(ev.target.value); setSaved(false) }} />
                    <Input type="text"
                      placeholder="Postal Code"
                      value={postalCode}
                      name='postalCode'
                      onChange={ev => { setPostalCode(ev.target.value); setSaved(false) }} />
                  </CityHolder>
                  <Input type="text"
                    placeholder="Street Address"
                    value={streetAddress}
                    name='streetAddress'
                    onChange={ev => { setStreetAddress(ev.target.value); setSaved(false) }} />
                  <Input type="text"
                    placeholder="Country"
                    value={country}
                    name='country'
                    onChange={ev => { setCountry(ev.target.value); setSaved(false) }} />
                  <Button black={1} block={1} onClick={saveAccountInfo} >
                    {!saved && !saving && <StyledSave>Save</StyledSave>}
                    {saving && <StyledSave><Spinner buttonstyle={true} size={15} /></StyledSave>}
                    {saved && !saving && <StyledSave>Saved <CheckIcon /></StyledSave>}
                  </Button>
                  <hr />
                </div>
              }
              {session &&
                <Button primary={1} onClick={logout}>
                  Log out
                </Button>}
              {!session &&
                <Button primary={1} onClick={login}>
                  Log in
                </Button>}
            </WhiteBox>
          </RevealWrapper>
        </ColsWrapper>
      </Center>
    </>
  )
}