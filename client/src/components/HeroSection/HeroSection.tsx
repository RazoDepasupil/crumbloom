import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.content}>
        <div className={styles.eyebrow}>Handcrafted with love</div>
        <h1 className={styles.title}>
          Baked to<br />
          <em>Make You</em><br />
          Blush.
        </h1>
        <p className={styles.subtitle}>
          Artisan cookies made fresh daily — from the most romantic flavors
          to timeless classics. Every bite is a little luxury.
        </p>
      </div>

      <div className={styles.visual} aria-hidden="true">🍪</div>
    </section>
  );
};

export default HeroSection;
