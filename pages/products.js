import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Footer from "@/components/Footer";


export default function ProductsPgae({products, wishedProducts}) {
    return(
     <>
       <Header />
       <Center>
        <Title>All products</Title>
        <ProductsGrid products={products} wishedProducts={wishedProducts} />
       </Center>
       <Footer />
     </>
    )
};

export async function getServerSideProps(context) {
    await mongooseConnect();
    const session = await getServerSession(context.req, context.res, authOptions);
    const products = await Product.find({}, null, {sort: {'_id':-1}});
    const wishedProducts = session?.user? await WishedProduct.find({ userEmail: session.user.email }): [];
    return(
        {
            props: {
               products: JSON.parse(JSON.stringify(products)),
               wishedProducts: JSON.parse(JSON.stringify(wishedProducts.map(item => item.product.toString())))
            }
        }
    )
}