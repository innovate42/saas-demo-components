// @flow
import * as React from "react";
import { Typography, Box } from "@mui/material";

type Props = {
    label: string,
    content: string,
    themeStyles: Object,
};

function StaticSection({ label, content, themeStyles }: Props): React.Node {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", color: themeStyles.text }}
            >
                {label}
            </Typography>
            <Typography variant="body1" sx={{ color: themeStyles.text }}>
                {content}
            </Typography>
        </Box>
    );
}

export default StaticSection;
