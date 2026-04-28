import Footer from '../components/Footer/Footer';
import React, { useState } from 'react';
import styles from './Gifting.module.css';

const GIFT_BOXES = [
  {
    id: 1,
    name: 'The Mini Blush',
    emoji: '🎀',
    count: 4,
    price: 18,
    desc: 'A sweet little box of 4 handpicked cookies — perfect for a small gesture of love.',
    includes: ['4 assorted cookies', 'Pink ribbon wrap', 'Handwritten note card'],
    bgColor: '#fce4ec',
    tag: 'Most Popular',
  },
  {
    id: 2,
    name: 'The Bloom Box',
    emoji: '🌸',
    count: 9,
    price: 36,
    desc: 'Nine cookies nestled in a keepsake pink box — ideal for birthdays and celebrations.',
    includes: ['9 assorted cookies', 'Floral tissue paper', 'Ribbon & bow', 'Gift message'],
    bgColor: '#f8bbd0',
    tag: 'Bestseller',
  },
  {
    id: 3,
    name: 'The Grand Petal',
    emoji: '🌹',
    count: 16,
    price: 60,
    desc: 'Our most luxurious box — a full collection of all seasonal flavors, beautifully arranged.',
    includes: ['16 assorted cookies', 'Luxury keepsake box', 'Satin ribbon', 'Personalized card', 'Free delivery'],
    bgColor: '#f48fb1',
    tag: 'Luxury',
  },
];

const OCCASIONS = [
  { icon: '🎂', label: 'Birthdays' },
  { icon: '💍', label: 'Engagements' },
  { icon: '🥂', label: 'Celebrations' },
  { icon: '💝', label: "Valentine's" },
  { icon: '🎓', label: 'Graduation' },
  { icon: '🏠', label: 'Housewarming' },
  { icon: '👶', label: 'Baby Shower' },
  { icon: '💼', label: 'Corporate' },
];

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  'Most Popular': { bg: '#e91e63', color: '#fff' },
  Bestseller:     { bg: '#c2185b', color: '#fff' },
  Luxury:         { bg: '#880e4f', color: '#fff' },
};

const Gifting: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [ordered, setOrdered] = useState(false);

  const handleOrder = (id: number) => {
    setSelected(id);
    setOrdered(true);
    setTimeout(() => { setOrdered(false); setSelected(null); }, 3500);
  };

  return (
    <main className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Gift Someone Sweet</p>
          <h1 className={styles.heroTitle}>
            Give the Gift of <em>Pure Joy</em> 🎀
          </h1>
          <p className={styles.heroSub}>
            Beautifully curated cookie gift boxes for every occasion — each one
            packed with love, tied with a ribbon, and ready to make someone's day.
          </p>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">🎁</div>
      </section>

      {/* Occasions */}
      <section className={styles.occasionsSection}>
        <div className={styles.inner}>
          <p className={styles.sectionLabel}>Perfect For</p>
          <h2 className={styles.sectionTitle}>Every <em>Occasion</em></h2>
          <div className={styles.occasionsGrid}>
            {OCCASIONS.map(o => (
              <div key={o.label} className={styles.occasionChip}>
                <span className={styles.occasionIcon}>{o.icon}</span>
                <span className={styles.occasionLabel}>{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift boxes */}
      <section className={styles.boxesSection}>
        <div className={styles.inner}>
          <p className={styles.sectionLabel}>Our Gift Boxes</p>
          <h2 className={styles.sectionTitle}>Choose Your <em>Box</em></h2>
          <div className={styles.boxesGrid}>
            {GIFT_BOXES.map(box => {
              const tagStyle = TAG_STYLES[box.tag];
              return (
                <article key={box.id} className={styles.boxCard}>
                  <div className={styles.boxTop} style={{ background: box.bgColor }}>
                    <span className={styles.boxEmoji}>{box.emoji}</span>
                    <span className={styles.boxTag} style={{ background: tagStyle.bg, color: tagStyle.color }}>
                      {box.tag}
                    </span>
                    <span className={styles.cookieCount}>{box.count} cookies</span>
                  </div>
                  <div className={styles.boxBody}>
                    <h3 className={styles.boxName}>{box.name}</h3>
                    <p className={styles.boxDesc}>{box.desc}</p>
                    <ul className={styles.includesList}>
                      {box.includes.map(item => (
                        <li key={item} className={styles.includesItem}>
                          <span className={styles.check}>✦</span> {item}
                        </li>
                      ))}
                    </ul>
                    <div className={styles.boxFooter}>
                      <span className={styles.boxPrice}>${box.price}.00</span>
                      <button
                        className={`${styles.orderBtn} ${selected === box.id && ordered ? styles.ordered : ''}`}
                        onClick={() => handleOrder(box.id)}
                        disabled={ordered}
                      >
                        {selected === box.id && ordered ? '✓ Added!' : 'Order Box →'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom orders */}
      <section className={styles.customSection}>
        <div className={styles.customInner}>
          <span className={styles.customEmoji}>✨</span>
          <h2 className={styles.customTitle}>Need Something <em>Custom?</em></h2>
          <p className={styles.customDesc}>
            Corporate orders, large events, or a very special someone? We'll build
            a bespoke gift box just for you — flavors, size, and packaging included.
          </p>
          <a href="/contact" className={styles.customBtn}>
            Talk to Us →
          </a>
        </div>
      </section>

      {/* Toast */}
      {ordered && (
        <div className={styles.toast}>
          🎀 Gift box added! We'll be in touch to confirm your order.
        </div>
      )}
      <Footer />
    </main>
  );
};

export default Gifting;