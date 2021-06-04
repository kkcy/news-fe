import SentimentAnalysis from "./sentiment_analysis"
import TechnicalAnalysis from "./technical_analysis"

function App() {
  return (
    <>
      <section>
        <h1>Technical Analysis</h1>
        <TechnicalAnalysis />
      </section>

      <section>
        <h1>Sentiment Analysis</h1>
        <SentimentAnalysis />
      </section>
    </>
  )
}

export default App
