import React, { useState } from "react";
import { Cookie } from "../../types";
import { TAG_STYLES } from "../../data/cookies";
import styles from "./CookieCard.module.css";

interface Props {
  cookie: Cookie;
  onAdd: (cookie: Cookie) => void;
}

const CookieCard: React.FC<Props> = ({ cookie, onAdd }) => {
   const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAdd(cookie);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
  };

  const tagStyle = cookie.tag ? TAG_STYLES[cookie.tag] : null;

  return (
    <article className={styles.card}>
      <div className={styles.top} style={{ background: cookie.bgColor }}>
        <span className={`${styles.emoji} ${justAdded ? styles.bounce : ""}`}>
          {cookie.emoji}
        </span>
        {cookie.tag && tagStyle && (
          <span
            className={styles.tag}
            style={{ background: tagStyle.bg, color: tagStyle.color }}
          >
            {cookie.tag}
          </span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{cookie.name}</h3>
        <p className={styles.desc}>{cookie.description}</p>

        <div className={styles.allergens}>
          {cookie.allergens.map((a) => (
            <span key={a} className={styles.allergenTag}>
              {a}
            </span>
          ))}
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>₱ {cookie.price.toFixed(2)}</span>
          <button
            className={`${styles.addBtn}  ${justAdded ? styles.added : ""}`}
            onClick={handleAdd}
            aria-label={`Add ${cookie.name} to cart`}
          >
            {justAdded ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default CookieCard;
