import { useState, useEffect } from "react"
import useInterval from "@use-it/interval"
import Highlighter from "react-highlight-words"
import axios from "axios"
const cheerio = require("cheerio")

const baseUrl = process.env.REACT_APP_BASE_URL
const decodeString = (input) => {
  var txt = document.createElement("textarea")
  txt.innerHTML = input
  return txt.value
}
const Analyser = ({ rssFeed, source, rss = true, getMore }) => {
  const [feed, setFeed] = useState([])
  const [analysing, setAnalysing] = useState([])
  const [contents, setContents] = useState([])
  const [shouldHighlight, setShouldHighlight] = useState(false)
  const [highlights, setHighlights] = useState([])
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [sourceIndex, setSourceIndex] = useState(0)

  useEffect(() => {
    if (!rss) {
      parseLink()
    } else {
      setFeed(rssFeed)
    }
  }, [])

  useEffect(() => {
    updateFeed()
  }, [feed])

  useEffect(() => {
    updateContents()
  }, [analysing])

  useEffect(() => {
    setShouldHighlight(true)
  }, [contents])

  const parseLink = async () => {
    try {
      let objects, total
      try {
        console.log(`${baseUrl}/api/v1/rss?url=${source[sourceIndex]}`)
        let html = await axios(`${baseUrl}/api/v1/rss?url=${source[sourceIndex]}`)
        const $ = cheerio.load(html.data)
        objects = $(".tv-feed__item")
        console.log(objects)
        total = objects.length
      } catch (error) {
        console.log(error)
      }

      const items = []
      if (objects == null || total == null) {
        return
      }

      for (let i = 0; i < total; i++) {
        if (objects[i]?.attribs["data-widget-type"] == "idea") {
          let card = objects[i].attribs["data-card"]
          let jsonItem = JSON.parse(card)

          const $ = cheerio.load(objects[i])
          let desc = $(".tv-widget-idea__description-row")

          if (jsonItem?.data?.id != null) {
            items.push({
              title: jsonItem?.data?.name,
              image: `https://s3.tradingview.com/${jsonItem?.data?.image_url
                .toString()
                .substring(0, 1)
                .toLowerCase()}/${jsonItem?.data?.image_url}_mid.png`,
              author: jsonItem?.author?.username,
              content_snippet: desc?.length > 0 ? desc[0]?.firstChild?.data?.trim() : "-",
              link: jsonItem?.data?.published_url,
            })
          }
        }
      }

      console.log(items)
      setFeed(items)
    } catch (err) {
      console.log(err)
    }
  }

  const updateFeed = () => {
    if (feed?.length > 0) {
      let newAnalysing = []
      let thisFeed = feed.pop()
      newAnalysing.push(thisFeed)
      setAnalysing(newAnalysing)
    }
  }

  const updateContents = () => {
    if (analysing?.length > 0) {
      let content = analysing[0]
      let contents = decodeString(content.content_snippet).split(" ")
      setContents(contents)
    }
  }

  const updateHighlight = async () => {
    if (contents?.length > 0) {
      if (highlightIndex < contents?.length) {
        if (contents[highlightIndex]?.includes(".")) {
          setHighlights([...highlights, `${contents[highlightIndex]}`])
        } else {
          setHighlights([...highlights, `${contents[highlightIndex]} `])
        }

        setHighlightIndex(highlightIndex + 1)
      } else {
        setShouldHighlight(false)
        setHighlights([])
        setHighlightIndex(0)
        if (feed.length > 0) {
          updateFeed()
        } else {
          // on finish get more from parent
          let newFeeds = await getMore()
          setFeed(newFeeds)
        }
      }
    }
  }

  const delay = 500
  useInterval(
    () => {
      updateHighlight()
    },
    shouldHighlight ? delay : null
  )

  return (
    <>
      {analysing?.length > 0 ? (
        analysing.map((item, i) => (
          <div key={item.title}>
            <div className="head">
              <span className="headline hl3">{decodeString(item?.title)}</span>
              <p>
                {rss ? (
                  <a href={item?.link} className="headline hl4">
                    {item?.link?.length > 25 ? item?.link?.substring(0, 25) + "..." : item?.link}
                  </a>
                ) : (
                  <a href={item?.link} className="headline hl4">
                    {item?.author}
                  </a>
                )}
              </p>

              {!rss && (
                <div>
                  <img src={item?.image} alt="" style={{ marginBottom: 12 }} />
                </div>
              )}

              <Highlighter
                highlightClassName="highlight-news"
                searchWords={highlights}
                autoEscape={true}
                textToHighlight={`${decodeString(item?.content_snippet)}`}
              />
              {/* <a href={item.url} target="_blank" rel="noopener noreferrer">
                Read full news
              </a> */}
              <div style={{ height: 16 }} />
            </div>
          </div>
        ))
      ) : (
        <div
          style={{
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Loading up news sources...</p>
        </div>
      )}
    </>
  )
}

export default Analyser
