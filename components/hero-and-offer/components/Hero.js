import * as React from "react";
import type { HeroProps } from "../types";

function Hero({
  logoTextImg,
  heroImg,
  heroBannerText,
  useDefaultSVG,
}: HeroProps): React.ReactNode {
  return (
    <div className="hero-banner flex items-center justify-center flex-col gap-3 p-6">
      <div className="title-container">
        {useDefaultSVG && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="240"
            height="126"
            viewBox="0 0 240 126"
            fill="none"
          >
            <path
              d="M98 33.6C93.2 24.2 81.1 19 63.6 19C42.7 19 30.1 26.2 30.1 38.1C30.1 45.6 36.0001 50.6 48.4001 53.9L53.8 55.3L59.1 56.7L64.5 58.1C64.7 58.2 65.1 58.3 65.5 58.5C67.5 59.3 68.6 60.4 68.6 61.7C68.6 64.2 64.9 66 59.5 66C50.8 66 46.4001 64.2 43.9001 59.9L20.3 63C26.3 73.9 39.1 79.3 59 79.3C80.1 79.3 94.7 71 94.7 58.9C94.7 52.2 88.1 45.9 78 43.5L73.3001 42.4L68.6 41.2L64 40C62.6 39.6 61.4 39.3 60.3 38.9C57.6 38.1 56.4001 37.1 56.4001 35.6C56.4001 33.2 59.5001 31.7 64.3001 31.7C70.8001 31.7 75.5 33.7 77 37.4L98 33.6ZM157.6 39.1H136.6L132 58.6C130.4 65.2 127.3 68.5 122.6 68.5C120.1 68.5 118.8 67.5 118.8 65.5C118.8 64.9 118.8 64.4 119.5 61.7L124.9 39.1H103.6L97.9001 63.8C97.2001 66.8 96.8 69.2 96.8 70.5C96.8 75.6 103.3 79.6 111.6 79.6C120 79.6 125.2 77.3 130.3 71.2L128.5 78.6H148.5L157.6 39.1ZM162.1 39.1L152.8 78.6H173.3L178.9 54.9C179.9 50.7 182.6 48.6 186.8 48.6C190.2 48.6 192 49.6 192 51.7C192 52.3 191.8 53.5 191.4 54.9L185.9 78.6H206.9L213.2 51.6C213.5 50.2 213.8 48.8 213.8 47.6C213.8 41.8 207.4 37.9 198 37.9C189.4 37.9 183.1 40.5 179.9 45.5L181.5 39.1H162.1ZM125.2 24.3H129.2L129.9 21.4H116.9L116.2 24.3H120.1L117.8 34.2H123L125.2 24.3ZM139.7 29.1L138.5 34.3H143.7L146.7 21.5H141.5L140.4 26.2H135.7L136.8 21.5H131.6L128.6 34.3H133.8L135 29.1H139.7ZM159.6 31.3H151.6L152.1 29H158.6L159.2 26.2H152.7L153.2 24.2H160.9L161.5 21.4H148.6L145.6 34.2H158.8L159.6 31.3Z"
              fill="white"
            />
          </svg>
        )}
        {!useDefaultSVG && (
          <img src={logoTextImg} alt="logo text" className="logo-text-img" />
        )}
      </div>
      <h2 className="hero-banner-text">{heroBannerText}</h2>
      <div className="hero-img-container">
        <img src={heroImg} alt="hero image" className="img-resize hero-img" />
      </div>
    </div>
  );
}

export default Hero;
