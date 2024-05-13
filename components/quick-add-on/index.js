// @flow
import React from "react";
import {useCampaign} from "@limio/sdk";
import AddOn from "./components/AddOn";
import "./index.css";

type Props = {
    heading: string,
    subheading: string
};

export const AddOnCards = ({heading, subheading}: Props) => {
    const {addOns = []} = useCampaign()

    return (
        <section className="add-on-section">
            <div className="add-on-container">
                {heading || subheading ?
                    <div className="add-on-heading-container">
                        {heading && <h2 className="add-on-heading">Heading Text</h2>}
                        {subheading && <p className="add-on-subheading">Subheading Text</p>}
                    </div> : <> </>}
                <div className="add-on-grid">
                    {addOns.length > 0 ? (
                        addOns.map((addOn) => (
                            <AddOn key={addOn.path + "/parent"} addOn={addOn}
                            />
                        ))
                    ) : (
                        <p>No add-ons to display...</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AddOnCards;
