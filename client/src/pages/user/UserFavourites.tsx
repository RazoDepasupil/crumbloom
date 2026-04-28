import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import styles from './User.module.css';

const BASE = 'http://localhost:5000/api';
const token = () => localStorage.getItem('token');

const UserFavourites: React.FC = () => {
  const [favs, setFavs]     = useState<any[]>([]);
  const [all, setAll]       = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/favourites`,     { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()),
      fetch(`${BASE}/products`).then(r=>r.json()),
    ]).then(([f, c]) => {
      setFavs(Array.isArray(f)?f:[]);
      setAll(Array.isArray(c)?c:[]);
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, []);

  const favIds = favs.map(f=>f.id);
  const rest   = all.filter(c=>!favIds.includes(c.id));

  const addFav = async (productId: number) => {
    await fetch(`${BASE}/favourites`, { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token()}`}, body:JSON.stringify({ product_id: productId }) });
    const prod = all.find(c=>c.id===productId);
    if (prod) setFavs(prev=>[...prev, prod]);
  };

  const removeFav = async (productId: number) => {
    await fetch(`${BASE}/favourites/${productId}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token()}` } });
    setFavs(prev=>prev.filter(f=>f.id!==productId));
  };

  if (loading) return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}><h1 className={styles.pageTitle}>My Favourites ❤️</h1></div>
        <div style={{ textAlign:'center', padding:60, color:'#ccc', fontFamily:'var(--font-body)' }}>Loading...</div>
      </div>
    </DashboardLayout>
  );

  const ProductCard = ({ p, isFav }: { p: any; isFav: boolean }) => (
    <div className={styles.favCard}>
      <div className={styles.favTop} style={{ background:'var(--pink-100)', position:'relative' }}>
        <span style={{ fontSize:40 }}>🍪</span>
        {p.tag && (
          <span style={{ position:'absolute', top:10, left:10, background:'var(--pink-500)', color:'#fff', fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:999, letterSpacing:'.5px' }}>{p.tag}</span>
        )}
        <button onClick={()=>isFav?removeFav(p.id):addFav(p.id)}
          style={{ position:'absolute', top:10, right:10, background:'rgba(255,255,255,.9)', border:'none', borderRadius:'50%', width:32, height:32, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform .2s' }}>
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div className={styles.favBody}>
        <p className={styles.favName}>{p.name}</p>
        <p style={{ fontFamily:'var(--font-body)', fontSize:11, color:'#9ca3af', marginBottom:4 }}>{p.category}</p>
        <p className={styles.favPrice}>${Number(p.price).toFixed(2)}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Favourites ❤️</h1>
          <p className={styles.pageSub}>Your saved products — tap the heart to remove.</p>
        </div>

        {favs.length === 0 ? (
          <div className={styles.section} style={{ textAlign:'center', padding:'60px 20px' }}>
            <span style={{ fontSize:60, display:'block', marginBottom:16 }}>🤍</span>
            <p style={{ fontWeight:700, color:'var(--pink-400)', fontSize:16 }}>No favourites yet!</p>
            <p style={{ color:'#9ca3af', fontSize:14, marginTop:8 }}>Browse products below and tap the heart to save.</p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily:'var(--font-body)', fontSize:12, color:'#9ca3af', letterSpacing:1, textTransform:'uppercase', fontWeight:700 }}>Saved ({favs.length})</p>
            <div className={styles.favGrid}>
              {favs.map(p=><ProductCard key={p.id} p={p} isFav={true}/>)}
            </div>
          </>
        )}

        {rest.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Add More Favourites</h2>
            <div className={styles.favGrid}>
              {rest.map(p=><ProductCard key={p.id} p={p} isFav={false}/>)}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserFavourites;