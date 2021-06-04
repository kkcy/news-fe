import Analyser from "./analyser"
import { Row, Col } from "react-bootstrap"

const list1 = [
  "https://www.tradingview.com/ideas/",
  "https://www.tradingview.com/ideas/page-7",
  "https://www.tradingview.com/ideas/page-13",
]
const list2 = [
  "https://www.tradingview.com/ideas/page-2",
  "https://www.tradingview.com/ideas/page-8",
  "https://www.tradingview.com/ideas/page-14",
]
const list3 = [
  "https://www.tradingview.com/ideas/page-3",
  "https://www.tradingview.com/ideas/page-9",
  "https://www.tradingview.com/ideas/page-15",
]
const list4 = [
  "https://www.tradingview.com/ideas/page-4",
  "https://www.tradingview.com/ideas/page-10",
  "https://www.tradingview.com/ideas/page-16",
]
const list5 = [
  "https://www.tradingview.com/ideas/page-5",
  "https://www.tradingview.com/ideas/page-11",
  "https://www.tradingview.com/ideas/page-17",
]
const list6 = [
  "https://www.tradingview.com/ideas/page-6",
  "https://www.tradingview.com/ideas/page-12",
  "https://www.tradingview.com/ideas/page-18",
]

const listOfList = [list1, list2, list3, list4, list5, list6]

const TechnicalAnalysis = () => {
  return (
    <div className="news">
      <Row>
        {listOfList.map((list, index) => {
          return (
            <Col xs={12} sm={6} md={4} key={"technical" + index}>
              <div style={{ height: 15, borderTop: "1px solid #f9f7f1" }} />
              <Analyser source={list} rss={false} />
              <div style={{ height: 15 }} />
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default TechnicalAnalysis
