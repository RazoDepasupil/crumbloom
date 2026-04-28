import React from 'react';
import HeroSection from '../components/HeroSection/HeroSection';
import CookieCard from '../components/CookieCard/CookieCard';

import { useCart } from '../context/CartContext';
import styles from './Home.module.css';
import Footer from '../components/Footer/Footer';

const VALUES = [
  { icon: '🧈', title: 'Real Butter Only', desc: 'European-style cultured butter in every single batch — we never cut corners.' },
  { icon: '🌸', title: 'Baked Fresh Daily', desc: 'Small batches each morning so you always get the softest, freshest cookie possible.' },
  { icon: '🎀', title: 'Gift-Ready', desc: 'Beautiful boxes for birthdays, celebrations, or just because someone deserves a treat.' },
];

const MARQUEE_ITEMS = [
  '✦ Free delivery on orders over $30',
  '✦ Baked fresh every morning',
  '✦ Gift boxes available',
  '✦ Made with real butter always',
  '✦ Order by noon for same-day pickup',
  '✦ Free delivery on orders over $30',
  '✦ Baked fresh every morning',
  '✦ Gift boxes available',
  '✦ Made with real butter always',
  '✦ Order by noon for same-day pickup',
];

const Home: React.FC = () => {
  const { addItem } = useCart();

  return (
    <main>
      <HeroSection />

      {/* Marquee strip */}
      <div className={styles.strip}>
        <div className={styles.marquee}>
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i}>{item} &nbsp;&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>



      {/* Values section */}
      <section id="story" className={`${styles.section} ${styles.valuesSection}`}>
        <p className={styles.sectionLabel}>Why We're Different</p>
        <h2 className={styles.sectionTitle}>Made with <em>Intention</em></h2>
        <div className={styles.valuesGrid}>
          {VALUES.map(v => (
            <div key={v.title} className={styles.valueCard}>
              <span className={styles.valueIcon}>{v.icon}</span>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Home;