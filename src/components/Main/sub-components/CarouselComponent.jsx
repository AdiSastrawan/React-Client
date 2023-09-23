import image1 from "../../../assets/1.png";
import image2 from "../../../assets/2.png";
import image3 from "../../../assets/3.png";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
export default function CarouselComponent() {
  return (
    <Carousel className="bg-secondary/50 py-2" showThumbs={false} showStatus={false} infiniteLoop={true} autoPlay={true} showArrows={true}>
      <div>
        <img className="rounded-md max-h-72 object-contain" src={image1} />
      </div>
      <div>
        <img className="rounded-md max-h-72 object-contain" src={image2} />
      </div>
      <div>
        <img className="rounded-md max-h-72 object-contain" src={image3} />
      </div>
    </Carousel>
  );
}
