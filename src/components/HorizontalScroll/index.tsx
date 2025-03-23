import Slider from "react-slick";
import styles from "./HorizontalScroll.module.scss";
import { useRef, useState } from "react";
import ArrowLeft from "../../assets/arrow-left.svg";
import ArrowRight from "../../assets/arrow-right.svg";

interface HorizontalScrollProps {
  children: React.ReactNode[];
  totalSize: number;
}

const HorizontalScroll = ({ children, totalSize }: HorizontalScrollProps) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index: number) => setCurrentIndex(index),
    adaptiveHeight: true,
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderRef = useRef<Slider | null>(null);

  const handlePrevDay = () => {
    if (currentIndex > 0) {
      if (sliderRef.current) {
        sliderRef.current.slickPrev();
      }
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextDay = () => {
    if (currentIndex < totalSize) {
      if (sliderRef.current) {
        sliderRef.current.slickNext();
      }
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className={styles.horizontalScrollContainer}>
      <Slider ref={sliderRef} {...settings}>
        {children.map((child, index) => (
          <div key={index} className={styles.scrollItem}>
            {child}
          </div>
        ))}
      </Slider>

      <div className={styles.stickyFooter}>
        <button onClick={handlePrevDay} className={styles.prev}>
          <img src={ArrowLeft} />
        </button>
        <button onClick={handleNextDay} className={styles.next}>
          <img src={ArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default HorizontalScroll;
