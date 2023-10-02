import styled from "styled-components"

const StyledOrder = styled.div`
margin: 10px 0;
padding: 10px 0;
border-bottom: 1px solid #ddd;
display: flex;
gap: 20px;
align-items: center;
time {
    font-size: 1rem;
    color: #555;
  }
`;

const Adress = styled.div`
    font-size: .8rem;
    line_height: 1rem;
    margin-top: 5px;
    color: #aaa;
`;
const ProductRow = styled.div`
 span {
    color: #888;
 }
`;

export default function SingleOrder({line_items, createdAt, ...rest}) {
    return(
       <StyledOrder>
        <div>
           <time>{(new Date(createdAt)).toLocaleString()}</time>
           <Adress>
              {rest.name}<br/>
              {rest.email}<br/>
              {rest.streetAddress}<br/>
              {rest.postalCode} {rest.city}, {rest.country}<br/>
           </Adress>
        </div>
        <div>
            {line_items.map(item => (
            <ProductRow key={item.price_data.product_data.name}>
                <span>{item.quantity} x </span>{item.price_data.product_data.name}
            </ProductRow>))}
        </div>
       </StyledOrder>
    )
}

// line-items [
//     {
//  quantity
//    price_data: {
//       product_data: {  name: title}
//     }
//
// }
//  ]