import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/banners')
      .then(res => setBanners(res.data))
      .catch(err => console.error('Failed to load banners:', err));
  }, []);

  if (banners.length === 0) {
    return <div className="h-56 bg-gray-200 animate-pulse rounded-md" />;
  }

  return (
    <div className="w-full h-[230px] rounded-md overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.ID}>
            <img
              src={`http://localhost:5000/uploads/${banner.ImagePath}`}
              alt={banner.Title}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
