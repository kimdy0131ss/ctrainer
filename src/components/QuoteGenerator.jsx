import { useState } from 'react'

const QUOTES = [
  { text: '천 리 길도 한 걸음부터.', author: '한국 속담' },
  { text: '배움에는 끝이 없다.', author: '한국 속담' },
  { text: '실패는 성공의 어머니다.', author: '한국 속담' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
  { text: '하루하루를 인생의 마지막 날처럼 살아라.', author: 'Steve Jobs' },
  { text: '성공은 최선을 다한 것에 대한 보상이 아니라, 최선을 다하는 과정 자체이다.', author: '익명' },
]

export default function QuoteGenerator() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length))
  const [animating, setAnimating] = useState(false)
  const [copied, setCopied] = useState(false)

  function nextQuote() {
    setAnimating(true)
    setTimeout(() => {
      setIndex(i => {
        let next
        do { next = Math.floor(Math.random() * QUOTES.length) } while (next === i)
        return next
      })
      setAnimating(false)
    }, 300)
  }

  function copyQuote() {
    const q = QUOTES[index]
    navigator.clipboard.writeText(`"${q.text}" - ${q.author}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const quote = QUOTES[index]

  return (
    <div className="feature-card">
      <h2>오늘의 명언</h2>
      <div className={`quote-box ${animating ? 'fade-out' : 'fade-in'}`}>
        <p className="quote-text">"{quote.text}"</p>
        <p className="quote-author">— {quote.author}</p>
      </div>
      <div className="quote-btns">
        <button className="btn-primary" onClick={nextQuote}>다음 명언</button>
        <button className="btn-secondary" onClick={copyQuote}>
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
    </div>
  )
}
