import React from 'react';
import { styled } from "styled-components";


const FooterWrraper = styled.footer`
color: #fff;
text-align: center;
padding: 2px;
left: 0;
position: absolute
bottom: 0;
width: 100%;
margin-top: 50px;
`;

const Footer = () => {
  return (
    <FooterWrraper >
      <p></p>
    </FooterWrraper>
  );
};



export default Footer;
