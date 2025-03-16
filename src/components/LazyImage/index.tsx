import { useState, useRef, useEffect } from "react";
import styles from "./LazyImage.module.scss";

interface LazyImageProps {
  src: string;
  alt: string;
}

const placeholder = "data:image/svg+xml,<svg>...</svg>";

export const LazyImage = ({ src, alt }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.imageWrapper}>
      <img
        ref={imgRef}
        src={isLoaded ? src : placeholder}
        style={{
          filter: isLoaded ? "none" : "blur(10px)",
          transition: "0.3s ease-in-out",
        }}
        alt={alt}
        className={`${styles.image} ${isLoaded ? styles.loaded : ""}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default LazyImage;
