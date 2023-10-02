import styled from "styled-components";
import { InputStyle } from "./Input";

const StyledArea = styled.textarea`
  ${InputStyle}
`;
export default function Textarea(props) {
   return <StyledArea {...props} />
}