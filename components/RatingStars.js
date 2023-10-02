import styled from "styled-components";
import StarOutlineIcon from "./icons/StarOutlineIcon";
import StarSolidIcon from "./icons/StarSolidIcon";
import { useState } from "react";
import { primary } from "@/lib/colors";


const StarWrapper = styled.button`
  background-color: transparent;
  padding:0;
  border: 0;
  display: inline-block;
  color: ${primary};
  ${props => props.size==='sm' && `
    height: 1rem;
    width: 1rem;
  `} 
  ${props => props.size==='md' && `
    height: 1.4rem;
    width: 1.4rem;
  `} 
 ${props => !props.disable && `
   cursor: pointer;
 `} 
`
const RatingWrapper = styled.div`
display: inline-flex;
gap: 1px;
align-items: center;
`
export default function RatingStars({stars=0, onChange=()=>{}, disable=false, size='md'}) { 
  function handleRateChange(rate) {
    if(!disable) {
      onChange(rate)
    }
  }
        const rate = [];
        for(let i=1; i<6; i++){
                rate.push(<StarWrapper size={size} disable={disable} onClick={() => handleRateChange(i)}>{stars >= i ? <StarSolidIcon /> : <StarOutlineIcon />}</StarWrapper>)
        }
  return(
    <RatingWrapper>
        {rate.map(star=>  
        <div key={star}>{star}</div>
        )}
    </RatingWrapper>
  )  
}