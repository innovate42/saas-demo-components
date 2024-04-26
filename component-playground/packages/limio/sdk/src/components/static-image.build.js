// @flow
// note plaving in a build.js file as will experiment with removing build.js files from the bundle and replacing with the content at build time
import * as React from "react";

type ResponsiveImage = {
  src: string,
  srcSet: string,
  placeholder: string | typeof undefined,
  images: { path: string, width: number, height: number }[],
  width: number,
  height: number,
};

type Props = {
  src: string | ResponsiveImage,
  loading?: "eager" | "lazy"
};

// will look at how we can make this static in the future.
export function StaticImage(props: Props): React.Node {
  const { src: image } = props;

  if (typeof image === "object") {
    // not sure i fully understand sizes.  Pick the biggest image that matches the screen resolution.
    // see https://medium.com/@woutervanderzee/responsive-images-with-srcset-and-sizes-fc434845e948
    // note we can probably scope this down a bit as that assumes the image is full screen
    let sizes = "100vw";

    // to maintain compatiblity with the way things work now we want to get the image size that matches the original image
    // we'll use srcSet to let the browser pick the smallest image that matches the screen resolution
    // Note that we'll jest set sizes to 100vw (which assumes that it is displauing 100% of width) . That is unlikelty the case, in which case this should have a more approviate value set

    // we should allow this to be overriden in the page build - so you can size the image correctly.
    let originalImage = image.images[image.images.length - 1];

    // unfortunatey we can't use this format due to the way we are using css styling in which.
    // return (
    //   <picture>
    //     <source srcSet={image.srcSet} type="image/webp" />
    //     <img src={image.src} srcSet={image.srcSet} width={originalImage.width} height={originalImage.height} sizes={sizes} loading="lazy" />
    //   </picture>
    // )

    // added className so that we can target css styling
    return (
      <img
        {...props}
        src={image.src}
        srcSet={image.srcSet}
        width={originalImage.width}
        height={originalImage.height}
        sizes={sizes}
        loading={props.loading || "lazy"}
        className="StaticImage"
      />
    );
  }

  return <img {...props} />;
}
