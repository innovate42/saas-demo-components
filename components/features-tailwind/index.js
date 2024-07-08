// @flow
import React from "react";
import {StaticImage} from "../source/components";
import "../source/style/style.css"

type Props = {
    header: string,
    subheader: string,
    imageFit: string,
    features: Array<{
        image: string,
        header: string,
        text: string,
        showButton__limio_boolean: boolean,
        buttonText: string,
        buttonLink: string
    }>,
    componentId: string,
};

export const Features = ({
                             header,
                             subHeader,
                             features = [],
                             imageFit
                         }: Props) => {

    const removeHTMLTags = (str) => {
        if ((str === null) || (str === ''))
            return "";
        else
            str = str.toString();
        return str.replace(/<[^>]*>/g, '');
    }


    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                <div className="max-w-screen-md mb-8 lg:mb-16">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{header}</h2>
                    <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">{subHeader}</p>
                </div>
                <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                    {features.map((feature, i) => (
                        <div key={`${header}-${i}`}>
                            {feature.image !== "" ? (
                                <div
                                    className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                    <StaticImage
                                        src={feature.image}
                                        alt={feature.header}
                                        style={{objectFit: imageFit}}
                                    />
                                </div>
                            ) : null}
                            <h3 className="mb-2 text-xl font-bold dark:text-white">{removeHTMLTags(feature.header)}</h3>
                            <div className="flex mb-4" dangerouslySetInnerHTML={{__html: feature.text}}/>
                            {/*<p className="text-gray-500 dark:text-gray-400">{feature.text}</p>*/}
                            {feature.showButton__limio_boolean && feature.buttonLink && (
                                <a onClick={() => (window.location = feature.buttonLink + window.location.search)}>
                                    <button type="button"
                                            className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                            text={feature.buttonText}>
                                        {feature.buttonText}
                                    </button>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
