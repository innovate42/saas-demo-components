export type HeroProps = {
  logoTextImg: string;
  heroImg: string;
  heroBannerText: string;
  useDefaultSVG: boolean;
};

export type OfferProps = {
  underbuttonText: string;
};

export type HeroAndOfferProps = HeroProps & OfferProps;
