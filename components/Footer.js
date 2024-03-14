import React from 'react';
import { styled } from "styled-components";


const FooterWrraper = styled.footer`
color: red;
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
      <p>Made with ❤️ by Souhani</p>
    </FooterWrraper>
  );
};



export default Footer;
