import React from 'react';
import {
    Bullseye,
    Card,
    CardBody,
    Title,
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';

import { CubesIcon } from '@patternfly/react-icons'; // FIXME: different icon
import { Link } from 'react-router-dom';

const SourcesEmptyState = () => (
    <Card>
        <CardBody>
            <Bullseye>
                <EmptyState>
                    <EmptyStateIcon icon={CubesIcon} />
                    <Title headingLevel="h5" size="lg">No Sources</Title>
                    <EmptyStateBody>
                        No Sources have been defined. To start define a Source.
                    </EmptyStateBody>
                    <Link to='/new'>
                        <Button variant="primary">Add a Source</Button>
                    </Link>
                </EmptyState>
            </Bullseye>
        </CardBody>
    </Card>
);

export default SourcesEmptyState;
