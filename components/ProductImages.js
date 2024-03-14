import { useState } from "react";
import styled from "styled-components"

const Image = styled.img`
width: 50px;
height: 50px;
overflow: hidden;
object-fit: cover;
`;

const BigImage = styled.img`
width: 300px;
height: 300px;
overflow: hidden;
object-fit: cover;
`;

const MainImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ImagesButtons = styled.div`
display: flex;
justify-content: center;
gap: 10px;
margin-top: 20px;
`;

const ImageButton = styled.div`
border: 2px solid #ccc; 
${
    props => props.active ? `
      border-color: #ccc;
    ` : `
     border-color: transparent;
    `
}
border-radius: 5px;
height: 40px;
width: 40px;
display: flex;
align-items: center;
justify-content: center;
padding: 10px;
cursor: pointer;
`;

export default function ProductImages({images}) {
  const [activeImage, setActiveImage] = useState(images?.[0])
    return(
       <>
       <MainImage>
         <BigImage src={activeImage} alt='' />
       </MainImage>
         <ImagesButtons>
            {images.map(image => (
                <ImageButton key={image} active={image === activeImage} onClick={() => setActiveImage(image)}>
                  <Image src={image} alt='' />
                </ImageButton>
            ))}
         </ImagesButtons>
       </>
    )
}