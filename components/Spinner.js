import { ClipLoader } from "react-spinners";
import styled from "styled-components";

const Wrapper = styled.div`
  ${props => props.fullWdith && 
    `
       display: block;
       display: flex;
       justify-content: center;
       margin: 30px 0 ;
    `}
    ${props => props.buttonstyle && 
    `
     height: ${props.size}px;
     display; flex;
     margin-bottom: 5px;
    `}

`;
export default function Spinner({fullWdith, buttonstyle, size}) {
    return(
        <Wrapper fullWdith={fullWdith} buttonStyle={buttonstyle} size={size}>
          <ClipLoader color={'#555'} speedMultiplier={2} size={size}/>  
        </Wrapper>
    )
}