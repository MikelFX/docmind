'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 10,
    price: 99,
    pricePerDoc: '9,90',
    description: 'Ideální pro vyzkoušení',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 50,
    price: 349,
    pricePerDoc: '6,98',
    description: 'Nejoblíbenější volba',
    highlight: true,
  },
  {
    id: 'team',
    name: 'Team',
    credits: 200,
    price: 999,
    pricePerDoc: '4,99',
    description: 'Pro firmy a týmy',
    highlight: false,
  },
]

export default function KoupitPage() {
  const [selected, setSelected] = useState('pro')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleBuy() {
    setLoading(true)
    // Tady přijde Stripe — zatím simulace
    setTimeout(() => {
      alert('Stripe platba bude brzy k dispozici!')
      setLoading(false)
    }, 800)
  }

  const plan = PLANS.find(p => p.id === selected)!

  return (
    <div className={styles.wrap}>
      {/* NAV */}
      <nav className={styles.nav}>
        <button className={styles.back} onClick={() => router.push('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Zpět
        </button>
        <div className={styles.logo}>
          <div className={styles.logoDot} />
          docmind
        </div>
        <div style={{ width: 80 }} />
      </nav>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Koupit kredity</h1>
          <p className={styles.sub}>Každý kredit = jedna analýza dokumentu. Kredity nevyprší.</p>
        </div>

        {/* PLANS */}
        <div className={styles.plans}>
          {PLANS.map(plan => (
            <button
              key={plan.id}
              className={`${styles.plan} ${selected === plan.id ? styles.planActive : ''} ${plan.highlight ? styles.planHighlight : ''}`}
              onClick={() => setSelected(plan.id)}
            >
              {plan.highlight && (
                <div className={styles.badge}>Nejoblíbenější</div>
              )}
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planPrice}>
                <span className={styles.planAmount}>{plan.price} Kč</span>
              </div>
              <div className={styles.planCredits}>{plan.credits} kreditů</div>
              <div className={styles.planPer}>{plan.pricePerDoc} Kč / dokument</div>
              <div className={styles.planDesc}>{plan.description}</div>
            </button>
          ))}
        </div>

        {/* SUMMARY */}
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Balíček</span>
            <span className={styles.summaryVal}>{plan.name} — {plan.credits} kreditů</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Cena za dokument</span>
            <span className={styles.summaryVal}>{plan.pricePerDoc} Kč</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryRow}>
            <span className={styles.summaryTotal}>Celkem</span>
            <span className={styles.summaryTotalVal}>{plan.price} Kč</span>
          </div>

          <button
            className={styles.buyBtn}
            onClick={handleBuy}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.dots}>
                <span /><span /><span />
              </span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Zaplatit {plan.price} Kč
              </>
            )}
          </button>

          <p className={styles.legal}>
            Bezpečná platba přes Stripe. Kredity jsou připsány okamžitě po zaplacení.
          </p>
        </div>

        {/* FAQ */}
        <div className={styles.faq}>
          <div className={styles.faqItem}>
            <div className={styles.faqQ}>Vyprší kredity?</div>
            <div className={styles.faqA}>Ne, kredity jsou trvalé a nevyprší.</div>
          </div>
          <div className={styles.faqItem}>
            <div className={styles.faqQ}>Jaké dokumenty podporuje DocMind?</div>
            <div className={styles.faqA}>PDF, Word (.docx) a textové soubory (.txt). Podpora dalších formátů brzy.</div>
          </div>
          <div className={styles.faqItem}>
            <div className={styles.faqQ}>Jsou moje dokumenty v bezpečí?</div>
            <div className={styles.faqA}>Dokumenty se zpracují a nejsou nikde ukládány. Analýza probíhá na serveru.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
