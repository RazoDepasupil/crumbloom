import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

const FEMALE_AVATARS = [
  { emoji: '👩',     label: 'Default'         },
  { emoji: '👩🏻',   label: 'Light skin'       },
  { emoji: '👩🏼',   label: 'Medium-light'     },
  { emoji: '👩🏽',   label: 'Medium'           },
  { emoji: '👩🏾',   label: 'Medium-dark'      },
  { emoji: '👩🏿',   label: 'Dark skin'        },
  { emoji: '👱‍♀️',  label: 'Blonde'           },
  { emoji: '👱🏻‍♀️', label: 'Blonde light'    },
  { emoji: '👱🏽‍♀️', label: 'Blonde medium'   },
  { emoji: '👱🏿‍♀️', label: 'Blonde dark'     },
  { emoji: '👩‍🦰',  label: 'Red hair'         },
  { emoji: '👩🏻‍🦰', label: 'Red hair light'  },
  { emoji: '👩🏽‍🦰', label: 'Red hair medium' },
  { emoji: '👩🏿‍🦰', label: 'Red hair dark'   },
  { emoji: '👩‍🦱',  label: 'Curly hair'       },
  { emoji: '👩🏻‍🦱', label: 'Curly light'     },
  { emoji: '👩🏽‍🦱', label: 'Curly medium'    },
  { emoji: '👩🏿‍🦱', label: 'Curly dark'      },
  { emoji: '👩‍🦳',  label: 'White hair'       },
  { emoji: '👩🏻‍🦳', label: 'White hair light'},
  { emoji: '👩🏽‍🦳', label: 'White hair med'  },
  { emoji: '👩🏿‍🦳', label: 'White hair dark' },
  { emoji: '👩‍🦲',  label: 'Bald'             },
  { emoji: '👩🏻‍🦲', label: 'Bald light'      },
  { emoji: '👩🏽‍🦲', label: 'Bald medium'     },
  { emoji: '👩🏿‍🦲', label: 'Bald dark'       },
  { emoji: '🧕',    label: 'Hijab'            },
  { emoji: '🧕🏻',  label: 'Hijab light'      },
  { emoji: '🧕🏽',  label: 'Hijab medium'     },
  { emoji: '🧕🏿',  label: 'Hijab dark'       },
  { emoji: '👸',    label: 'Princess'         },
  { emoji: '👸🏻',  label: 'Princess light'   },
  { emoji: '👸🏽',  label: 'Princess medium'  },
  { emoji: '👸🏿',  label: 'Princess dark'    },
];

const MALE_AVATARS = [
  { emoji: '👨',     label: 'Default'          },
  { emoji: '👨🏻',   label: 'Light skin'        },
  { emoji: '👨🏼',   label: 'Medium-light'      },
  { emoji: '👨🏽',   label: 'Medium'            },
  { emoji: '👨🏾',   label: 'Medium-dark'       },
  { emoji: '👨🏿',   label: 'Dark skin'         },
  { emoji: '👱‍♂️',  label: 'Blonde'            },
  { emoji: '👱🏻‍♂️', label: 'Blonde light'     },
  { emoji: '👱🏽‍♂️', label: 'Blonde medium'    },
  { emoji: '👱🏿‍♂️', label: 'Blonde dark'      },
  { emoji: '👨‍🦰',  label: 'Red hair'          },
  { emoji: '👨🏻‍🦰', label: 'Red hair light'   },
  { emoji: '👨🏽‍🦰', label: 'Red hair medium'  },
  { emoji: '👨🏿‍🦰', label: 'Red hair dark'    },
  { emoji: '👨‍🦱',  label: 'Curly hair'        },
  { emoji: '👨🏻‍🦱', label: 'Curly light'      },
  { emoji: '👨🏽‍🦱', label: 'Curly medium'     },
  { emoji: '👨🏿‍🦱', label: 'Curly dark'       },
  { emoji: '👨‍🦳',  label: 'White hair'        },
  { emoji: '👨🏻‍🦳', label: 'White hair light' },
  { emoji: '👨🏽‍🦳', label: 'White hair med'   },
  { emoji: '👨🏿‍🦳', label: 'White hair dark'  },
  { emoji: '👨‍🦲',  label: 'Bald'              },
  { emoji: '👨🏻‍🦲', label: 'Bald light'       },
  { emoji: '👨🏽‍🦲', label: 'Bald medium'      },
  { emoji: '👨🏿‍🦲', label: 'Bald dark'        },
  { emoji: '🧔',    label: 'Beard'             },
  { emoji: '🧔🏻',  label: 'Beard light'       },
  { emoji: '🧔🏽',  label: 'Beard medium'      },
  { emoji: '🧔🏿',  label: 'Beard dark'        },
  { emoji: '👲',    label: 'Cap'               },
  { emoji: '🧑‍💼', label: 'Office'            },
  { emoji: '🧑🏻‍💼', label: 'Office light'    },
  { emoji: '🧑🏽‍💼', label: 'Office medium'   },
  { emoji: '🧑🏿‍💼', label: 'Office dark'     },
];

const OTHER_AVATARS = [
  { emoji: '🧑',    label: 'Neutral'          },
  { emoji: '🧑🏻',  label: 'Neutral light'    },
  { emoji: '🧑🏼',  label: 'Neutral med-lt'   },
  { emoji: '🧑🏽',  label: 'Neutral medium'   },
  { emoji: '🧑🏾',  label: 'Neutral med-dk'   },
  { emoji: '🧑🏿',  label: 'Neutral dark'     },
  { emoji: '🧑‍🦰', label: 'Red hair'         },
  { emoji: '🧑‍🦱', label: 'Curly hair'       },
  { emoji: '🧑‍🦳', label: 'White hair'       },
  { emoji: '🧑‍🦲', label: 'Bald'             },
  { emoji: '🧙',    label: 'Wizard'           },
  { emoji: '🧝',    label: 'Elf'              },
  { emoji: '🧚',    label: 'Fairy'            },
  { emoji: '🤖',    label: 'Robot'            },
  { emoji: '👾',    label: 'Alien'            },
];

// Group female/male by hair style for visual sections
const FEMALE_GROUPS = [
  { label: 'Default',    avatars: FEMALE_AVATARS.slice(0,6)  },
  { label: 'Blonde',     avatars: FEMALE_AVATARS.slice(6,10) },
  { label: 'Red Hair',   avatars: FEMALE_AVATARS.slice(10,14)},
  { label: 'Curly',      avatars: FEMALE_AVATARS.slice(14,18)},
  { label: 'White Hair', avatars: FEMALE_AVATARS.slice(18,22)},
  { label: 'Bald',       avatars: FEMALE_AVATARS.slice(22,26)},
  { label: 'Hijab',      avatars: FEMALE_AVATARS.slice(26,30)},
  { label: 'Princess',   avatars: FEMALE_AVATARS.slice(30)   },
];

const MALE_GROUPS = [
  { label: 'Default',    avatars: MALE_AVATARS.slice(0,6)  },
  { label: 'Blonde',     avatars: MALE_AVATARS.slice(6,10) },
  { label: 'Red Hair',   avatars: MALE_AVATARS.slice(10,14)},
  { label: 'Curly',      avatars: MALE_AVATARS.slice(14,18)},
  { label: 'White Hair', avatars: MALE_AVATARS.slice(18,22)},
  { label: 'Bald',       avatars: MALE_AVATARS.slice(22,26)},
  { label: 'Beard',      avatars: MALE_AVATARS.slice(26,30)},
  { label: 'Other',      avatars: MALE_AVATARS.slice(30)   },
];

const Login: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tab, setTab] = useState<'signin'|'signup'>(
    searchParams.get('tab') === 'signup' ? 'signup' : 'signin'
  );

  // Sign in
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Sign up
  const [suName, setSuName]         = useState('');
  const [suEmail, setSuEmail]       = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm]   = useState('');
  const [suGender, setSuGender]     = useState<'female'|'male'|'other'|''>('');
  const [suAvatar, setSuAvatar]     = useState('');
  const [suError, setSuError]       = useState('');
  const [suLoading, setSuLoading]   = useState(false);

  useEffect(() => { setError(''); setSuError(''); }, [tab]);
  useEffect(() => { setSuAvatar(''); }, [suGender]);

  const groups = suGender === 'female' ? FEMALE_GROUPS : suGender === 'male' ? MALE_GROUPS : suGender === 'other' ? [{ label: 'Choose your avatar', avatars: OTHER_AVATARS }] : [];

  const handleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!suName || !suEmail || !suPassword || !suConfirm) { setSuError('Please fill in all fields.'); return; }
    if (!suGender) { setSuError('Please select your gender.'); return; }
    if (!suAvatar) { setSuError('Please pick an avatar.'); return; }
    if (suPassword !== suConfirm) { setSuError('Passwords do not match.'); return; }
    if (suPassword.length < 6) { setSuError('Password must be at least 6 characters.'); return; }
    setSuLoading(true); setSuError('');
    const result = await register(suName, suEmail, suPassword, suGender, suAvatar);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setSuError(result.message);
      setSuLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <span className={styles.emoji}>🍪</span>
          <h1 className={styles.title}>{tab === 'signin' ? 'Welcome Back' : 'Create Account'}</h1>
          <p className={styles.sub}>{tab === 'signin' ? 'Sign in to your Crumb & Bloom account' : 'Join Crumb & Bloom to start ordering'}</p>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'signin' ? styles.tabActive : ''}`} onClick={() => setTab('signin')}>Sign In</button>
          <button className={`${styles.tab} ${tab === 'signup' ? styles.tabActive : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
        </div>

        {/* ── SIGN IN ── */}
        {tab === 'signin' && (
          <div className={styles.form}>
            {error && <div className={styles.error}>⚠️ {error}</div>}
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input type="email" className={styles.input} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input type="password" className={styles.input} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className={styles.btn} onClick={handleSignIn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
            <p className={styles.switchText}>
              Don't have an account?{' '}
              <button className={styles.switchBtn} onClick={() => setTab('signup')}>Create one</button>
            </p>
          </div>
        )}

        {/* ── SIGN UP ── */}
        {tab === 'signup' && (
          <div className={styles.form}>
            {suError && <div className={styles.error}>⚠️ {suError}</div>}

            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input type="text" className={styles.input} placeholder="e.g. Maria Santos" value={suName} onChange={e => setSuName(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input type="email" className={styles.input} placeholder="you@example.com" value={suEmail} onChange={e => setSuEmail(e.target.value)} />
            </div>

            {/* Gender selector */}
            <div className={styles.field}>
              <label className={styles.label}>Gender</label>
              <div className={styles.genderRow}>
                {(['female','male','other'] as const).map(g => (
                  <button key={g} type="button"
                    className={`${styles.genderBtn} ${suGender === g ? styles.genderActive : ''}`}
                    onClick={() => setSuGender(g)}>
                    {g === 'female' ? '♀ Female' : g === 'male' ? '♂ Male' : '⚬ Other'}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar picker — grouped by style */}
            {suGender && (
              <div className={styles.field}>
                <label className={styles.label}>
                  Choose Your Avatar
                  {suAvatar && <span className={styles.avatarPreview}>{suAvatar}</span>}
                </label>
                <div className={styles.avatarScroll}>
                  {groups.map(group => (
                    <div key={group.label} className={styles.avatarGroup}>
                      <p className={styles.avatarGroupLabel}>{group.label}</p>
                      <div className={styles.avatarRow}>
                        {group.avatars.map(a => (
                          <button key={a.emoji} type="button" title={a.label}
                            className={`${styles.avatarBtn} ${suAvatar === a.emoji ? styles.avatarActive : ''}`}
                            onClick={() => setSuAvatar(a.emoji)}>
                            {a.emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input type="password" className={styles.input} placeholder="At least 6 characters" value={suPassword} onChange={e => setSuPassword(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <input type="password" className={styles.input} placeholder="••••••••" value={suConfirm} onChange={e => setSuConfirm(e.target.value)} />
            </div>

            <button className={styles.btn} onClick={handleSignUp} disabled={suLoading}>
              {suLoading ? 'Creating account...' : 'Create Account →'}
            </button>
            <p className={styles.switchText}>
              Already have an account?{' '}
              <button className={styles.switchBtn} onClick={() => setTab('signin')}>Sign in</button>
            </p>
          </div>
        )}

      

        <a href="/" className={styles.back}>← Back to store</a>
      </div>
    </div>
  );
};

export default Login;