import Center from "@/components/Center";
import Header from "@/components/Header";
import { InputStyle } from "@/components/Input";
import ProductsGrid from "@/components/ProductsGrid";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import  debounce from 'lodash.debounce';
import Spinner from "@/components/Spinner";

const SearchInput = styled.input`
  ${InputStyle}
  padding: 5px 10px;
  font-size: 1.4rem;
  border-radius: 5px;
`;

const InputWrapper = styled.div`
 position: sticky;
 top: 62px;
 padding: 20px 0 5px;
 margin: 15px 0;
 background-color: #eeee;
 z-index: 10;
`;
export default function SearchPage() {
     const inputRef = useRef(null) ;
     const [seacrhField, setSearchField] = useState('');
     const [products, setProducts] = useState([]);
     const [isLoading, setisLoading] = useState(false)

     const debouncedSearch = useCallback(debounce(searchProducts, 500), [])
     function searchProducts(seacrhField) {
      axios.get('/api/products/?seacrhField='+encodeURIComponent(seacrhField))
      .then(response => setProducts(response.data));
      setisLoading(false)
     }
     useEffect(() => {
      inputRef.current.focus();
    },[

    ]);
    useEffect(() => {
      if(seacrhField.length > 0){
        setisLoading(true)
        debouncedSearch(seacrhField);
      } else {
        setProducts([]);
      }
    },[seacrhField]);
    return(
        <>
          <Header />
          <Center>
            <InputWrapper>
              <SearchInput placeholder={'Search for poducts'} 
                          ref={inputRef}
                          value={seacrhField}
                          onChange={(ev)=> setSearchField(ev.target.value)}/>
            </InputWrapper>
            {!isLoading && seacrhField!=='' && products.length===0 && 
             <h2>No products found for the query &quot;{seacrhField}&quot; </h2>}
             {!isLoading && products.length>0 &&
             <ProductsGrid products={products} />}
             {isLoading &&
             <Spinner fullWdith={1} />}
            
          </Center>
        </>
    )
};
