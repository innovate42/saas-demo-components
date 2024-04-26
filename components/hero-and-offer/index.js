import * as React from "react";
import Hero from "./components/Hero";
import Offer from "./components/Offer";
import "./styles.css";
import type { HeroAndOfferProps } from "./types";

function HeroAndOffer({
  logoTextImg,
  heroImg,
  heroBannerText,
  underbuttonText,
  useDefaultSVG,
}: HeroAndOfferProps): React.ReactNode {
  return (
    <div className="hero-and-offer-container">
      <Hero
        logoTextImg={logoTextImg}
        heroImg={heroImg}
        heroBannerText={heroBannerText}
        useDefaultSVG={useDefaultSVG}
      />
      <Offer underbuttonText={underbuttonText} />
    </div>
  );
}

export default HeroAndOffer;
