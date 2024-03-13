import { CartContextProvider } from '@/components/CartContext';
import { createGlobalStyle } from 'styled-components';
import { SessionProvider } from "next-auth/react";
import Spinner from '@/components/Spinner';


const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
   body{
    background-color: #eee;
    padding: 0;
    margin: 0;
    font-family: 'Poppins', sans-serif;  
   }
   hr{
    display: block;
    border:0;
    border-top: 1px solid #ccc;
   }
`;

 export default function App({ Component, pageProps: {session, ...pageProps} }) {
  const [initialLoad, setIntialLoad] = useState(false);
  useEffect(() => {
    setIntialLoad(true)
  },[])
  return(
    <>
      {
        initialLoad ? <>
        <GlobalStyles />
      <SessionProvider session={session}>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </SessionProvider></> 
      : <div style={{display:"flex", justifyContent:"center", alignItems:"center", width:"100%", height:"100vh"}}><Spinner/></div>
      }
    </>
  ) 
}
