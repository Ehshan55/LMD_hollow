import { Card, EmptyState } from '@shopify/polaris'
import React from 'react'

const EmptyDataState = (props) => {
    return (
        <Card sectioned>
        <EmptyState
          heading={props.title || "No data to display"}
        //   action={{content: 'Add transfer'}}
        //   secondaryAction={{content: 'Learn more', url: 'https://help.shopify.com'}}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>{props.message || 'Contact your admin' }</p>
        </EmptyState>
      </Card>
    )
}

export default EmptyDataState
