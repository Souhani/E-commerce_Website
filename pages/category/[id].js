import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Spinner from "@/components/Spinner";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import axios from "axios";
import {useEffect, useState } from "react";
import styled from "styled-components";

const CategoryHeader = styled.div`
 display: flex;
 align-items: center;
 gap: 20px;
 justify-content: space-between;
 h1 {
    font-size: 1.5rem;
 }
`;
const FiltersWrapper = styled.div`
 display: flex;
 flex-wrap: wrap;
 margin: 5px 0;
 gap: 15px;
`;
const Filter = styled.div`
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #444;
  select {
    background-color: transparent;
    border: 0;
    font-size: inherit;
    color: inherit;
  }
`;


export default function CategoryPage({mainCategory, childCategories, products: originalProducts}) {
    const defaultSort = '_id-desc';
    const defaultFilters = mainCategory.properties.map(property => ({name: property.name, value:'all'}));
    const [products, setProducts] = useState(originalProducts);
    const [filters, setFilters] = useState(defaultFilters);
    const [sort, setSort] = useState(defaultSort);
    const [filtersChanged, setFiltersChanges] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    function handleFilterChange(filterName, filterValue){
        setFilters(prev=> {
            const newState = [...prev];
            return newState.map(f => ({
               name: f.name,
               value: f.name===filterName? filterValue: f.value,
            }))
          });
        setFiltersChanges(true);
    }

    useEffect(() => {
        if(!filtersChanged){
             return;
        }
        setLoadingProducts(true);
        const catIds = [mainCategory._id, ...(childCategories?.map(c => c._id) || [])];
        const params = new URLSearchParams;
          params.set('categories', catIds.join(','));
          filters.forEach(filter => {
            if(filter.value !== 'all'){
                params.set(filter.name, filter.value);
            }
          });
          params.set('sort', sort);
          const url = '/api/products?' + params.toString();
          axios.get(url)
          .then(response => {
            setProducts(response.data);
            setLoadingProducts(false);
          });
    },[filters, sort, filtersChanged]);

    return(
        <>
          <Header />
          <Center>
            <CategoryHeader>
                <h1>{mainCategory.name}</h1>
                <FiltersWrapper>
                    {mainCategory.properties.map(property => 
                        <Filter key={property.name}>
                            <span>
                                {property.name}:
                            </span>
                            <select value={filters.find(f => f.name===property.name).value }
                                    onChange={ev => handleFilterChange(property.name, ev.target.value)}>
                                <option value='all'>All</option>
                                {property.values.map(value => 
                                    <option key={value} value={value} >{value}</option>
                                )}
                            </select>
                        </Filter>        
                    )}  
                        <Filter>
                            <span>
                                Sort:
                            </span>
                            <select value={sort} onChange={(ev) => {
                                setSort(ev.target.value);
                                setFiltersChanges(true);
                                }}>
                                <option value='price-asc'>price, lowest first</option>
                                <option value='price-desc'>price, highest first</option>
                                <option value='_id-desc'>newest first</option>
                                <option value='_id-asc'>oldest first</option>
                            </select>
                        </Filter>
                </FiltersWrapper>
            </CategoryHeader>
            {!loadingProducts && 
              <div>
                 {products.length>0 && 
                  <ProductsGrid products={products} />
                  }
                  {
                    products.length===0 &&
                    <div>Sorry, no products found</div>
                  }
              </div>
            }
             {loadingProducts && <Spinner fullWdith/>}
          </Center>
        </>
    )
};

export async function getServerSideProps(context) {
    const {id} = context.query;
    await mongooseConnect();
    const mainCategory = await Category.findById(id);
    const childCategories = await Category.find({parent: mainCategory._id});
    const categoriesIds = [mainCategory._id, ...childCategories.map(c => c._id)];
    const products = await Product.find({category: categoriesIds}, null, {sort:{_id:-1}});
    return(
        {
            props: {
                mainCategory: JSON.parse(JSON.stringify(mainCategory)),
                products: JSON.parse(JSON.stringify(products)),
                childCategories: JSON.parse(JSON.stringify(childCategories)),
            }
        }
    )
}