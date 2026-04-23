import styles from './Introduction.module.css'
import { Link, useLocation } from 'react-router-dom'

export default function Introduction() {
  return (
    <div className={styles.page}>
      {/* 배경 */}
      <div className={styles.bg}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
        <div className={styles.gridLines} />
        <div className={styles.grain} />
      </div>

      <div className={styles.wrap}>
        {/* 배지 */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          C 기반 로직 시각화 시뮬레이터
        </div>

        {/* 타이틀 */}
        <h1 className={styles.title}>
          유찬아<br />
          <span className={styles.titleGrad}>문제 좀 조사해줘</span>
        </h1>

        <p className={styles.subtitle}>
          단순히 코딩하는 것 뿐만 아니라<br />
          <strong>나만의 코드를 설계하고 조작하는 경험</strong>
        </p>


        {/* 3대 시스템 */}
        <div className={styles.systems}>
          {[
            {
              icon: '⬡', color: '#2dd4bf', title: 'Visual Logic Engine',
              desc: '변수는 상자, 포인터는 전선, 배열은 컨베이어 벨트.'
            },
            {
              icon: '◷', color: '#a78bfa', title: 'Time-Travel Execution',
              desc: (
                <>
                  더 구체적인 프로그램 <br />
                  — 보다 효율적인 메모리 관리
                </>
              )
            },
            {
              icon: '◈', color: '#fbbf24', title: 'Resource-Constrained Design',
              desc: (
                <>
                  알고리즘을 기초부터 활용까지 <br />
                  — 코드를 직접 설계한다
                </>
              )
            },
          ].map(s => (
            <div key={s.title} className={styles.sysCard}>
              <span className={styles.sysIcon} style={{ color: s.color, background: s.color + '18' }}>{s.icon}</span>
              <h3 className={styles.sysTitle} style={{ color: s.color }}>{s.title}</h3>
              <p className={styles.sysDesc}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* 한 줄 정의 */}
        <div className={styles.manifest}>
          <p>"아 오늘 저녁 <em>뭐먹지</em> 배고픈데."</p>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <button className={styles.ctaPrimary}>
            <Link to="/visualizer">
              알고리즘 둘러보기
            </Link>
          </button>
          <button className={styles.ctaGhost}>
            <Link to="/problems">
              문제 풀기
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}
