import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { Container, Header, Breadcrumb } from 'semantic-ui-react'

export interface PageWithHeadingProps {
  title: string | JSX.Element,
}

export const PageWithHeading: FunctionComponent<PageWithHeadingProps> = ({ title, children }) => (
  <Container>
    <Header as='h1'>{title}</Header>
    {children}
  </Container>
)

export interface Breadcrumbs {
  name: string,
  path: string,
}

export interface PageWithBreadcrumbsProps {
  breadcrumbs: Breadcrumbs[],
}

export interface PageWithHeadingAndBreadcrumbsProps extends PageWithHeadingProps, PageWithBreadcrumbsProps {
}

export const PageWithHeadingAndBreadcrumb: FunctionComponent<PageWithHeadingAndBreadcrumbsProps> = ({ children, breadcrumbs, ...props }) => (
  <PageWithHeading {...props}>
    <Breadcrumb>
      {breadcrumbs.map((b, index) =>
        index === breadcrumbs.length - 1
          ? <Breadcrumb.Section key={b.name} active>{b.name}</Breadcrumb.Section>
          : (
            <React.Fragment key={b.name}>
              <Breadcrumb.Section
                link
                as={Link}
                to={
                  breadcrumbs
                    .slice(0, index + 1)
                    .map((b) => b.path)
                    .join('/')
                }
              >
                {b.name}
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon='right angle' />
            </React.Fragment>
          )
      )}
    </Breadcrumb>
    {children}
  </PageWithHeading>
)
