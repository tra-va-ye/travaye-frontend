import { A11y, Autoplay } from "swiper";
import "swiper/css/bundle";
import { Swiper, SwiperSlide } from "swiper/react";
import Avatar from "../../../assets/avatar.png";
import {reviews} from './reviews.data';


const ReviewCarousel = ({ classes }) => {
  return (
    <Swiper
      className={classes.full}
      modules={[ A11y, Autoplay ]}
      autoplay={true}
      loop={true}
      speed={2000}
      spaceBetween={18}
      centeredSlides={true}
      slidesPerView={1.3}
      // breakpoints={{
      //   700: {
      //     slidesPerView: 2,
      //     spaceBetween: 28
      //   },
      // }}
    >
      {reviews.map((data, i) => {
        return (
          <SwiperSlide key={i} className={`flex flex-col gap-3 border-4 border-[#E9A309] bg-white rounded-lg !justify-between ${classes.revBox}`}>
            <h4 className={classes.name}>{data.name} says</h4>
            <p className={classes.review}>{data.review}</p>
            <div className="rounded-full !w-24">
              <img src={data.picture || Avatar} className="object-fill rounded-full" alt="" />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ReviewCarousel;
