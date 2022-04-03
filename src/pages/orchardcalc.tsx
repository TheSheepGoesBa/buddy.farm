import React, { useContext, useEffect, useState } from 'react'
import Accordion from "react-bootstrap/Accordion"

import { Calculator } from '../components/calculator'
import { Input } from '../components/input'
import { useLocations } from '../hooks/locations'
import { mergeSettings } from '../hooks/settings'
import { GlobalContext } from '../utils/context'

const DEFAULT_TREES = 2100

interface OrchardData {
  appleTrees: number
  orangeTrees: number
  lemonTrees: number
  maxInventory: number
  forester: number
  resourceSaver: number
  wanderer: number
  lemonSqueezer: boolean
  location: string
  makeCiders: boolean
  makePalmers: boolean
}

const DEFAULT_DATA: OrchardData = {
  appleTrees: DEFAULT_TREES,
  orangeTrees: DEFAULT_TREES,
  lemonTrees: DEFAULT_TREES,
  maxInventory: Math.ceil(DEFAULT_TREES * 1.3),
  forester: 30,
  resourceSaver: 20,
  wanderer: 33,
  lemonSqueezer: true,
  location: "Whispering Creek",
  makeCiders: false,
  makePalmers: true,
}

export default () => {
  const ctx = useContext(GlobalContext)
  const locations = useLocations("explore")
  const [values, setValues] = useState({
    forester: ctx.settings.forester ? parseInt(ctx.settings.forester, 10) : undefined,
    resourceSaver: ctx.settings.resourceSaver ? parseInt(ctx.settings.resourceSaver, 10) : undefined,
    wanderer: ctx.settings.wanderer ? parseInt(ctx.settings.wanderer, 10) : undefined,
    lemonSqueezer: !!ctx.settings.lemonSqueezer ? true : undefined,
  } as Partial<OrchardData>)
  // Combine inputs and defaults.
  const data: OrchardData = { ...DEFAULT_DATA }
  for (const key of Object.keys(values) as Array<keyof OrchardData>) {
    const value = values[key]
    if (value !== undefined) {
      (data[key] as any) = value
    }
  }

  // Write-back for settings.
  // TODO Abstract this, it's silly.
  useEffect(() => {
    ctx.setSettings(mergeSettings("forester", values.forester))
  }, [values.forester])
  useEffect(() => {
    ctx.setSettings(mergeSettings("resourceSaver", values.resourceSaver))
  }, [values.resourceSaver])
  useEffect(() => {
    ctx.setSettings(mergeSettings("wanderer", values.wanderer))
  }, [values.wanderer])
  useEffect(() => {
    ctx.setSettings(mergeSettings("lemonSqueezer", values.lemonSqueezer))
  }, [values.lemonSqueezer])

  // Calculations.
  const resourceSaverMul = 1 / (1 - (data.resourceSaver / 100))
  const foresterMul = 1 + (data.forester / 100)
  const wandererMul = 1 - (data.wanderer / 100)
  const apples = Math.min(Math.round(data.appleTrees * foresterMul), data.maxInventory)
  const oranges = Math.min(Math.round(data.orangeTrees * foresterMul), data.maxInventory)
  const lemons = Math.min(Math.round(data.lemonTrees * foresterMul), data.maxInventory)
  const appleStamina = data.makeCiders ? 0 : apples * 15
  const oj = Math.floor((oranges / 6) * resourceSaverMul)
  const ojStamina = oj * 100
  const lemonade = Math.floor((lemons / 6) * resourceSaverMul)
  const palmers = Math.floor((lemonade / 20) * resourceSaverMul)
  const lemonadeItems = data.makePalmers ?
    palmers * (data.lemonSqueezer ? 500 : 250) :
    lemonade * (data.lemonSqueezer ? 20 : 10)
  const lemonadeExplores = Math.round(lemonadeItems / locations[data.location].extra.baseDropRate)
  const explores = Math.floor((appleStamina + ojStamina) / wandererMul) + lemonadeExplores
  const stamina = appleStamina + ojStamina + Math.floor(lemonadeExplores * wandererMul)

  return <Calculator pageTitle="Orchard Calculator" valueSetter={setValues}>
    <Input.Text
      id="appleTrees"
      label="Apple Trees"
      placeholder={DEFAULT_TREES.toString()}
      pattern="^\d{1,4}$"
      type="number"
    />
    <Input.Text
      id="orangeTrees"
      label="Orange Trees"
      placeholder={DEFAULT_TREES.toString()}
      pattern="^\d{1,4}$"
      type="number"
    />
    <Input.Text
      id="lemonTrees"
      label="Lemon Trees"
      placeholder={DEFAULT_TREES.toString()}
      pattern="^\d{1,4}$"
      type="number"
    />
    <Input.Text
      id="maxInventory"
      label="Max Inventory"
      placeholder={DEFAULT_DATA.maxInventory.toString()}
      pattern="^\d{3,100}$"
      type="number"
    />
    <Input.Select
      id="location"
      label="Location"
      defaultValue={data.location}
    >
      {Object.values(locations).sort((a, b) => parseInt(a.jsonId, 10) - parseInt(b.jsonId, 10)).map(l => (
        <option key={l.name} value={l.name}>{l.name}</option>
      ))}
    </Input.Select>
    <Input.Switch
      id="makeCiders"
      label="Make Ciders"
      defaultChecked={data.makeCiders}
    />
    <Input.Switch
      id="makePalmers"
      label="Make Arnold Palmers"
      defaultChecked={data.makePalmers}
    />
    <Accordion className="mb-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Perks</Accordion.Header>
        <Accordion.Body css={{ "& *:last-child": { marginBottom: "0 !important" } }}>
          <Input.Text
            id="forester"
            label="Forester"
            placeholder="30"
            after="%"
            defaultValue={values.forester?.toString()}
            pattern="^\d{1,2}$"
            type="number"
          />
          <Input.Text
            id="resourceSaver"
            label="Resource Saver"
            placeholder='20'
            after="%"
            defaultValue={values.resourceSaver?.toString()}
            pattern="^\d{1,2}$"
            type="number"
          />
          <Input.Text
            id="wanderer"
            label="Wanderer"
            placeholder='33'
            after="%"
            defaultValue={values.wanderer?.toString()}
            pattern="^\d{1,2}$"
            type="number"
          />
          <Input.Switch
            id="lemonSqueezer"
            label="Lemon Squeezer"
            defaultChecked={data.lemonSqueezer}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    <Input.Text id="apples" label="Apples" disabled={true} value={apples.toLocaleString()} />
    <Input.Text id="oj" label="OJ" disabled={true} value={oj.toLocaleString()} />
    <Input.Text id="lemOrPalmers" label={data.makePalmers ? "Arnold Palmers" : "Lemonade"} disabled={true} value={(data.makePalmers ? palmers : lemonade).toLocaleString()} />
    <Input.Text id="explores" label="Explores" disabled={true} value={explores.toLocaleString()} />
    <Input.Text id="stamina" label="Stamina" disabled={true} value={stamina.toLocaleString()} />
  </Calculator>
}