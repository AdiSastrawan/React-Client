import image1 from "../../../assets/1.png";
import image2 from "../../../assets/2.png";
import image3 from "../../../assets/3.png";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
export default function CarouselComponent() {
  return (
    <Carousel className="bg-back/50 py-2 -z-[999]" showThumbs={false} showStatus={false} infiniteLoop={true} autoPlay={true} showArrows={true}>
      <img className="rounded-md max-h-72 object-contain -z-40" src={image1} />
      <img className="rounded-md max-h-72 object-contain z-0" src={image2} />
      <img className="rounded-md max-h-72 object-contain z-0" src={image3} />
    </Carousel>
  );
}
