import * as React from 'react';
import { SubscriptionItem } from './SubscriptionItem.js';
import {
    Box,
    Stack,
    Card,
    CardContent,
    Chip,
    TextField,
    MenuItem,
} from '@mui/material';

export function Subscriptions({ updateNotification, propsObject, subscriptions }) {
    const [statusFilter, setStatusFilter] = React.useState('all');

    const grouped = subscriptions.reduce((acc, sub) => {
        const accountId = sub?.zuoraAccount?.basicInfo?.accountNumber || 'Unknown Account';
        if (!acc[accountId]) acc[accountId] = [];
        acc[accountId].push(sub);
        return acc;
    }, {});

    console.log({grouped, subscriptions})

    const isVisible = (sub) => {
        return statusFilter === 'all' ||
            sub?.status?.toLowerCase() === statusFilter;
    };

    return (
        <Box>
            {/* Filter Bar */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <Chip
                    label={`Total Subscriptions: ${subscriptions.length}`}
                    color="default"
                />
                <TextField
                    size="small"
                    select
                    label="Status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
            </Stack>

            {/* Account Groups */}
            {Object.entries(grouped).map(([accountId, subs]) => {
                const visibleSubs = subs.filter(isVisible);
                if (!visibleSubs.length) return null;

                return (
                    <Card key={accountId} sx={{ mb: 4, borderRadius: 3 }} variant="outlined">
                        <CardContent>
                            <Stack spacing={2}>
                                {visibleSubs.map((subscription) => (
                                    <SubscriptionItem
                                        key={subscription.id}
                                        subscription={subscription}
                                        links={propsObject}
                                        headings={propsObject}
                                        updateNotification={updateNotification}
                                        propsObject={propsObject}
                                    />
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                );
            })}
        </Box>
    );
}
