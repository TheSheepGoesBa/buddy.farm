import { Link } from 'gatsby'
import * as React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import { BsFillExclamationCircleFill } from '@react-icons/all-files/bs/BsFillExclamationCircleFill'
import {
  BsFillExclamationTriangleFill
} from '@react-icons/all-files/bs/BsFillExclamationTriangleFill'
import { BsFillQuestionCircleFill } from '@react-icons/all-files/bs/BsFillQuestionCircleFill'

import { CopyButton } from '../components/clipboard'

export interface ListItem {
  key?: string
  image: string
  lineOne: string
  lineTwo?: string | JSX.Element | JSX.Element[] | false | null | undefined
  value?: string | false | null | undefined
  href?: string | false | null | undefined
  hrefSlugify?: string | false | null | undefined
  alert?: string | null
  alertIcon?: string | null
}

interface ListItemProps {
  item: ListItem
  bigLine: boolean | undefined
}

interface ListProps {
  label?: string
  items: ListItem[]
  bigLine?: boolean
  copyText?: string
}

const alertIcon = (alertIcon: string | null | undefined) => {
  switch (alertIcon) {
    case "warning":
      return <BsFillExclamationTriangleFill className="text-warning" />
    case "error":
      return <BsFillExclamationCircleFill className="text-danger" />
    default:
      return <BsFillQuestionCircleFill className="text-info" />
  }
}

const bigLineStyle = {
  fontSize: 32,
  lineHeight: "48px",
  "@media (max-width: 576px)": {
    fontSize: 16,
    fontWeight: "bold",
  }
}

const ListItem = ({ item, bigLine }: ListItemProps) => {
  const href = item.href || (item.hrefSlugify && `/${item.hrefSlugify.toLowerCase().replace(/\s+/g, '-')}/`)
  const alert = item.alert && <OverlayTrigger overlay={
    <Tooltip>{item.alert}</Tooltip>
  }>
    <span className="bf-list-alert" css={{ marginRight: 10, fontSize: 26, display: "inline-block", verticalAlign: "text-bottom" }} onClick={evt => evt.preventDefault()}>{alertIcon(item.alertIcon)}</span>
  </OverlayTrigger>
  let elm = <>
    <div className="mw-100 flex-shrink-0 d-flex">
      <img src={"https://farmrpg.com" + item.image} className="d-inline-block align-text-top bf-list-image" width="48" height="48" css={{ marginRight: 10, boxSizing: "border-box" }} />
      <div className="d-inline-block align-text-top flex-shrink-1">
        <div className="bf-list-line-one" css={bigLine && !item.lineTwo ? bigLineStyle : { fontWeight: "bold" }}>{item.lineOne}</div>
        <div className="bf-list-line-two">{item.lineTwo}</div>
      </div>
    </div>
    <div>
      {alert}
      <span className="bf-list-value" css={bigLineStyle}>{item.value}</span>
    </div>
  </>
  if (href) {
    elm = <Link className="d-flex w-100 justify-content-between" css={{ flexWrap: "wrap", color: "inherit", textDecoration: "inherit", "&:hover": { color: "inherit" } }} to={href}>{elm}</Link>
  }
  return <ListGroup.Item key={item.key || item.lineOne} className="d-flex w-100 justify-content-between" css={{ flexWrap: "wrap" }}>{elm}</ListGroup.Item>
}

export default ({ label, items, bigLine, copyText }: ListProps) => (
  <>
    {label && items.length > 0 && <h3 css={{ marginTop: 20 }}>{label}{copyText && <CopyButton text={copyText} />}</h3>}
    <ListGroup variant="flush">
      {items.map((item: ListItem) => <ListItem item={item} bigLine={bigLine} />)}
    </ListGroup>
  </>
)
