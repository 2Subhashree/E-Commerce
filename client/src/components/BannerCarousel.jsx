import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const BannerCarousel = ({ bannerImagesDesktop, bannerImagesMobile }) => {
  return (
    <>
        {/* Desktop Carousel */}
        <div className="hidden lg:block">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3000}
            transitionTime={500}
            stopOnHover
          >
            {bannerImagesDesktop.map((img, index) => (
              <div key={index}>
                <img src={img} alt={`Banner ${index}`} className="h-[500px] object-cover w-full " />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3000}
            transitionTime={500}
            stopOnHover
          >
            {bannerImagesMobile.map((img, index) => (
              <div key={index}>
                <img src={img} alt={`Mobile Banner ${index}`} className="h-48 object-cover w-full" />
              </div>
            ))}
          </Carousel>
        </div>
      </>
  );
};

export default BannerCarousel;
