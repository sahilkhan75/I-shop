import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerSlider = () => {
  const banners = [
    {
      id: 1,
      image: "/ImagesForProducts/Cart-images/c8420c19b95fd55d7473907c59b0b1152f7cd0f0.png",
      title: "Welcome to I-Shop",
      subtitle: "Login now and enjoy exclusive offers",
      buttonLabel: "Login",
      buttonLink: "/login",
    },
    {
      id: 2,
      image: "/ImagesForProducts/Cart-images/banner1.jpg",
      title: "Best Deals Everyday",
      subtitle: "Sign in to get personalized discounts",
      buttonLabel: "Sign In",
      buttonLink: "/login",
    },
    {
      id: 3,
      image: "/ImagesForProducts/Cart-images/banner3.jpg",
      title: "Your Cart Awaits",
      subtitle: "Login to save your favorite items",
      buttonLabel: "Start Shopping",
      buttonLink: "/login",
    },
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
          <div key={banner.id} className="relative">
            <img
              src={banner.image}
              alt={`Banner ${banner.id}`}
              className="w-full h-[500px] object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col justify-center items-start p-10 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{banner.title}</h2>
              <p className="text-lg mb-4">{banner.subtitle}</p>
              <a
                href={banner.buttonLink}
                className="px-6 py-2 bg-teal-500 hover:bg-teal-600 transition rounded-full text-white font-semibold"
              >
                {banner.buttonLabel}
              </a>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
