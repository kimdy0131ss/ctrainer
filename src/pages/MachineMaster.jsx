import styles from './MachineMaster.module.css'

export default function MachineMaster() {
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
          Machine<br />
          <span className={styles.titleGrad}>Master</span>
        </h1>

        <p className={styles.subtitle}>
          코드를 실행하는 것이 아니라<br />
          <strong>기계를 설계하고 조작하는 경험</strong>
        </p>

        {/* 기계 미리보기 (정적) */}
        <div className={styles.mockup}>
          {/* 좌: 코드 */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.dots}>
                <span style={{background:'#f87171'}}/>
                <span style={{background:'#fbbf24'}}/>
                <span style={{background:'#34d399'}}/>
              </div>
              <span className={styles.panelTitle}>main.c — Blueprint</span>
            </div>
            <div className={styles.code}>
              {[
                { n:1, t:'int main() {' },
                { n:2, t:'  int x = 42;',          tag:'var', active: true },
                { n:3, t:'  int *ptr = &x;',        tag:'ptr' },
                { n:4, t:'  int arr[] = {1,3,5};',  tag:'arr' },
                { n:5, t:'  *ptr += arr[2];',        tag:'op' },
                { n:6, t:'  return 0;' },
                { n:7, t:'}' },
              ].map(l => (
                <div key={l.n} className={`${styles.codeLine} ${l.active ? styles.codeActive : ''}`}>
                  <span className={styles.lineNum}>{l.n}</span>
                  <span className={`${styles.lineText} ${l.tag ? styles[l.tag] : ''}`}>{l.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 중앙: 기계 */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Machine Core</span>
            </div>
            <div className={styles.core}>
              {/* 메모리 박스 */}
              <div className={styles.coreRow}>
                <div className={`${styles.memBox} ${styles.memLit}`}>
                  <span className={styles.memType}>int</span>
                  <span className={styles.memVal}>42</span>
                  <span className={styles.memName}>x</span>
                </div>
                <div className={styles.wire}>
                  <div className={styles.wireLine} />
                  <span className={styles.wireArr}>▶</span>
                </div>
                <div className={styles.memBox}>
                  <span className={styles.memType}>ptr</span>
                  <span className={styles.memVal}>0x2a</span>
                  <span className={styles.memName}>ptr</span>
                </div>
              </div>

              {/* 컨베이어 */}
              <div className={styles.conveyor}>
                <span className={styles.convLabel}>arr[]</span>
                <div className={styles.convTrack}>
                  {[1,3,5].map((v,i) => (
                    <div key={i} className={styles.convCell}>
                      <span className={styles.convIdx}>[{i}]</span>
                      <span className={styles.convVal}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 기어 */}
              <div className={styles.gears}>
                <div className={`${styles.gear} ${styles.gearL}`} />
                <div className={`${styles.gear} ${styles.gearS}`} />
              </div>
            </div>
          </div>

          {/* 우: 대시보드 */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Dashboard</span>
            </div>
            <div className={styles.dash}>
              {[
                { label:'메모리',    used:56,  total:128, unit:'B',  color:'#2dd4bf' },
                { label:'연산 횟수', used:1,   total:10,  unit:'회', color:'#a78bfa' },
                { label:'변수 슬롯', used:3,   total:8,   unit:'개', color:'#fbbf24' },
              ].map(r => (
                <div key={r.label} className={styles.resource}>
                  <div className={styles.resTop}>
                    <span className={styles.resLabel}>{r.label}</span>
                    <span className={styles.resVal} style={{color: r.color}}>
                      {r.used}<span className={styles.resUnit}>/{r.total}{r.unit}</span>
                    </span>
                  </div>
                  <div className={styles.resBar}>
                    <div className={styles.resFill}
                      style={{width:`${(r.used/r.total)*100}%`, background: r.color}} />
                  </div>
                </div>
              ))}
              <div className={styles.score}>
                <span className={styles.scoreLabel}>설계 점수</span>
                <span className={styles.scoreVal}>712</span>
              </div>
            </div>
          </div>
        </div>

        {/* 실행 컨트롤 바 (정적) */}
        <div className={styles.controls}>
          <button className={styles.ctrl}>◀◀ 되감기</button>
          <button className={`${styles.ctrl} ${styles.ctrlMain}`}>▶ 실행</button>
          <button className={styles.ctrl}>한 줄 실행 ▶</button>
        </div>

        {/* 3대 시스템 */}
        <div className={styles.systems}>
          {[
            { icon:'⬡', color:'#2dd4bf', title:'Visual Logic Engine',
              desc:'변수는 상자, 포인터는 전선, 배열은 컨베이어 벨트.' },
            { icon:'◷', color:'#a78bfa', title:'Time-Travel Execution',
              desc:'실행을 되감고, 멈추고, 한 줄씩 추적.' },
            { icon:'◈', color:'#fbbf24', title:'Resource-Constrained Design',
              desc:'변수·연산·메모리 제한 — 코딩이 최적화 문제가 된다.' },
          ].map(s => (
            <div key={s.title} className={styles.sysCard}>
              <span className={styles.sysIcon} style={{color:s.color, background:s.color+'18'}}>{s.icon}</span>
              <h3 className={styles.sysTitle} style={{color:s.color}}>{s.title}</h3>
              <p className={styles.sysDesc}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* 한 줄 정의 */}
        <div className={styles.manifest}>
          <p>"코드는 결과가 아니라 <em>설계의 부산물</em>이다."</p>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <button className={styles.ctaPrimary}>기계 설계 시작하기</button>
          <button className={styles.ctaGhost}>커리큘럼 보기</button>
        </div>
      </div>
    </div>
  )
}
