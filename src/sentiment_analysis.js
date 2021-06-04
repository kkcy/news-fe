import { Table } from "react-bootstrap"
import { useState, useEffect } from "react"
import styled from "styled-components"
import useInterval from "@use-it/interval"
import axios from "axios"

const baseUrl = process.env.REACT_APP_BASE_URL

const decodeString = (input) => {
  var txt = document.createElement("textarea")
  txt.innerHTML = input
  return txt.value
}

const ResponsiveWrapper = styled.div`
  height: 500px;
  overflow-y: scroll;
`
const ResponsiveTd = styled.td`
  min-width: 250px;
`
const ResponsiveSmallTd = styled.td`
  min-width: 50px;
`

const SentimentAnalysis = ({ rssFeed }) => {
  const [feed, setFeed] = useState(rssFeed)
  const [rssCount, setRssCount] = useState(null)
  const [visibleFeed, setVisibleFeed] = useState([])
  const [page, setPage] = useState(null)
  const [totalPage, setTotalPage] = useState(1)
  const [limit, setLimit] = useState(300)

  const getRssCount = async () => {
    const countRes = await axios.get(`${baseUrl}/api/v1/rss/count`)
    let count = countRes?.data?.data?.count
    let tLimit = 300

    if (count < 300) {
      tLimit = count
    }

    setRssCount(count)
    setLimit(tLimit)
    setTotalPage(Math.floor(count / tLimit))
  }

  const parseRss = async () => {
    const newFeed = await axios.get(
      `${baseUrl}/api/v1/rss?_limit=${limit}&_offset=${page * limit}`
    )

    setFeed(newFeed.data.data.reverse())
  }

  const updateTable = () => {
    if (feed?.length > 0) {
      const thisFeed = feed.splice(Math.floor(Math.random() * feed.length), 1)
      setVisibleFeed([...visibleFeed, thisFeed[0]])
    } else {
      if (page <= totalPage && page > 0) {
        setPage(page - 1)
      } else {
        setPage(totalPage)
      }
    }
  }

  useEffect(() => {
    getRssCount()
  }, [])

  useEffect(() => {
    if (rssCount > 0) {
      setPage(totalPage)
    }
  }, [rssCount])

  useEffect(() => {
    parseRss()
  }, [page])

  useEffect(() => {
    if (visibleFeed.length > 10) {
      let newVisibleFeed = visibleFeed.slice(1, 10)
      setVisibleFeed(newVisibleFeed)
    }
  }, [visibleFeed])

  const delays = [500, 1000, 1500, 2000, 2500, 3000]
  useInterval(() => {
    updateTable()
  }, delays[Math.floor(Math.random() * Math.floor(5))])

  return (
    <ResponsiveWrapper>
      <Table striped hover variant="dark" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th
              style={{
                position: "sticky",
                top: 0,
              }}
            >
              Title
            </th>
            <th
              style={{
                position: "sticky",
                top: 0,
              }}
            >
              Content
            </th>
            <th
              style={{
                position: "sticky",
                top: 0,
              }}
            >
              URL
            </th>
            {/* <th>Author</th> */}
          </tr>
        </thead>
        <tbody>
          {visibleFeed.length > 0 &&
            visibleFeed.map((item, index) => (
              <tr key={item + index}>
                <ResponsiveTd>{item.title ?? ""}</ResponsiveTd>
                <ResponsiveTd className="green">
                  {decodeString(item.content_snippet ?? "...")}
                </ResponsiveTd>
                <ResponsiveSmallTd>
                  <a href={item.link}>
                    {item.link?.length ?? 0 > 35 ? item.link.substring(0, 35) + "..." : item.link}
                  </a>
                </ResponsiveSmallTd>
                {/* <ResponsiveTd>{item.creator}</ResponsiveTd> */}
              </tr>
            ))}
        </tbody>
      </Table>
    </ResponsiveWrapper>
  )
}

export default SentimentAnalysis
