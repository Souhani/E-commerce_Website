import { styled } from "styled-components"
import Link from "next/link";
import { useState } from "react";
import FlyingButton from "./FlyingButton";
import HeartOutlineIcon from "./icons/HeartOutlineIcon";
import HeartSolidIcon from "./icons/HeartSolidIcon";
import axios from "axios";


const ProductWrapper = styled.div`
  
`;
const WhiteBox = styled(Link)`
  background-color: #fff;
  height: 120px;
  padding: 20px;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  border-radius: 10px;
  img {
    max-width: 100%;
    max-height: 80px;
  }
  position: relative;
`;

const ProductInfoBox = styled.div`
   margin-top: 5px;
`;

const Title = styled(Link)`
 margin: 0;
 font-weight: normal;
 font-size: .9rem;
 color: inherit;
 text-decoration: none;
`;

const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
    justify-content: space-between;
    align-items: center;
    margin-top: 3px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 400;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    font-weight: 600;
    text-align: left;
  }
`;

const Wishlist = styled.button`
  border: 0;
  svg{
    width: 16px;
  }
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  background: transparent;
  cursor: pointer;
  ${props => props.isWished?
  `
   color:red;
  `:`
    color:black;
  `}
`



export default function ProductBox({_id, title, description, price, images, wished=false, onRemoveFromWishlist=false}) {
  const [isWished, setIsWished] = useState(wished)
    const url = '/product/'+_id;
    function addToWishlist(ev) {
      ev.preventDefault();
      const nextState = !isWished;
      if(onRemoveFromWishlist) {
        onRemoveFromWishlist(_id);
      }
      axios.post('/api/wishlist',{product: _id});
      setIsWished(nextState);
    }
    return(
        <ProductWrapper>
            <WhiteBox   href={url}>
                <div>
                  <Wishlist isWished={isWished} onClick={addToWishlist}>
                    {isWished ? 
                     <HeartSolidIcon />
                      : 
                      <HeartOutlineIcon />
                     }
                  </Wishlist>
                  <img src={images?.[0]} alt='' /> 
                </div>
            </WhiteBox>
            <ProductInfoBox>
                <Title href={url}> {title} </Title>
                <PriceRow>
                    <Price>
                      ${price}
                    </Price>
                <FlyingButton _id={_id} src={images?.[0]}>
                    Add to cart
                </FlyingButton>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    )
}