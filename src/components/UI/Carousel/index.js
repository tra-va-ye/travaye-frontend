import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { A11y, Autoplay } from "swiper";
import Lagos from "../../../assets/lagos.png";
import Ibadan from "../../../assets/ibadan.png";
import Abuja from "../../../assets/abuja.png";
import WaterMark from "../../../assets/watermark.png";
import classes from "./Carousel.module.css";
import { IoStarSharp } from "react-icons/io5";

const Data = [
  { location: "Lagos, Nigeria", img: Lagos, rating: 3 },
  { location: "Ibadan, Nigeria", img: Ibadan, rating: 4 },
  { location: "Abuja, Nigeria", img: Abuja, rating: 3 }
];

const Carousel = () => {
  const totalRevs = [1, 2, 3, 4, 5];

  return (
    <>
      <Swiper
        spaceBetween={20}
        modules={[ A11y, Autoplay ]}
        autoplay={true}
        grabCursor={true}
        loop={true}
        speed={700}
        slidesPerView={1}
        slidesPerGroup={1}
        breakpoints={{
          860: {
            slidesPerGroup: 1,
            slidesPerView: 3,
          },
          500: {
            slidesPerView: 2,
            slidesPerGroup: 1,
          }
        }}
        keyboard={{
          enabled: true,
        }}
      >
        {Data.map((data, i) => {
          return (
            <SwiperSlide key={i}>
              <div className={classes.wholecover}>
                <img src={data.img} alt="poster" className="img-fluid" />
                <div className={classes.details}>
                  <img
                    src={WaterMark}
                    alt="watermark"
                    className={classes.watermark}
                  />
                  <div>
                    <p>{data.location}</p>
                    <div className={classes.ratings}>
                      {
                        totalRevs.map(val => (
                          <IoStarSharp key={val} size={32} fill={val <= data.rating ? "#E9A309" : "#D9D9D9"} />
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default Carousel;
