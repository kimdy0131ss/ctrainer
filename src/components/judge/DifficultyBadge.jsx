import styles from './DifficultyBadge.module.css'

const LABELS = { easy: '쉬움', medium: '보통', hard: '어려움' }

export default function DifficultyBadge({ difficulty }) {
  return (
    <span className={`${styles.badge} ${styles[difficulty]}`}>
      {LABELS[difficulty]}
    </span>
  )
}
