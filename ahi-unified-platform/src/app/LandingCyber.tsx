"use client";

import React, { useState } from 'react';
import styles from './LandingCyber.module.css';

type Mode = 'operational' | 'research';

const LandingCyber: React.FC = () => {
  const [mode, setMode] = useState<Mode>('operational');

  const wrapperClass = [
    styles.pageWrapper,
    mode === 'research' ? styles.researchMode : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass}>
      {/* Fondo de grilla */}
      <div className={styles.gridBg} />

      {/* ───── Header ───── */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.navInner}`}>
          <a href="/" className={styles.logo}>
            <div className={styles.logoIcon} />
            AHI GOVERNANCE
          </a>

          <nav className={styles.nav}>
            <a href="#solutions" className={styles.navLink}>
              Soluciones
            </a>
            <a href="#metrics" className={styles.navLink}>
              Métricas
            </a>
            <a href="#portal" className={styles.navLink}>
              Auditoría
            </a>

            {/* Toggle Operational / Research */}
            <div className={styles.bridgeToggle}>
              <button
                className={`${styles.bridgeBtn} ${
                  mode === 'operational' ? styles.bridgeBtnActive : ''
                }`}
                onClick={() => setMode('operational')}
              >
                Operational
              </button>
              <button
                className={`${styles.bridgeBtn} ${
                  mode === 'research' ? styles.bridgeBtnActive : ''
                }`}
                onClick={() => setMode('research')}
              >
                Research
              </button>
            </div>

            <a
              href="mailto:enterprise@ahigovernance.com"
              className={styles.btnPrimary}
            >
              Acceso Enterprise
            </a>
          </nav>
        </div>
      </header>

      {/* ───── Integrity Seal (flotante) ───── */}
      <div className={styles.integritySeal}>
        <div className={styles.sealIcon} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span className={styles.sealRegion}>REGION: US-CENTRAL1</span>
          <span className={styles.sealValue}>0.842 &bull; SIGNED</span>
        </div>
      </div>

      <main>
        {/* ───── Hero ───── */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.statusBadge}>
              <span className={styles.pulseDot} />{' '}
              SYSTEM STATUS: OMEGA_ACTIVE
            </div>

            <h1 className={styles.heroTitle}>
              La Verdad ya no es una Opinión.
              <br />
              Es una Invariante Geométrica.
            </h1>

            <p className={styles.heroText}>
              Proteja su soberanía informacional con el primer{' '}
              <strong>Sistema Inmune Matemático</strong> para Inteligencia
              Artificial. No vendemos predicciones, garantizamos{' '}
              <em>Certeza Estructural</em>.
            </p>

            <div className={styles.heroActions}>
              <a
                href="#portal"
                className={styles.btnPrimary}
                style={{ padding: '16px 32px' }}
              >
                Iniciar Auditoría
              </a>
              <a
                href="#solutions"
                className={styles.btnSecondary}
                style={{ padding: '16px 32px' }}
              >
                Ver Soluciones
              </a>
            </div>
          </div>
        </section>

        {/* ───── Soluciones (Cards) ───── */}
        <section id="solutions" className={styles.services}>
          <div className={styles.container}>
            <p className={styles.sectionTitle}>
              // SOLUCIONES DE CERTEZA ESTRUCTURAL
            </p>

            <div className={styles.grid3}>
              {/* Card 1 */}
              <div className={`${styles.card} ${styles.fadeIn}`}>
                <div className={styles.metricTag}>RICCI_FLOW : 0.0927</div>
                <h3 className={styles.cardTitle}>Auditoría de Certeza</h3>
                <p className={styles.cardText}>
                  Elimine la incertidumbre. Detectamos puntos de alucinación
                  midiendo la curvatura del espacio latente de su modelo.
                </p>
              </div>

              {/* Card 2 */}
              <div className={`${styles.card} ${styles.fadeIn}`}>
                <div className={styles.metricTag}>WEYL_RESONANCE : 0.7291</div>
                <h3 className={styles.cardTitle}>Escudo Omega</h3>
                <p className={styles.cardText}>
                  Certificación inmutable. Garantizamos que la información
                  conserva su masa lógica original sin degradación.
                </p>
              </div>

              {/* Card 3 */}
              <div className={`${styles.card} ${styles.fadeIn}`}>
                <div className={styles.metricTag}>RESILIENCE : 0.8546</div>
                <h3 className={styles.cardTitle}>Defensa Sintérgica</h3>
                <p className={styles.cardText}>
                  Inmunidad visual. Nuestro Nervio Óptico detecta e ignora
                  distorsiones profundas en tiempo real.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───── Métricas en vivo ───── */}
        <section id="metrics" className={styles.metricsSection}>
          <div className={styles.container}>
            <p className={styles.sectionTitle}>// TELEMETRÍA EN TIEMPO REAL</p>

            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>99.2%</div>
                <div className={styles.metricLabel}>Integridad Topológica</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>0.042</div>
                <div className={styles.metricLabel}>Curvatura de Ricci</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>10D</div>
                <div className={styles.metricLabel}>Consistencia Dimensional</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricValue}>∞</div>
                <div className={styles.metricLabel}>Resiliencia Omega</div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── Terminal (Portal de Auditoría) ───── */}
        <section id="portal" className={styles.terminalSection}>
          <div className={styles.container}>
            <p className={styles.sectionTitle}>// PORTAL DE AUDITORÍA</p>

            <div className={styles.terminalUi}>
              <div className={styles.termBar}>
                <div className={styles.dotTerm} style={{ background: '#ff5f56' }} />
                <div className={styles.dotTerm} style={{ background: '#ffbd2e' }} />
                <div className={styles.dotTerm} style={{ background: '#27c93f' }} />
                <span
                  style={{
                    marginLeft: 'auto',
                    color: '#555',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  /bin/audit_secure
                </span>
              </div>

              <div className={styles.termBody}>
                <p className={styles.termTitle}>INPUT_VECTOR_STREAM</p>
                <p>
                  Portal de auditoría en desarrollo.
                  <br />
                  Contacte <strong>enterprise@ahigovernance.com</strong> para
                  acceso anticipado.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ───── Footer ───── */}
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <span className={styles.footerText}>
            © {new Date().getFullYear()} AHI Governance Labs — Todos los
            derechos reservados
          </span>
          <div className={styles.footerLinks}>
            <a href="/governance/terms" className={styles.footerLink}>
              Términos
            </a>
            <a href="/governance/privacy" className={styles.footerLink}>
              Privacidad
            </a>
            <a
              href="mailto:enterprise@ahigovernance.com"
              className={styles.footerLink}
            >
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingCyber;
