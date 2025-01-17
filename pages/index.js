import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";
import { Setting } from "@/models/Setting";
import Footer from "@/components/Footer";
import { styled } from "styled-components";


const LoveWrraper = styled.p`
color: red;
text-align: center;
padding: 2px;
width: 100%;
margin: 20px;
`;
export default function HomePage({featuredProduct, newProducts, wishedNewProducts}) {
  return (
    <div>
      
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />
      <Footer />
      <LoveWrraper>Made with ❤️ by Souhani</LoveWrraper>
    </div>
  )
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const settingDoc = await Setting.findOne({name:'featuredProduct'})
  const featuredProductId = settingDoc.value;
  const session = await getServerSession(context.req, context.res, authOptions);
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {sort: {'_id': -1}, limit: 5});
  const wishedNewProducts = session?.user? await WishedProduct.find(
    {
      userEmail: session.user.email,
      product: newProducts.map(p => p._id.toString()),
    }
  ): []
  return {
    props: { featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
             newProducts: JSON.parse(JSON.stringify(newProducts)),
             wishedNewProducts: JSON.parse(JSON.stringify(wishedNewProducts.map(item => item.product))),
           },
  }
}