import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import FlyingButton from "@/components/FlyingButton";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import ProductReviews from "@/components/ProductReviews";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import CartIcon from "@/components/icons/CartIcon";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useContext } from "react";
import styled from "styled-components";


const ColWrapper = styled.div`
display: grid;
grid-template-columns: 1fr;
gap: 40px;
margin: 40px 0;
@media screen and (min-width: 768px) {
    grid-template-columns: 0.6fr 1.4fr;
}

`;

const Price = styled.span`
font-size: 1.4rem;
`;

const PriceRow = styled.div`
display: flex;
gap: 20px;
align-items: center;
`;

export default function ProductPage({product}) {
 const {addProductToCart} = useContext(CartContext);
    return(
        <>
          <Header />
          <Center>
              <ColWrapper>
                 <WhiteBox>
                    <ProductImages images = {product.images} />
                 </WhiteBox>
                 <div>
                    <Title>{product.title}</Title>
                    <p>{product.description}</p>
                    <PriceRow>
                        <div>
                            <Price>{product.price}</Price>
                        </div>
                        <div>
                            <FlyingButton primary src={product.images?.[0]} _id={product._id}>
                                <CartIcon />Add to cart
                            </FlyingButton>
                        </div>
                    </PriceRow>
                 </div>
              </ColWrapper>
              <ProductReviews product={product} />
          </Center>
        </>
    )
};

export async function getServerSideProps(context) {
    const {id} = context.query
    await mongooseConnect();
    const product = await Product.findById(id);
    return {
        props:{
            product: JSON.parse(JSON.stringify(product)),
        }
    
};
}