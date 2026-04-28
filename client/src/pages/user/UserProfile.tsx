import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import styles from './User.module.css';

const BASE = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');

const FEMALE_AVATARS = [
  { emoji: '👩',      label: 'Default'          }, { emoji: '👩🏻',   label: 'Light'           },
  { emoji: '👩🏽',    label: 'Medium'           }, { emoji: '👩🏿',   label: 'Dark'            },
  { emoji: '👱‍♀️',  label: 'Blonde'           }, { emoji: '👱🏻‍♀️', label: 'Blonde light'  },
  { emoji: '👱🏽‍♀️', label: 'Blonde med'      }, { emoji: '👱🏿‍♀️', label: 'Blonde dark'   },
  { emoji: '👩‍🦰',  label: 'Red hair'         }, { emoji: '👩🏻‍🦰', label: 'Red light'     },
  { emoji: '👩🏽‍🦰', label: 'Red med'         }, { emoji: '👩🏿‍🦰', label: 'Red dark'      },
  { emoji: '👩‍🦱',  label: 'Curly'            }, { emoji: '👩🏻‍🦱', label: 'Curly light'   },
  { emoji: '👩🏽‍🦱', label: 'Curly med'       }, { emoji: '👩🏿‍🦱', label: 'Curly dark'    },
  { emoji: '👩‍🦳',  label: 'White hair'       }, { emoji: '👩‍🦲',  label: 'Bald'           },
  { emoji: '🧕',     label: 'Hijab'            }, { emoji: '🧕🏽',  label: 'Hijab med'       },
  { emoji: '👸',     label: 'Princess'         }, { emoji: '👸🏽',  label: 'Princess med'    },
];

const MALE_AVATARS = [
  { emoji: '👨',      label: 'Default'          }, { emoji: '👨🏻',   label: 'Light'           },
  { emoji: '👨🏽',    label: 'Medium'           }, { emoji: '👨🏿',   label: 'Dark'            },
  { emoji: '👱‍♂️',  label: 'Blonde'           }, { emoji: '👱🏻‍♂️', label: 'Blonde light'  },
  { emoji: '👱🏽‍♂️', label: 'Blonde med'      }, { emoji: '👱🏿‍♂️', label: 'Blonde dark'   },
  { emoji: '👨‍🦰',  label: 'Red hair'         }, { emoji: '👨🏻‍🦰', label: 'Red light'     },
  { emoji: '👨🏽‍🦰', label: 'Red med'         }, { emoji: '👨🏿‍🦰', label: 'Red dark'      },
  { emoji: '👨‍🦱',  label: 'Curly'            }, { emoji: '👨🏻‍🦱', label: 'Curly light'   },
  { emoji: '👨🏽‍🦱', label: 'Curly med'       }, { emoji: '👨🏿‍🦱', label: 'Curly dark'    },
  { emoji: '👨‍🦳',  label: 'White hair'       }, { emoji: '👨‍🦲',  label: 'Bald'           },
  { emoji: '🧔',     label: 'Beard'            }, { emoji: '🧔🏽',  label: 'Beard med'       },
  { emoji: '👲',     label: 'Cap'              }, { emoji: '🧑‍💼', label: 'Office'          },
];

const OTHER_AVATARS = [
  { emoji: '🧑',     label: 'Neutral'          }, { emoji: '🧑🏻',  label: 'Neutral light'   },
  { emoji: '🧑🏽',   label: 'Neutral med'      }, { emoji: '🧑🏿',  label: 'Neutral dark'    },
  { emoji: '🧑‍🦰',  label: 'Red hair'         }, { emoji: '🧑‍🦱', label: 'Curly'          },
  { emoji: '🧑‍🦳',  label: 'White hair'       }, { emoji: '🧑‍🦲', label: 'Bald'           },
  { emoji: '🧙',     label: 'Wizard'           }, { emoji: '🧝',   label: 'Elf'             },
  { emoji: '🤖',     label: 'Robot'            }, { emoji: '👾',   label: 'Alien'           },
];

const UserProfile: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName]       = useState(user?.name || '');
  const [phone, setPhone]     = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatar, setAvatar]   = useState(user?.avatar || '');
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const avatarList = user?.gender === 'female' ? FEMALE_AVATARS : user?.gender === 'male' ? MALE_AVATARS : OTHER_AVATARS;

  const handleSave = async () => {
    setError('');
    try {
      const res = await fetch(`${BASE}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name, phone, address, avatar }),
      });
      if (res.ok) {
        refreshUser();
        setSaved(true);
        setShowAvatarPicker(false);
        setTimeout(() => setSaved(false), 2500);
      } else {
        const d = await res.json();
        setError(d.message || 'Failed to save.');
      }
    } catch {
      setError('Cannot connect to server.');
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Profile 👤</h1>
          <p className={styles.pageSub}>Manage your personal information and avatar.</p>
        </div>

        <div className={styles.profileCard}>
          {/* Avatar section */}
          <div className={styles.profileAvatarSection}>
            <div className={styles.profileAvatarWrap}>
              <span className={styles.profileAvatarLarge}>{avatar}</span>
              <button className={styles.changeAvatarBtn} onClick={() => setShowAvatarPicker(p => !p)}>
                {showAvatarPicker ? 'Close' : '✏️ Change'}
              </button>
            </div>
            <div>
              <h2 className={styles.profileName}>{user?.name}</h2>
              <p className={styles.profileEmail}>{user?.email}</p>
              <span className={styles.profileRoleBadge} style={{ background: user?.role === 'admin' ? '#880e4f' : '#e91e63' }}>
                {user?.role}
              </span>
            </div>
          </div>

          {/* Avatar picker */}
          {showAvatarPicker && (
            <div className={styles.profileAvatarPicker}>
              <p className={styles.avatarPickerTitle}>Choose a new avatar</p>
              <div className={styles.avatarPickerGrid}>
                {avatarList.map(a => (
                  <button key={a.emoji} title={a.label}
                    className={`${styles.avatarPickerBtn} ${avatar === a.emoji ? styles.avatarPickerActive : ''}`}
                    onClick={() => setAvatar(a.emoji)}>
                    {a.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          {saved && (
            <div className={styles.successBox}>✓ Profile updated successfully!</div>
          )}
          {error && (
            <div className={styles.errorBox}>⚠️ {error}</div>
          )}

          {/* Form */}
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Full Name</label>
              <input className={styles.formInput} value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Email</label>
              <input className={styles.formInput} value={user?.email || ''} readOnly style={{ opacity: 0.5, cursor: 'default' }} />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Phone</label>
              <input className={styles.formInput} value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 09952325119" />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Address</label>
              <input className={styles.formInput} value={address} onChange={e => setAddress(e.target.value)} placeholder="Your delivery address" />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Gender</label>
              <input className={styles.formInput} value={user?.gender || ''} readOnly style={{ opacity: 0.5, cursor: 'default', textTransform: 'capitalize' }} />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Member Since</label>
              <input className={styles.formInput} value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''} readOnly style={{ opacity: 0.5, cursor: 'default' }} />
            </div>
          </div>

          <button className={styles.saveBtn} onClick={handleSave}>
            Save Changes →
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;