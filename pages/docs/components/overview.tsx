import { allDocs } from '.contentlayer/data'
import {
  GridItem,
  Heading,
  List,
  ListItem,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { GetStaticProps } from 'next'

import OverviewItem from 'components/overview/item'
import componentsSidebar from 'configs/components-sidebar'
import Layout from 'layouts'

type Component = {
  title: string
  description: string
  url: string
}

type Category = {
  title: string
  components: Component[]
}

type Props = {
  categories: Category[]
  headings: { id: string; text: string; level: number }[]
}

const ComponentsOverview = ({ categories, headings }: Props) => {
  return (
    <Layout
      frontMatter={{
        title: 'Components',
        slug: '/docs/components/overview',
        headings,
      }}
    >
      <VStack w='full' mt={5} alignItems='stretch' spacing={12}>
        <Text lineHeight={1.7}>
          Chakra UI provides prebuild components to help you build your projects
          faster. Here is an overview of the component categories:
        </Text>
        <List w='full' spacing={12}>
          {categories.map(({ title, components }) => {
            const slug = title.toLowerCase().replace(/ /g, '-')
            return (
              <ListItem
                key={title}
                display='flex'
                flexDirection='column'
                rowGap={6}
              >
                <Heading as='h2' size='md' id={slug} scrollMarginTop={24}>
                  {title}
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                  {components.map(
                    ({ title: componentTitle, description, url }) => {
                      const componentSlug = componentTitle
                        .toLowerCase()
                        .replace(/ /g, '-')
                      return (
                        <GridItem key={componentSlug}>
                          <OverviewItem
                            url={url}
                            title={componentTitle}
                            description={description}
                            slug={componentSlug}
                          />
                        </GridItem>
                      )
                    },
                  )}
                </SimpleGrid>
              </ListItem>
            )
          })}
        </List>
      </VStack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = componentsSidebar.routes[0].routes
    .splice(1)
    .filter(({ path }) => path !== '/docs/components/recipes')
  const categories: Category[] = await Promise.all(
    data.map(async ({ title, routes }) => {
      const components = await Promise.all(
        routes.map(async ({ title: routeTitle, path: url }) => {
          const { description } = allDocs.find((doc) => doc.slug === url)
          const component: Component = {
            title: routeTitle,
            url,
            description,
          }

          return component
        }),
      )

      const category: Category = {
        title,
        components,
      }

      return category
    }),
  )

  const headings = categories.map(({ title }) => ({
    id: title.toLowerCase().replace(/ /g, '-'),
    text: title,
    level: 1,
  }))

  return {
    props: {
      categories,
      headings,
    },
  }
}

export default ComponentsOverview
