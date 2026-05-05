'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Analyzer.module.css'

type Mode = 'summary' | 'actions' | 'risks' | 'qa'

const MODES: { id: Mode; label: string; icon: string }[] = [
  { id: 'summary', label: 'Shrnutí', icon: '📋' },
  { id: 'actions', label: 'Akční body', icon: '✅' },
  { id: 'risks', label: 'Rizika', icon: '⚠️' },
  { id: 'qa', label: 'Otázky & odpovědi', icon: '💬' },
]

const DEMO_TEXT = `DocMind Demo: Toto je ukázkový analytický dokument.
Projekt: Implementace CRM systému Q3 2025.
Zodpovědná osoba: Jana Nováková (PM), deadline 15.9.2025.
Úkoly: dokončit API integraci, otestovat import dat, školení týmu.
Rizika: závislost na externím dodavateli, možné zpoždění o 2-3 týdny.
Rozpočet: 450 000 Kč, aktuálně proinvestováno 280 000 Kč.
Závěr: projekt je v plánu, nutné sledovat rizika dodavatele.`

export default function Analyzer() {
  const [mode, setMode] = useState<Mode>('summary')
  const [fileContent, setFileContent] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [credits, setCredits] = useState(3)
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [qLoading, setQLoading] = useState(false)
  const [answers, setAnswers] = useState<{ q: string; a: string }[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    setFileName(file.name)
    const kb = Math.round(file.size / 1024)
    setFileSize(kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB')
    const reader = new FileReader()
    reader.onload = (e) => setFileContent(e.target?.result as string)
    reader.readAsText(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function analyze() {
    if (credits <= 0) {
      alert('Nemáš kredity. Kupte balíček.')
      return
    }
    setCredits((c) => c - 1)
    setLoading(true)
    setResult('')
    setAnswers([])

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fileContent || DEMO_TEXT, mode }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.result)
    } catch (err) {
      setResult('<p style="color:#F09595">Chyba při analýze. Zkus znovu.</p>')
      setCredits((c) => c + 1)
    } finally {
      setLoading(false)
    }
  }

  async function askQuestion() {
    if (!question.trim() || !result) return
    const q = question.trim()
    setQuestion('')
    setQLoading(true)
    setAnswers((prev) => [...prev, { q, a: '...' }])

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fileContent || DEMO_TEXT, question: q }),
      })
      const data = await res.json()
      setAnswers((prev) =>
        prev.map((item, i) =>
          i === prev.length - 1 ? { ...item, a: data.result || 'Žádná odpověď.' } : item
        )
      )
    } catch {
      setAnswers((prev) =>
        prev.map((item, i) =>
          i === prev.length - 1 ? { ...item, a: 'Chyba odpovědi.' } : item
        )
      )
    } finally {
      setQLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <div className={styles.logoDot} />
          docmind
        </div>
        <div className={styles.navRight}>
          <div className={styles.credits}>
            <span className={styles.creditsN}>{credits}</span> kredity
          </div>
          <button className={styles.buyBtn} onClick={() => router.push('/koupit')}>Koupit kredity</button>
        </div>
      </nav>

      {/* MAIN */}
      <div className={styles.main}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLabel}>Režim analýzy</div>
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`${styles.modeBtn} ${mode === m.id ? styles.modeBtnActive : ''}`}
              onClick={() => setMode(m.id)}
            >
              <span className={styles.modeIcon}>{m.icon}</span>
              {m.label}
            </button>
          ))}
          <div className={styles.sidebarLabel} style={{ marginTop: 24 }}>Nedávné</div>
          <div className={styles.recentEmpty}>žádné dokumenty</div>
        </aside>

        {/* CONTENT */}
        <div className={styles.content}>
          {/* UPLOAD */}
          <div
            className={`${styles.upload} ${dragging ? styles.uploadDrag : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDrop={onDrop}
            onDragLeave={() => setDragging(false)}
          >
            <div className={styles.uploadIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="1.5" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div className={styles.uploadTitle}>Přetáhni nebo klikni pro nahrání</div>
            <div className={styles.uploadSub}>PDF · Word · TXT &nbsp;·&nbsp; max 10 MB</div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          {/* FILE BAR */}
          {fileName && (
            <div className={styles.fileBar}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span className={styles.fileName}>{fileName}</span>
              <span className={styles.fileSize}>{fileSize}</span>
              <button className={styles.fileRemove} onClick={() => { setFileName(''); setFileContent('') }}>×</button>
            </div>
          )}

          {/* ANALYZE BUTTON */}
          <button className={styles.analyzeBtn} onClick={analyze} disabled={loading}>
            {loading ? (
              <span className={styles.loadingDots}>
                <span /><span /><span />
              </span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Analyzovat dokument
              </>
            )}
          </button>

          {/* RESULT */}
          {(result || loading) && (
            <div className={styles.resultBox}>
              <div className={styles.resultHeader}>
                <span className={styles.resultLabel}>{MODES.find(m => m.id === mode)?.label}</span>
                <span className={styles.resultMeta}>{fileName || 'demo text'}</span>
              </div>
              <div className={styles.resultBody}>
                {loading ? (
                  <div className={styles.loadingRow}>
                    <div className={styles.dot} /><div className={styles.dot} /><div className={styles.dot} />
                    <span>Analyzuji dokument...</span>
                  </div>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: result }} />
                )}

                {/* Follow-up odpovědi */}
                {answers.map((a, i) => (
                  <div key={i} className={styles.answerCard}>
                    <p className={styles.answerQ}>{a.q}</p>
                    <p className={styles.answerA}>{a.a}</p>
                  </div>
                ))}
              </div>

              {/* QUESTION BAR */}
              {result && !loading && (
                <div className={styles.questionBar}>
                  <input
                    className={styles.questionInput}
                    placeholder="Zeptej se na cokoliv v dokumentu..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
                  />
                  <button className={styles.questionBtn} onClick={askQuestion} disabled={qLoading}>
                    {qLoading ? '...' : 'Zeptat se →'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
