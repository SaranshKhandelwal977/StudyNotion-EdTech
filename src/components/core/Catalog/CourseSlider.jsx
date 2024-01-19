import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { Navigation} from 'swiper/modules';
import Course_card from './Course_card';

const CourseSlider = ({courses}) => {
  return (
    <div>
        {
            courses?.length > 0 ? 
            (
                <Swiper 
                    slidesPerView={1}
                    loop={true}
                    spaceBetween={25}
                    navigation={true}
                    
                    modules={[Navigation]}
                    breakpoints={{
                        1024:{slidesPerView:3,}
                    }}
                    className="mySwiper"
                >
                        {
                            courses.map((course,index) => (
                                <SwiperSlide key={index}>
                                    <Course_card course={course} height={"h-[250px]"}/>
                                </SwiperSlide>
                            ))
                        }
                </Swiper>
            ) : 
            (<p className="text-xl text-richblack-5">No courses found</p>)
        }
    </div>
  )
}

export default CourseSlider