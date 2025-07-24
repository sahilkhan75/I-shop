// BannerSlider.jsx
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerSlider = () => {
  const banners = [
    { id: 1, image: "/ImagesForProducts/Cart-images/banner1.jpg" },
    { id: 2, image: "/ImagesForProducts/Cart-images/banner2.webp" },
    { id: 3, image: "/ImagesForProducts/Cart-images/banner3.jpg" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="w-full">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <img
              src={banner.image}
              alt={`Banner ${banner.id}`}
              className="w-full h-[500px] object-cover rounded-2xl"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
