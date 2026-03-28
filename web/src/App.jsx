import { motion } from 'framer-motion'
import { Terminal, Shield, Zap, Key, Users, Lock, ChevronRight, ExternalLink, MessageSquare } from 'lucide-react'
import './App.css'

const commands = [
  { name: '!prem-gen', args: '{user} {robloxuser}', desc: 'Assign premium status to a specific user and link their Roblox account.', icon: <Zap size={20} /> },
  { name: '!gen-key', args: '{user} {robloxuser}', desc: 'Generate a unique whitelist key for a user and their Roblox identity.', icon: <Key size={20} /> },
  { name: '!reset_hwid', args: '', desc: 'Reset a user\'s Hardware ID to allow login from a new device.', icon: <Shield size={20} /> },
  { name: '!blacklists', args: '{user}', desc: 'Check if a user is currently blacklisted from the system.', icon: <Lock size={20} /> },
  { name: '!ban', args: '{user} {reason}', desc: 'Permanently ban a user from the Discord server.', icon: <Terminal size={20} /> },
  { name: '!kick', args: '{user} {reason}', desc: 'Kick a user from the server for violating rules.', icon: <Users size={20} /> },
  { name: '!mute', args: '{user} {duration} {reason}', desc: 'Temporarily mute a user to prevent them from speaking.', icon: <Lock size={20} /> },
  { name: '!role', args: '{user} {role}', desc: 'Manage server roles for specific users efficiently.', icon: <Shield size={20} /> },
]

function App() {

  return (
    <div className="app-container">
      <header>
        <div className="logo">LUMINIA<br/><span style={{ fontSize: '0.6rem', letterSpacing: '0.2em' }}>ENGINEERED</span></div>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/key">Key</a></li>
            <li><a href="#commands">Scripts</a></li>
            <li><a href="#features">Profiles</a></li>
          </ul>
        </nav>
        <a href="#login" className="btn-login">Login</a>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero" id="hero">
          <div className="hero-bg-glow"></div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="badge"
          >
            <Zap size={12} style={{ marginRight: '8px' }} /> V1 NOW LIVE & UNDETECTED
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Dominance<br />Engineered<span>.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The ultimate utility for Roblox communities. Managing licenses, whitelists, 
            and server health with unparalleled speed and precision.
          </motion.p>
          <motion.div 
            className="hero-btns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a href="/key" className="btn-cta primary">
              Get Key <ChevronRight size={18} />
            </a>
            <button className="btn-cta outline"><Terminal size={18} /> Scripts</button>
            <button className="btn-cta outline"><MessageSquare size={18} /> Discord</button>
            <button className="btn-cta outline"><Zap size={18} /> Loader</button>
          </motion.div>
        </section>

        {/* Command Grid Section */}
        <section className="section" id="commands">
          <span className="section-label">Capabilities</span>
          <h2 className="section-title">Command Central</h2>
          <div className="grid-cards">
            {commands.map((cmd, index) => (
              <motion.div 
                key={cmd.name}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="card-icon">{cmd.icon}</div>
                <h3>{cmd.name}</h3>
                <p style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  {cmd.args}
                </p>
                <p>{cmd.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="section" id="features">
          <span className="section-label">Security</span>
          <h2 className="section-title">Advanced Protection</h2>
          <div className="grid-cards">
            <div className="card">
              <div className="card-icon"><Shield size={24} /></div>
              <h3>Automated Blacklist</h3>
              <p>Instant screening for malicious users before they even join your server.</p>
            </div>
            <div className="card">
              <div className="card-icon"><Lock size={24} /></div>
              <h3>HWID Binding</h3>
              <p>State-of-the-art protection preventing license sharing and unauthorized access.</p>
            </div>
            <div className="card">
              <div className="card-icon"><Zap size={24} /></div>
              <h3>Ultra-Low Latency</h3>
              <p>Built for speed, meaning commands execute in milliseconds, not seconds.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div>© 2026 Luminia Systems. All rights reserved.</div>
        <div className="footer-links">
          <a href="#"><ExternalLink size={18} /></a>
          <a href="#"><MessageSquare size={18} /></a>
        </div>
      </footer>
    </div>
  )
}

export default App
