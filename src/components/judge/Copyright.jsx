import { Link } from 'react-router-dom'
import styles from './Copyright.module.css'

export default function Copyright() {
  return (
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>© 2026 CTruct. 코더까진 아니어도 코더를 위해 만든 플랫폼<br />email : kimdy0131ss@gmail.com</p>
        </div>
      </footer>
  )
}