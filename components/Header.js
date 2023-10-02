import Link from "next/link";
import { styled } from "styled-components";
import Center from "./Center";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import BarsIcon from "./icons/Bars";
import SearchIcon from "./icons/SearchIcon";

const StyledHeader = styled.header`
   background-color: #222;
   position: sticky;
   top:0;
   z-index: 100;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: relative;
  z-index: 3;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;

`;

const StyledNav = styled.nav`
  ${ props=> props.activeNav ? `
    display: block;
    
  `
  : `
    display: none;
  `}

  background-color: #222;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 70px 20px 20px;
    
   @media screen and (min-width: 768px) {
    display: flex;
    gap: 15px;
    position: static;
    padding: 0;
   };
`;

const NavButton = styled.button`
  background-color: transparent;
  border: 0;
  color: #fff;
  width: 40px;
  height: 40px;
  cursor: pointer;
  position: relative;
  z-index: 3;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const SideIcons = styled.div`
 display: flex;
 gap: 10px;
 align-items: center;
 a {
  display: inline-block;
  color: #fff;
  svg {
    width: 18px;
    height: 18px;
   }
 }
 
`;
export default function Header() {
  const NavLink = styled(Link)`
  display: block;
  color: #aaaa;
  text-decoration: none;
  padding: 10px 0;
  @media screen and (min-width: 768px) {
    padding: 0;
  }
  ${props => typeof window !== "undefined" && props.href ===  window.location.pathname && 
    `color: #fff`}

`;
  const {cartProducts} = useContext(CartContext)
  const [activeNav, setActiveNav] = useState(false);
 
    return(
            <StyledHeader>
                <Center>
                    <Wrapper>
                        <Logo href={'/'}>Ecommerce</Logo>
                        <StyledNav activeNav={activeNav} >
                            <NavLink  href={'/'} >Home</NavLink>
                            <NavLink href={'/products'} >All products</NavLink>
                            <NavLink href={'/categories'} >Categories</NavLink>
                            <NavLink href={'/account'} >Account</NavLink>
                            <NavLink href={'/cart'} >Cart ({cartProducts.length})</NavLink>
                        </StyledNav>
                        <SideIcons>
                          <Link href={'/search'}>
                            <SearchIcon />
                          </Link>
                          <NavButton  onClick={() => setActiveNav(prev => !prev)}>
                            <BarsIcon/>
                          </NavButton>  
                        </SideIcons>
                    </Wrapper>
                </Center>      
            </StyledHeader>
    )
}