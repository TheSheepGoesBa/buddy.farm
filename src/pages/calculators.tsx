import Layout from '../components/layout'
import List from '../components/list'

export default () => {
  return <Layout pageTitle="Calculators">
    <h1>Calculators</h1>
    <List items={[
      {
        lineOne: "XP Calculator",
        image: "/img/items/6137.png",
        href: "/xpcalc/",
      },
      {
        lineOne: "Orchard Calculator",
        image: "/img/items/orchard_sm.png",
        href: "/orchardcalc/",
      },
      {
        lineOne: "Tower Calculator",
        image: "/img/items/tower.png",
        href: "/towercalc/",
      },
      {
        lineOne: "Farm Animal Calculator",
        image: "/img/items/pigpen_sm.png",
        href: "/animalcalc/",
      },
    ]} bigLine={true} />
  </Layout>
}
