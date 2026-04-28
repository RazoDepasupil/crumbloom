import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer/Footer';
import styles from './Menu.module.css';

const BASE = 'http://localhost:5000/api';
const TAG_COLORS: Record<string,{bg:string;color:string}> = {
  Bestseller: { bg:'#e91e63', color:'#fff' },
  New:        { bg:'#f06292', color:'#fff' },
  'Fan Fave': { bg:'#ad1457', color:'#fff' },
  Limited:    { bg:'#880e4f', color:'#fff' },
  Sale:       { bg:'#ff5722', color:'#fff' },
};

const Menu: React.FC = () => {
  const { addItem } = useCart();
  const { user }    = useAuth();
  const [products, setProducts]   = useState<any[]>([]);
  const [favIds, setFavIds]       = useState<number[]>([]);
  const [added, setAdded]         = useState<number|null>(null);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('All');

  useEffect(() => {
    fetch(`${BASE}/products`).then(r=>r.json()).then(d=>{ setProducts(Array.isArray(d)?d:[]); setLoading(false); }).catch(()=>setLoading(false));
    if (user) {
      fetch(`${BASE}/favourites/ids`, { headers:{ Authorization:`Bearer ${localStorage.getItem('token')}` } })
        .then(r=>r.json()).then(d=>setFavIds(Array.isArray(d)?d:[])).catch(()=>{});
    }
  }, [user]);

  const categories = ['All', ...Array.from(new Set(products.map((p:any)=>p.category).filter(Boolean)))];
  const filtered = filter === 'All' ? products : products.filter(p=>p.category===filter);

  const handleAdd = (product: any) => {
    addItem({ id: product.id, name: product.name, description: product.description, price: Number(product.price), emoji:'🍪', bgColor:'#fce4ec', ingredients:[], allergens:[] });
    setAdded(product.id);
    setTimeout(()=>setAdded(null), 800);
  };

  const toggleFav = async (productId: number) => {
    if (!user) return;
    const token = localStorage.getItem('token');
    if (favIds.includes(productId)) {
      await fetch(`${BASE}/favourites/${productId}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
      setFavIds(prev=>prev.filter(id=>id!==productId));
    } else {
      await fetch(`${BASE}/favourites`, { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body:JSON.stringify({ product_id: productId }) });
      setFavIds(prev=>[...prev, productId]);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.blob1}/><div className={styles.blob2}/>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Fresh Daily</p>
          <h1 className={styles.heroTitle}>Our <em>Products</em> 🍪</h1>
          <p className={styles.heroSub}>Hand-crafted and baked fresh each morning. Pick your favourites.</p>
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.inner}>
          {/* Category filter */}
          {categories.length > 1 && (
            <div className={styles.filterRow}>
              {categories.map(c=>(
                <button key={c} className={`${styles.filterBtn} ${filter===c?styles.filterActive:''}`} onClick={()=>setFilter(c)}>{c}</button>
              ))}
            </div>
          )}

          <div className={styles.grid}>
            {loading ? (
              <p style={{fontFamily:'var(--font-body)',color:'#aaa',gridColumn:'1/-1',textAlign:'center',padding:60}}>Loading products...</p>
            ) : filtered.map((product:any) => {
              const tagStyle = product.tag ? TAG_COLORS[product.tag] : null;
              const isFav    = favIds.includes(product.id);
              return (
                <article key={product.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    {tagStyle && <span className={styles.tag} style={{ background:tagStyle.bg, color:tagStyle.color }}>{product.tag}</span>}
                    {user && (
                      <button className={styles.favBtn} onClick={()=>toggleFav(product.id)} title={isFav?'Remove from favourites':'Add to favourites'}>
                        {isFav ? '❤️' : '🤍'}
                      </button>
                    )}
                    <span className={styles.category}>{product.category}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.name}>{product.name}</h3>
                    <p className={styles.desc}>{product.description}</p>
                    {product.stock <= 10 && product.stock > 0 && (
                      <p className={styles.lowStock}>⚠️ Only {product.stock} left!</p>
                    )}
                    <div className={styles.cardFooter}>
                      <span className={styles.price}>₱{Number(product.price).toFixed(2)}</span>
                      <button
                        className={`${styles.addBtn} ${added===product.id?styles.addedBtn:''}`}
                        onClick={()=>handleAdd(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Sold Out' : added===product.id ? '✓ Added' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Menu;