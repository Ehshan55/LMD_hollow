import React, { lazy, Suspense } from 'react';

const ComponentLoader = ({ componentName, ...props }) => {
    const DynamicComponent = lazy(() =>
        import(`../row_components/${componentName}`).catch(() =>
            import(`../row_components/nullView`)
        )
    );

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DynamicComponent {...props} />
        </Suspense>
    );
};


export default ComponentLoader