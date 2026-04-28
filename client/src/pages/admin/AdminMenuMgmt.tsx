import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import styles from './Admin.module.css';

const BASE = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');

const TAGS = ['', 'Bestseller', 'New', 'Fan Fave', 'Limited', 'Sale'];
const TAG_COLORS: Record<string, string> = {
  Bestseller: '#e91e63',
  New:        '#f06292',
  'Fan Fave': '#ad1457',
  Limited:    '#880e4f',
  Sale:       '#ff5722',
};

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '100',
  tag: '',
  is_available: true,
};

const AdminMenuMgmt: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [editing, setEditing]   = useState<any | null>(null);
  const [form, setForm]         = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved]       = useState('');
  const [err, setErr]           = useState('');
  const [loading, setLoading]   = useState(true);

  const load = async () => {
    try {
      const res = await fetch(`${BASE}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
    setErr('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      name:         p.name,
      description:  p.description || '',
      price:        String(p.price),
      category:     p.category || '',
      stock:        String(p.stock),
      tag:          p.tag || '',
      is_available: p.is_available,
    });
    setShowForm(true);
    setErr('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      setErr('Name and price are required.');
      return;
    }
    setErr('');
    const body = {
      ...form,
      price:        parseFloat(form.price),
      stock:        parseInt(form.stock) || 0,
      tag:          form.tag || null,
      description:  form.description || null,
      category:     form.category || null,
    };

    try {
      if (editing) {
        await fetch(`${BASE}/products/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(body),
        });
        setSaved('Product updated!');
      } else {
        await fetch(`${BASE}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(body),
        });
        setSaved('Product added!');
      }
      await load();
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      setTimeout(() => setSaved(''), 2500);
    } catch {
      setErr('Failed to save. Check your connection.');
    }
  };

  const handleTag = async (id: number, tag: string) => {
    await fetch(`${BASE}/products/${id}/tag`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ tag: tag || null }),
    });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, tag: tag || null } : p));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this product from the menu?')) return;
    await fetch(`${BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    await load();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    setErr('');
  };

  return (
    <DashboardLayout>
      <div className={styles.page}>

        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Product Management 🍪</h1>
          <p className={styles.pageSub}>Add, edit, remove products and manage tags.</p>
        </div>

        {saved && (
          <div className={styles.successBox}>✓ {saved}</div>
        )}

        <button
          onClick={openAdd}
          style={{
            background: 'var(--pink-500)', color: '#fff', border: 'none',
            padding: '12px 28px', borderRadius: 999,
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', alignSelf: 'flex-start',
            boxShadow: '0 4px 14px rgba(233,30,99,.25)',
          }}
        >
          + Add New Product
        </button>

        {/* ── Add / Edit Form ── */}
        {showForm && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {editing ? `Editing: ${editing.name}` : 'New Product'}
            </h2>

            {err && (
              <div className={styles.errorBox} style={{ marginBottom: 16 }}>⚠️ {err}</div>
            )}

            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Name *</label>
                <input
                  className={styles.formInput}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Product name"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Price (₱) *</label>
                <input
                  className={styles.formInput}
                  type="number" step="0.25" min="0"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className={styles.formField} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.formLabel}>Description</label>
                <input
                  className={styles.formInput}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of the product"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Category</label>
                <input
                  className={styles.formInput}
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Cookies, Gift Box"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Stock</label>
                <input
                  className={styles.formInput}
                  type="number" min="0"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Tag</label>
                <select
                  className={styles.formSelect}
                  value={form.tag}
                  onChange={e => setForm({ ...form, tag: e.target.value })}
                >
                  {TAGS.map(t => (
                    <option key={t} value={t}>{t || 'None'}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Available</label>
                <select
                  className={styles.formSelect}
                  value={form.is_available ? '1' : '0'}
                  onChange={e => setForm({ ...form, is_available: e.target.value === '1' })}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className={styles.saveBtn} onClick={handleSave}>
                {editing ? 'Save Changes' : 'Add Product'}
              </button>
              <button
                className={styles.saveBtn}
                style={{ background: 'var(--pink-100)', color: 'var(--pink-700)', boxShadow: 'none' }}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}


        <div className={styles.tableCard}>
          <div className={styles.tableCardHeader}>
            <div>
              <h2 className={styles.cardTitle}>All Products</h2>
              <p className={styles.cardSub}>{products.length} item{products.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {loading ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>⏳</span>
              <p className={styles.emptyText}>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🍪</span>
              <p className={styles.emptyText}>No products yet. Add one above!</p>
            </div>
          ) : (
            <div className={styles.table}>
              <div
                className={styles.tableHead}
                style={{ gridTemplateColumns: '1fr 100px 90px 130px 70px 120px' }}
              >
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Tag</span>
                <span>Stock</span>
                <span>Actions</span>
              </div>

              {products.map(p => (
                <div
                  key={p.id}
                  className={styles.tableRow}
                  style={{ gridTemplateColumns: '1fr 100px 90px 130px 70px 120px' }}
                >
                  {/* Name + description */}
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--pink-800)', fontSize: 14, marginBottom: 2 }}>
                      {p.name}
                    </p>
                    <p style={{ fontSize: 11, color: '#9ca3af' }}>
                      {p.description ? p.description.substring(0, 50) + (p.description.length > 50 ? '...' : '') : '—'}
                    </p>
                  </div>

                  {/* Category */}
                  <span style={{ fontSize: 12, color: '#6b7280' }}>{p.category || '—'}</span>

                  {/* Price */}
                  <span className={styles.totalCell}>₱{Number(p.price).toFixed(2)}</span>

                  {/* Tag selector */}
                  <div>
                    <select
                      style={{
                        background:   p.tag ? TAG_COLORS[p.tag] + '22' : 'var(--pink-50)',
                        border:       `1.5px solid ${p.tag ? TAG_COLORS[p.tag] : 'var(--pink-200)'}`,
                        borderRadius: 8, padding: '5px 8px',
                        fontSize: 11, fontWeight: 700,
                        color:   p.tag ? TAG_COLORS[p.tag] : '#9ca3af',
                        cursor: 'pointer', fontFamily: 'var(--font-body)', outline: 'none',
                        width: '100%',
                      }}
                      value={p.tag || ''}
                      onChange={e => handleTag(p.id, e.target.value)}
                    >
                      {TAGS.map(t => (
                        <option key={t} value={t}>{t || 'No tag'}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stock */}
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: p.stock === 0 ? '#ef4444' : p.stock <= 10 ? '#f59e0b' : 'var(--pink-600)',
                  }}>
                    {p.stock}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => openEdit(p)}
                      style={{ background: 'var(--pink-100)', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: 'var(--pink-700)', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{ background: '#fff0f5', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: '#ef4444', cursor: 'pointer' }}
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminMenuMgmt;