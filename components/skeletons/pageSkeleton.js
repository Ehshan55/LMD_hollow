import { Card, Layout, SkeletonBodyText, SkeletonDisplayText, SkeletonPage, TextContainer } from '@shopify/polaris'


const PageSkeleton = () => {
  return (
    <SkeletonPage secondaryActions={4}>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
              <SkeletonBodyText />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
              <SkeletonBodyText />
              <SkeletonBodyText />
              <SkeletonBodyText />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card>
            <Card subdued>
              <Card.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={8} />
                </TextContainer>
              </Card.Section>
            </Card>
          </Card>
          <Card>
            <Card.Section>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </TextContainer>
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
          </Card>
          <Card subdued>
            <Card.Section>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={10} />
              </TextContainer>
            </Card.Section>
          </Card>

          <Card subdued>
            <Card.Section>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={1} />
              </TextContainer>
            </Card.Section>

          </Card>

        </Layout.Section>
      </Layout>
    </SkeletonPage>
  )
}
export default PageSkeleton
