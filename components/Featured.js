import Center from "./Center";
import styled from "styled-components";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import FlyingButton from "./FlyingButton";
import { RevealWrapper } from  'next-reveal';

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
 margin: 0;
 font-weight: normal;
 font-size: 1.5rem;
 @media screen and (min-width: 768px) {
  font-size: 3rem;
 }
`;

const Desc = styled.p`
  color: #aaa;
  font-size: .8rem;
`;

const ColumnsWrapper = styled.div`
  display : grid;
  grid-template-columns: 1fr;
  gap: 40px;
  div:nth-child(1){
    order: 1;
  }
  .mainImage{
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: .9fr 1.1fr;
    div:nth-child(1){
      order: 0;
    }
    .mainImage{
      max-width: 100%;
      max-height: 400px;
    }
  }
`;
const StyledImageRevealWrapper = styled(RevealWrapper)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const StyledContentRevealWrapper = styled(RevealWrapper)`
@media screen and (max-width: 768px) {
  display: grid;
 justify-items: center;
}
`
const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
 display: flex;
 gap: 10px;
 margin-top: 10px;
 @media screen and (min-width: 768px) {
   margin-top: 25px;
 }
`;



export default function Featured({product}) {
    return (
        <Bg>
            <Center>
               {product && 
                <ColumnsWrapper>
                <Column>
                  <StyledContentRevealWrapper origin='left' delay={0}>
                    <Title>{product.title}</Title>
                    <Desc>{product.description}</Desc>
                    <ButtonsWrapper>
                        <ButtonLink href={"/product/"+ product._id} white={1} outline={1} >Read more</ButtonLink>
                        <FlyingButton _id={product._id}  src={product.images?.[0]} white={1} >
                             <CartIcon />
                             Add to cart
                        </FlyingButton>
                    </ButtonsWrapper>
                  </StyledContentRevealWrapper>
                </Column>
                <Column>
                  <StyledImageRevealWrapper delay={0}>
                    <img className='mainImage' src={product.images?.[0]}  alt="" />
                  </StyledImageRevealWrapper>
                </Column>
            </ColumnsWrapper>}
            </Center>
        </Bg>
    )
}