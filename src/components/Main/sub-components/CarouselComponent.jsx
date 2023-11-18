import { useEffect, useState } from "react"
import image1 from "../../../assets/1.png"
import image2 from "../../../assets/2.png"
import image3 from "../../../assets/3.png"

import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import axiosClient from "../../../axios-client"
export default function CarouselComponent() {
  const [images, setImages] = useState([])
  useEffect(() => {
    const getImages = async () => {
      try {
        const response = await axiosClient.get("/products/recent")
        setImages(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    getImages()
  }, [])
  return (
    <Carousel className="bg-back/50 py-2 -z-[999]" showThumbs={false} showStatus={false} infiniteLoop={true} autoPlay={true} showArrows={true}>
      {images.map((image, i) => {
        return <img key={i} className="rounded-md max-h-72 object-contain -z-40" src={import.meta.env.VITE_BASE_URL + "/" + image} />
      })}
    </Carousel>
  )
}
