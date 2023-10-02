import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { RevealWrapper } from "next-reveal";
import Link from "next/link";
import styled from "styled-components";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

const CategoryGrid = styled.div`
 display: grid;
 grid-template-columns: 1fr 1fr;
 gap: 20px;
 @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
 }
`;

const CategoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  a {
    color: #555;
  }
  h2 {
    margin: 0;
  }
`;

const CategoryWrapper = styled.div`
  margin-bottom: 40px;
`;

const ShowAllSquare = styled(Link)`
  height: 160px;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  text-decoration: none;
  border-radius: 10px;
`;

export default function({mainCategories, categoriesProducts, wishedProducts=[]}) {
    return(
        <>
           <Header />
           <Center>
              {mainCategories.map(cat=> 
                 (<CategoryWrapper>
                    <CategoryTitle>
                        <h2>
                            {cat.name}
                        </h2>
                        <div>
                          <Link href={'category/'+cat._id}>Show all</Link>
                        </div>
                    </CategoryTitle>
                    <CategoryGrid>
                      {categoriesProducts[cat._id].map(
                        (product, index) => (
                          <RevealWrapper  delay={index*50} key={index}>
                            <ProductBox {...product} wished={wishedProducts.includes(product._id)}/>
                          </RevealWrapper>
                        )
                      )}
                      <RevealWrapper  delay={categoriesProducts[cat._id].length*50}>
                        <ShowAllSquare href={'category/'+cat._id}>
                          Show all &rarr;
                        </ShowAllSquare>
                      </RevealWrapper>
                    </CategoryGrid>
                  </CategoryWrapper>)
                )}
           </Center>
        </>
    )
};



export async function getServerSideProps(context) {
    await mongooseConnect();
    const session = await getServerSession(context.req, context.res, authOptions);
    const categories = await Category.find();
    const mainCategories = categories.filter(cat=> !cat.parent);
    const categoriesProducts = {};
    const allProductsIds = [];
    for(const mainCategory of mainCategories){
        const mainCatId = mainCategory._id.toString();
        const childCatIds = categories.filter(cat => cat?.parent?.toString() === mainCatId).map(cat => cat._id.toString());
        const categoriesIds = [mainCatId, ...childCatIds];
        const products = await Product.find({category: categoriesIds}, null, {limit:3, sort:{'_id':-1}});
        allProductsIds.push(...products.map(p => p._id.toString()));
        categoriesProducts[mainCategory._id] = products;
    }
    const wishedProducts = session?.user? await WishedProduct.find({
      userEmail: session.user.email,
      product: allProductsIds,
    }) : [];
    return(
        {
            props: {
                mainCategories: JSON.parse(JSON.stringify(mainCategories)),
                categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
                wishedProducts: JSON.parse(JSON.stringify(wishedProducts.map(item => item.product.toString()))),
            }
        }
    )
}