import Footer from '../components/Footer/Footer';
import React from 'react';
import styles from './Story.module.css';

const MILESTONES = [
  { year: '2018', title: 'The First Batch', desc: 'Maxene baked her first box of cookies for a friend\'s birthday. They were gone in minutes — and the requests started pouring in.' },
  { year: '2020', title: 'Baking Through the Pandemic', desc: 'With the world slowing down, Crumb & Bloom was born from a home kitchen. Word spread fast through Legazpi City.' },
  { year: '2022', title: 'The Pink Box Debut', desc: 'We launched our signature gift boxes — tied with ribbon, packed with love — and sold out within the first weekend.' },
  { year: '2024', title: 'Growing the Garden', desc: 'New seasonal flavors, a loyal community of cookie lovers, and a dream to open our first storefront.' },
  { year: '2026', title: 'Here & Now', desc: 'Every cookie is still hand-rolled, hand-packed, and made with the same love as that very first batch.' },
];

const VALUES = [
  { icon: '🧈', title: 'Real Butter Only', desc: 'European-style cultured butter in every single batch. We never cut corners on quality.' },
  { icon: '🌸', title: 'Baked Fresh Daily', desc: 'Small batches every morning so you always get the softest, freshest cookie possible.' },
  { icon: '💕', title: 'Made with Intention', desc: 'Every recipe is tested dozens of times before it earns a spot in our menu.' },
  { icon: '🎀', title: 'Packaged with Love', desc: 'From the ribbon to the note card — every detail is chosen to make someone feel special.' },
];

const Story: React.FC = () => {
  return (
    <main className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Our Story</p>
          <h1 className={styles.heroTitle}>
            Baked from the <em>Heart</em>,<br />Shared with Love 🌸
          </h1>
          <p className={styles.heroSub}>
            Crumb & Bloom started in a small kitchen in Legazpi City — a dream,
            a whisk, and an endless love for butter. Here's how it all began.
          </p>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">🍪</div>
      </section>

      {/* Founder section */}
      <section className={styles.founderSection}>
        <div className={styles.inner}>
          <div className={styles.founderCard}>
            <div className={styles.founderAvatar}>👩‍🍳</div>
            <div className={styles.founderInfo}>
              <p className={styles.sectionLabel}>The Baker Behind It All</p>
              <h2 className={styles.founderName}>Maxene Roux Macasinag</h2>
              <p className={styles.founderBio}>
                Hi, I'm Maxene — a self-taught baker from Brgy. 42 Rawis, Legazpi.
                I've always believed that food is the most honest form of love.
                Every cookie I make carries a little piece of that belief —
                rolled by hand, baked with care, and sent out into the world
                hoping it makes someone's day a little sweeter.
              </p>
              <p className={styles.founderBio}>
                What started as weekend baking for friends has grown into something
                I never imagined — but I still approach every batch the same way
                I did on day one: with good butter, good music, and a whole lot of heart.
              </p>
              <div className={styles.founderContact}>
                <span>📍 Brgy. 42 Rawis, Legazpi</span>
                <span>✉️ maxenerouxmacasinag@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.timelineSection}>
        <div className={styles.inner}>
          <p className={styles.sectionLabel}>How We Got Here</p>
          <h2 className={styles.sectionTitle}>Our <em>Journey</em></h2>
          <div className={styles.timeline}>
            {MILESTONES.map((m, i) => (
              <div key={m.year} className={`${styles.timelineItem} ${i % 2 === 0 ? styles.left : styles.right}`}>
                <div className={styles.timelineCard}>
                  <span className={styles.timelineYear}>{m.year}</span>
                  <h3 className={styles.timelineTitle}>{m.title}</h3>
                  <p className={styles.timelineDesc}>{m.desc}</p>
                </div>
                <div className={styles.timelineDot} />
              </div>
            ))}
            <div className={styles.timelineLine} />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.inner}>
          <p className={styles.sectionLabel}>What We Stand For</p>
          <h2 className={styles.sectionTitle}>Our <em>Values</em></h2>
          <div className={styles.valuesGrid}>
            {VALUES.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <span className={styles.ctaEmoji}>🍪</span>
          <h2 className={styles.ctaTitle}>Ready to Try a <em>Cookie?</em></h2>
          <p className={styles.ctaDesc}>Every batch tells a story. Come find your favourite.</p>
          <a href="/menu" className={styles.ctaBtn}>Browse the Menu →</a>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Story;