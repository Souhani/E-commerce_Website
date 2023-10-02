import { styled, css } from "styled-components"


export const InputStyle = css`
    width: 100%;
    box-sizing: border-box;
    padding: 5px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-family: inherit;
`;
 const StyledInput = styled.input`
   ${InputStyle}
`;
export default function Input(props) {
    return(
        <StyledInput {...props}/>
    )
}