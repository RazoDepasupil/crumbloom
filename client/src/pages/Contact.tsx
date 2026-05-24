import Footer from "../components/Footer/Footer";
import React, { useState } from "react";
import styles from "./Contact.module.css";

const CONTACT_INFO = [
  { icon: "👤", label: "Name", value: "Maxene Roux Macasinag" },
  { icon: "📍", label: "Address", value: "Brgy. 42 Rawis, Legazpi" },
  { icon: "📞", label: "Phone", value: "09952325119" },
  { icon: "✉️", label: "Email", value: "maxenerouxmacasinag@gmail.com" },
];

interface FormState {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  
  if (!form.name || !form.email || !form.message) return;
  setLoading(true);
  try {
    const response = await fetch("http://localhost:5000/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();

    if (data.success) {
      setMsg(data.message);
      setForm({ name: "", email: "", message: "" });
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } else {
      setMsg(data.error);
    }
  } catch (error) {
    setMsg("Something went wrong. Please try again.");
  }finally {
    setLoading(false);  
  }
};
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Get in Touch</p>
          <h1 className={styles.heroTitle}>
            We'd Love to <em>Hear</em>
            <br />
            from You 🍪
          </h1>
          <p className={styles.heroSub}>
            Questions about orders, gift boxes, or just want to say hi? Reach
            out — we reply faster than our cookies disappear.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className={styles.content}>
        {/* Info cards */}
        <div className={styles.infoCol}>
          <h2 className={styles.colTitle}>
            Contact <em>Details</em>
          </h2>
          <div className={styles.infoCards}>
            {CONTACT_INFO.map((item) => (
              <div key={item.label} className={styles.infoCard}>
                <span className={styles.infoIcon}>{item.icon}</span>
                <div>
                  <p className={styles.infoLabel}>{item.label}</p>
                  <p className={styles.infoValue}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.hoursCard}>
            <h3 className={styles.hoursTitle}>🕐 Baking Hours</h3>
            <div className={styles.hoursList}>
              <div className={styles.hoursRow}>
                <span>Monday – Friday</span>
                <span>7:00 AM – 7:00 PM</span>
              </div>
              <div className={styles.hoursRow}>
                <span>Saturday</span>
                <span>8:00 AM – 6:00 PM</span>
              </div>
              <div className={styles.hoursRow}>
                <span>Sunday</span>
                <span>9:00 AM – 3:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message form */}
        <div className={styles.formCol}>
          <h2 className={styles.colTitle}>
            Send a <em>Message</em>
          </h2>

          {sent && (
            <div className={styles.successBanner}>
              🎀 {msg} We'll get back to you shortly.
            </div>
          )}

          

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={styles.input}
                placeholder="e.g. Maria Santos"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className={styles.textarea}
                placeholder="Tell us about your order, a question, or anything at all..."
                rows={6}
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading || sent}
            >
             {sent ? "✓ Sent!" : loading ? "Sending..." : "Send Message →"}
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Contact;
