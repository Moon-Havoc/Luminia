import { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, Copy, Check, ArrowLeft, Zap, Shield } from 'lucide-react'

function KeyPage() {
  const [discordId, setDiscordId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleLookup = async () => {
    if (!discordId.trim()) return setError('Please enter your Discord ID.')
    setLoading(true)
    setError('')
    setResult(null)

    const apiUrl = import.meta.env.VITE_API_URL || window.location.origin
    const endpoint = `${apiUrl.replace(/\/$/, '')}/api/get-key/${discordId.trim()}`

    try {
      const res = await fetch(endpoint)
      if (!res.ok) {
        const serverMsg = await res.text()
        throw new Error(`Server responded ${res.status}: ${serverMsg}`)
      }
      const data = await res.json()
      if (data.success) {
        setResult(data)
      } else {
        setError(data.message || 'No key found.')
      }
    } catch (err) {
      console.error('Key lookup failed:', err)
      setError(`Could not reach the server at ${endpoint}. ${err.message}`)
    }

    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="app-container">
      <header>
        <div className="logo">LUMINIA<br /><span style={{ fontSize: '0.6rem', letterSpacing: '0.2em' }}>ENGINEERED</span></div>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/key" style={{ color: 'var(--accent-color)' }}>Key</a></li>
          </ul>
        </nav>
        <a href="/" className="btn-login" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={14} /> Back
        </a>
      </header>

      <main>
        <section className="hero" id="hero" style={{ gap: '1.5rem' }}>
          <div className="hero-bg-glow" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="badge"
          >
            <Key size={12} style={{ marginRight: '8px' }} /> KEY RETRIEVAL
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
          >
            Your Key<span>.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ marginBottom: '2rem' }}
          >
            Enter your Discord User ID to retrieve your Luminia whitelist key.
            <br />
            <span style={{ fontSize: '0.85rem', opacity: 0.5 }}>
              Find your ID: Discord → Settings → Advanced → Enable Developer Mode → Right-click your name → Copy User ID
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '500px' }}
          >
            <div style={{
              display: 'flex', gap: '0.75rem', width: '100%',
            }}>
              <input
                type="text"
                placeholder="Enter your Discord User ID..."
                value={discordId}
                onChange={e => setDiscordId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookup()}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  color: '#fff',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-main)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(147,51,234,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button
                className="btn-cta primary"
                onClick={handleLookup}
                disabled={loading}
                style={{ padding: '1rem 1.5rem', borderRadius: '12px', whiteSpace: 'nowrap' }}
              >
                {loading ? 'Looking up...' : 'Get Key'}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: '#f87171', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}
              >
                ❌ {error}
              </motion.p>
            )}
          </motion.div>

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(147,51,234,0.07)',
                border: '1px solid rgba(147,51,234,0.25)',
                borderRadius: '20px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                width: '100%',
                maxWidth: '500px',
              }}
            >
              {result.isPremium && (
                <div className="badge" style={{ margin: 0 }}>
                  <Zap size={12} style={{ marginRight: '6px' }} /> PREMIUM
                </div>
              )}

              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  Your Whitelist Key
                </p>
                <code style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: 'var(--accent-color)',
                  letterSpacing: '0.05em',
                  wordBreak: 'break-all',
                }}>
                  {result.key}
                </code>
              </div>

              <button
                onClick={handleCopy}
                className="btn-cta primary"
                style={{ gap: '0.5rem', padding: '0.85rem 2rem' }}
              >
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Key</>}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                <Shield size={14} />
                Keep your key private. Do not share it with anyone.
              </div>
            </motion.div>
          )}
        </section>
      </main>

      <footer>
        <div>© 2026 Luminia Systems. All rights reserved.</div>
      </footer>
    </div>
  )
}

export default KeyPage
