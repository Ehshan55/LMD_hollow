import { EmptyState } from '@shopify/polaris';
import React from 'react';

const EmptyResourceList = (props) => {
  return (
    <EmptyState
      heading={props.heading || 'Empty State'}
      //   action={{ content: 'Upload files' }}
      image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
    >
      <p>{props.content || 'Data needs to be added to display'}</p>
    </EmptyState>
  );
};

export default EmptyResourceList;
