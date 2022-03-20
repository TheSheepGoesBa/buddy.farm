import { useStaticQuery, graphql } from "gatsby"

interface Node {
  name: string
  image: string
  fields: {
    path: string
  }
}

interface SearchablesQuery {
  locations: {
    nodes: Node[]
  }
  items: {
    nodes: Node[]
  }
  pets: {
    nodes: Node[]
  }
  quests: {
    nodes: Node[]
  }
  questlines: {
    nodes: Node[]
  }
}

interface Searchable {
  name: string
  image: string
  href: string
  type: string | null
  searchText: string
}

const nodeToSearchable = (node: Node, type: string | null = null) => {
  const searchName = node.name.toLowerCase()
  return { name: node.name, image: node.image, searchText: searchName, href: node.fields.path, type }
}

export const useSearchables = () => {
  const { locations, items, pets, quests, questlines }: SearchablesQuery = useStaticQuery(
    graphql`
    query {
      locations: allLocationsJson {
        nodes {
          name
          image
          fields {
            path
          }
        }
      }
      items: allItemsJson {
        nodes {
          name
          image
          fields {
            path
          }
        }
      }
      pets: allPetsJson {
        nodes {
          name
          image
          fields {
            path
          }
        }
      }
      quests: allQuestsJson {
        nodes {
          name
          image: fromImage
          fields {
            path
          }
        }
      }
      questlines: allQuestlinesJson {
        nodes {
          name
          image
          fields {
            path
          }
        }
      }
    }
    `
  )
  const searchables: Searchable[] = [
    {
      name: "XP Calculator",
      image: "/img/items/7210.png",
      searchText: "xp calculator",
      type: null,
      href: "/xpcalc/",
    }
  ]
  for (const node of locations.nodes) {
    searchables.push(nodeToSearchable(node))
  }
  for (const node of items.nodes) {
    searchables.push(nodeToSearchable(node))
  }
  for (const node of pets.nodes) {
    searchables.push(nodeToSearchable(node))
  }
  for (const node of quests.nodes) {
    searchables.push(nodeToSearchable(node))
  }
  for (const node of questlines.nodes) {
    searchables.push(nodeToSearchable(node, "Questline"))
  }
  return searchables
}
