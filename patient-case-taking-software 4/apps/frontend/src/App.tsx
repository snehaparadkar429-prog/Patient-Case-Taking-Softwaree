import { useEffect, useState, FormEvent } from "react";

type Patient = { id: string; fullName: string; dateOfBirth: string; sex: string; phone: string };
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [message, setMessage] = useState("Loading patient records...");
  const [busy, setBusy] = useState(false);

  async function loadPatients() {
    try {
      const response = await fetch(`${API}/api/patients`);
      if (!response.ok) throw new Error("API unavailable");
      setPatients(await response.json());
      setMessage("");
    } catch {
      setMessage("Could not connect to the API. Start the backend and PostgreSQL database, then refresh.");
    }
  }

  useEffect(() => { void loadPatients(); }, []);

  async function addPatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName")),
      dateOfBirth: new Date(String(form.get("dateOfBirth"))).toISOString(),
      sex: String(form.get("sex")),
      phone: String(form.get("phone"))
    };
    try {
      const response = await fetch(`${API}/api/patients`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Please check the details and try again.");
      event.currentTarget.reset();
      setMessage("Patient registered successfully.");
      await loadPatients();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  return <main className="shell">
    <header className="top"><div className="mark">PC</div><div><p className="eyebrow">CLINICAL WORKSPACE</p><h1>Patient Case Taking</h1></div><span className="demo">Student project</span></header>
    <section className="intro"><div><p className="eyebrow">PATIENT MANAGEMENT</p><h2>Clear records. Better organised care.</h2><p className="muted">A simple workspace for patient registration and case documentation.</p></div><div className="stat"><strong>{patients.length}</strong><span>Registered patients</span></div></section>
    <section className="columns">
      <form className="panel" onSubmit={addPatient}>
        <h3>Register a patient</h3><p className="muted small">Enter fictional details for your project demonstration.</p>
        <label>Full name<input name="fullName" required minLength={2} maxLength={120} placeholder="e.g. Asha Sharma" /></label>
        <label>Date of birth<input name="dateOfBirth" type="date" required max={new Date().toISOString().slice(0,10)} /></label>
        <label>Sex<select name="sex" required><option value="Female">Female</option><option value="Male">Male</option><option value="Other">Other</option><option value="Prefer not to say">Prefer not to say</option></select></label>
        <label>Phone number<input name="phone" required minLength={7} maxLength={20} placeholder="Contact number" /></label>
        <button disabled={busy}>{busy ? "Saving..." : "Register patient"}</button>
      </form>
      <section className="panel records"><div className="panel-head"><div><h3>Patient records</h3><p className="muted small">Recently registered patients</p></div><button className="secondary" onClick={loadPatients} type="button">Refresh</button></div>
        {message && <p className="notice">{message}</p>}
        {patients.length === 0 ? <div className="empty"><span>＋</span><strong>No patient records yet</strong><p className="muted small">Register a demo patient to see it here.</p></div> :
          <div className="patient-list">{patients.map(p => <article className="patient" key={p.id}><div className="avatar">{p.fullName.slice(0,1).toUpperCase()}</div><div><strong>{p.fullName}</strong><p className="muted small">{p.sex} · {new Date(p.dateOfBirth).toLocaleDateString()}</p></div><span className="tag">Patient</span></article>)}</div>}
      </section>
    </section>
    <footer>Educational prototype · Do not enter real patient information.</footer>
  </main>;
}
