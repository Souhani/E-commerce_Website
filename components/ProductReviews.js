import styled from "styled-components"
import Input from "./Input";
import WhiteBox from "./WhiteBox";
import RatingStars from "./RatingStars";
import Textarea from "./Textarea";
import Button from "./Button";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;
const Subtitle = styled.h3`
  margin-top: 5px;
  font-size: 1rem;
`;
const ColmnsWrapper = styled.div`
 display: grid;
 grid-template-columns: 1fr;
 gap: 20px;
 margin-bottom: 40px;
 @media screen and (min-width: 768px) {
  grid-template-columns: 1fr 1fr;
  gap: 40px;
 }

`;
const ReviewWrapper = styled.div`
   h3 {
    margin: 3px 0;
    font-size: 1rem;
    font-weight: normal;
    color: #333;
    
   }
   p {
    margin: 0;
    font-size: .7rem;
    line-height: 1rem;
    color: #555
   }
   margin-bottom: 10px;
   padding: 10px 0;
   border-top: 1px solid #eee;
   `;
const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  time{
    font-size: 12px;
    color: #aaa;
  }
`;
export default function ProductReviews({product}) {
  const [reviews,setReviews] = useState([]);
  const [stars, setStars] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setTDescription] = useState('');
  const [reviewsLoading, setReviewsLoading] = useState(false)

  async function submitReview() {
    const data = {product: product._id,
                  stars,
                  title, 
                  description,}
    await axios.post('/api/reviews', data);
    fetchProductReviews();
    setTitle('');
    setTDescription('');
    setStars(0);
  };
  async function fetchProductReviews() {
    setReviewsLoading(true);
    await axios.get('/api/reviews/?product='+product._id)
    .then(res =>setReviews(res.data));
    setReviewsLoading(false);
  }
  useEffect(() => {
    fetchProductReviews();
  },[])
    return (
        <div>
            <Title>Reviews</Title>
            <ColmnsWrapper>
              <div>
                <WhiteBox>
                  <Subtitle>Add review</Subtitle>
                  <RatingStars stars={stars} onChange={setStars}/>
                  <Input value={title}
                          onChange={ev => setTitle(ev.target.value)}
                          placeholder="Title"/>
                  <Textarea 
                          value={description}
                          onChange={ev => setTDescription(ev.target.value)}
                          placeholder="Write your review here..."/>
                  <div>
                    <Button primary={true} onClick={submitReview}>Submit your review</Button>
                  </div>
                </WhiteBox>
              </div>
              <div> 
                <WhiteBox>
                  <Subtitle>All reviews</Subtitle>
                  {reviewsLoading && 
                  <Spinner fullWdith={true} />
                  }
                  {!reviewsLoading && reviews.length === 0 &&
                    <p>No reviews</p>
                  }
                  {!reviewsLoading && reviews.length > 0 && reviews.map(review => (
                    <ReviewWrapper>
                      <ReviewHeader>
                        <RatingStars stars={review.stars} disable={true} size='sm'/>
                        <time>{new Date(review.createdAt).toLocaleString('en-US')}</time>
                      </ReviewHeader>
                      <h3>{review.title}</h3>
                      <p>{review.description}</p>
                    </ReviewWrapper>
                  ))
                  }               
                </WhiteBox>
              </div>
            </ColmnsWrapper>
        </div>
    )
}