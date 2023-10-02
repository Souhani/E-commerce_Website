import styled,{css} from 'styled-components';
import { ButtonStyle } from './Button';
import { primary } from '@/lib/colors';
import { useContext, useEffect, useRef } from 'react';
import { CartContext } from './CartContext';

const FlyingButtonWrapper = styled.div`
  button{
    ${ButtonStyle}
    ${props => props.primary ? css`
    border: 1px solid ${primary};
    background-color: ${primary};
    color: #fff;
    svg{
        height: 20px;
    }
    `: css`
    border: 1px solid ${primary};
    background-color: transparent;
    color: ${primary};
    display: block;
    width: 100%;`
}
${props => props.white && css`
      border: 1px solid #fff;
      background-color: #fff;
      color: #000;
      display: flex;
      `}
  }
  @keyframes fly {
    100%{
        top: 0;
        left: 65%;
        opacity: 0;
        max-width: 50px;
        max-height: 50px;
    }
  }
  img{
    display: none;
    position: fixed;
    max-width: 100px;
    max-height: 100px;
    animation: fly 1s;
    border-radius: 10px;
    opacity: 1;
    z-index: 1000;
  }
`;
export default function FlyingButton(props) {
    const {addProductToCart} = useContext(CartContext); 
    const imgRef = useRef();
    function sendImageToCart(ev) {
        imgRef.current.style.display = 'inline-block';
        imgRef.current.style.left = (ev.clientX-50) + 'px';
        imgRef.current.style.top = (ev.clientY-50) + 'px';
        setTimeout(() => {imgRef.current.style.display = 'none'},1000)
    }
    useEffect(() => {
           const interval = setInterval(()=>{
              const reveal = imgRef.current?.closest('div[data-sr-id]');
              if(reveal?.style.opacity==='1'){
                reveal.style.transform='none';
              }
             
           },100)
           return () => clearInterval(interval);
    },[])
    return(
        <FlyingButtonWrapper onClick ={() => addProductToCart(props._id) } 
                             primary={props.primary} white={props.white}   
                             >
            <img src={props.src} alt='' ref={imgRef}/>
            <button onClick={(ev) => sendImageToCart(ev)} {...props} />
            </FlyingButtonWrapper>
            )
}