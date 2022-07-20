import { Badge, Card, Layout, SkeletonBodyText, SkeletonDisplayText, SkeletonPage, Stack, TextContainer } from '@shopify/polaris'


const TableSkeleton = () => {
  return (

    // <SkeletonPage>
    //   <Layout>
    //     <Layout.Section>
    //       <Card sectioned>
    //         <TextContainer>
    //           <SkeletonDisplayText size="small" />
    //           <SkeletonBodyText lines={9} />
    //         </TextContainer>
    //       </Card>
    //     </Layout.Section>
    //   </Layout>
    // </SkeletonPage>

    <SkeletonPage >
      <Stack distribution="fill">
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
          </TextContainer>
        </Card>
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
          </TextContainer>
        </Card>
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
          </TextContainer>
        </Card>
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
          </TextContainer>
        </Card>
      </Stack>
      <Layout>
        <Layout.Section><br />
          <Card >
            <Card.Section>
              <TextContainer>
                <Stack distribution="trailing">
                  <Stack.Item >
                    <Badge><Badge></Badge><Badge></Badge><Badge></Badge></Badge>
                    <SkeletonDisplayText size="small" />
                  </Stack.Item>
                </Stack>
                <SkeletonBodyText lines={9} />
              </TextContainer>
            </Card.Section>
            <Card.Section>
              <Stack alignment="center" >
                <Stack.Item fill>
                  <SkeletonBodyText lines={1} />
                </Stack.Item>
                <Stack.Item fill>
                </Stack.Item>
                <Stack.Item fill>
                </Stack.Item>
                <Stack.Item fill>
                </Stack.Item>
                <Stack.Item fill>
                </Stack.Item>
                <Stack.Item fill>
                  <SkeletonDisplayText size="small" />
                </Stack.Item>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>

  )
}

export default TableSkeleton
