import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell
} from "recharts";
import {
  AlertTriangle, TrendingUp, TrendingDown, MessageCircle, Users, BookOpen,
  Send, Sparkles, ChevronRight, GraduationCap, LayoutDashboard, X, Loader2,
  CheckCircle2, ShieldAlert, Code2
} from "lucide-react";

/* ---------------- Design tokens ---------------- */
const C = {
  bg: "#F5F6FA",
  surface: "#FFFFFF",
  ink: "#151A2E",
  inkSoft: "#5B6178",
  inkFaint: "#9498AC",
  primary: "#3654F4",
  primarySoft: "#EAEDFF",
  border: "#E4E6F0",
  high: "#E1483B",
  highSoft: "#FCEAE8",
  med: "#E7A23D",
  medSoft: "#FDF2E2",
  low: "#2E9E68",
  lowSoft: "#E7F6EF",
};

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "English", "Coding"];

/* ---------------- Mock data generation ---------------- */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const FIRST = ["Aarav","Vinitha","Sanjay","Priya","Kiran","Meera","Rahul","Divya","Arjun","Sneha","Karthik","Ananya","Vivek","Pooja","Manoj","Lakshmi","Rohan","Isha","Naveen","Deepa","Suresh","Nandini","Harish","Swathi","Gokul","Ramya","Ajay","Preethi","Vishal","Kavya"];

function genStudent(i, rng) {
  // create a persona: 0=strong,1=average,2=at-risk,3=mixed
  const persona = i % 4 === 2 ? "risk" : i % 5 === 0 ? "strong" : i % 3 === 0 ? "mixed" : "average";
  const base = persona === "strong" ? 82 : persona === "risk" ? 45 : persona === "mixed" ? 65 : 70;
  const attendance = clamp(Math.round(base - 10 + rng() * 20), 40, 99);

  const subjects = {};
  SUBJECTS.forEach((s, si) => {
    let mean = base + (rng() * 20 - 10);
    if (persona === "mixed" && si % 2 === 0) mean -= 22; // a couple of weak subjects
    mean = clamp(mean, 20, 98);
    const marks = Array.from({ length: 5 }, (_, t) =>
      clamp(Math.round(mean + (rng() * 16 - 8) + (t - 2) * (persona === "risk" ? -1.5 : 0.8)), 15, 100)
    );
    const assignmentCompletion = clamp(Math.round(mean + (rng() * 14 - 7)), 10, 100);
    subjects[s] = { marks, assignmentCompletion };
  });

  const coding = {
    problemsSolved: Math.round(clamp(base - 20 + rng() * 60, 0, 220)),
    accuracy: clamp(Math.round(base - 5 + rng() * 20), 20, 99),
  };

  return {
    id: i + 1,
    name: FIRST[i % FIRST.length] + " " + String.fromCharCode(65 + (i % 26)) + ".",
    attendance,
    subjects,
    coding,
  };
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

const rng = seededRandom(7);
const STUDENTS = Array.from({ length: 28 }, (_, i) => genStudent(i, rng));

/* ---------------- Scoring logic ---------------- */
function subjectAvg(student, subject) {
  const s = student.subjects[subject];
  const marksAvg = s.marks.reduce((a, b) => a + b, 0) / s.marks.length;
  return Math.round(marksAvg);
}

function overallMarksAvg(student) {
  const avgs = SUBJECTS.map((s) => subjectAvg(student, s));
  return avgs.reduce((a, b) => a + b, 0) / avgs.length;
}

function overallAssignmentAvg(student) {
  const vals = SUBJECTS.map((s) => student.subjects[s].assignmentCompletion);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function computeRisk(student) {
  const attendanceRisk = 100 - student.attendance;
  const marksRisk = 100 - overallMarksAvg(student);
  const assignmentRisk = 100 - overallAssignmentAvg(student);
  const codingRisk = 100 - student.coding.accuracy;
  const score = Math.round(
    0.35 * attendanceRisk + 0.35 * marksRisk + 0.2 * assignmentRisk + 0.1 * codingRisk
  );
  const category = score >= 60 ? "High" : score >= 32 ? "Medium" : "Low";
  return { score: clamp(score, 0, 100), category };
}

function weakSubjects(student) {
  const avgs = SUBJECTS.map((s) => ({ subject: s, avg: subjectAvg(student, s) }));
  const overall = overallMarksAvg(student);
  return avgs.filter((a) => a.avg < 60 || a.avg < overall - 12).sort((a, b) => a.avg - b.avg);
}

function trendOf(student, subject) {
  return student.subjects[subject].marks[4] - student.subjects[subject].marks[0];
}

const riskColor = (cat) => (cat === "High" ? C.high : cat === "Medium" ? C.med : C.low);
const riskSoft = (cat) => (cat === "High" ? C.highSoft : cat === "Medium" ? C.medSoft : C.lowSoft);

/* ---------------- AI helper (calls our own backend, not Anthropic directly) ---------------- */
async function askClaude(systemPrompt, userPrompt, { json = false } = {}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: systemPrompt, prompt: userPrompt }),
  });
  if (!res.ok) {
    console.error("Backend error", await res.text());
    return json ? null : "Sorry, I couldn't reach the AI service right now.";
  }
  const data = await res.json();
  const text = data.text || "";
  if (json) {
    const clean = text.replace(/```json|```/g, "").trim();
    try { return JSON.parse(clean); } catch { return null; }
  }
  return text;
}

/* ---------------- UI atoms ---------------- */
function Card({ children, style }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function Badge({ text, color, soft }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
      borderRadius: 999, fontSize: 12, fontWeight: 600, color, background: soft,
    }}>
      {text}
    </span>
  );
}

function RiskGauge({ score, category, size = 150 }) {
  const data = [{ value: score, fill: riskColor(category) }];
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="72%" outerRadius="100%" data={data}
          startAngle={90} endAngle={-270} barSize={12}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: C.bg }} dataKey="value" cornerRadius={8} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 30, fontWeight: 700, color: C.ink }}>{score}</div>
        <div style={{ fontSize: 11, color: C.inkFaint, marginTop: 2 }}>risk index</div>
      </div>
    </div>
  );
}

/* ---------------- Chatbot panel ---------------- */
function DoubtChatbot() {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your AI doubt-solving tutor. Ask me anything about " + SUBJECTS[0] + "." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    const next = [...messages, { role: "user", text: q }];
    setMessages(next);
    setLoading(true);
    try {
      const sys = `You are a patient, encouraging ${subject} tutor for a school/college student. Explain concepts step by step in simple language. Keep answers under 150 words unless a full derivation is needed. Never just give a final answer without explanation.`;
      const reply = await askClaude(sys, q);
      setMessages((m) => [...m, { role: "assistant", text: reply || "Sorry, I couldn't get a response. Try again." }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "Something went wrong reaching the AI service." }]);
    }
    setLoading(false);
  }

  return (
    <Card style={{ display: "flex", flexDirection: "column", height: 480, padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: C.ink }}>
          <MessageCircle size={18} color={C.primary} /> AI doubt chatbot
        </div>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}
          style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 13, color: C.ink, background: C.bg }}>
          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "82%", padding: "9px 13px", borderRadius: 12,
            background: m.role === "user" ? C.primary : C.bg,
            color: m.role === "user" ? "#fff" : C.ink,
            fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap"
          }}>{m.text}</div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", color: C.inkFaint, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <Loader2 size={14} className="spin" /> thinking…
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${C.border}` }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Ask a ${subject} doubt...`}
          style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 13.5, outline: "none" }}
        />
        <button onClick={send} disabled={loading}
          style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "0 14px", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Send size={16} />
        </button>
      </div>
    </Card>
  );
}

/* ---------------- Student view ---------------- */
function StudentView({ students, selectedId, setSelectedId }) {
  const student = students.find((s) => s.id === selectedId);
  const risk = computeRisk(student);
  const weak = weakSubjects(student);
  const [recs, setRecs] = useState(null);
  const [recLoading, setRecLoading] = useState(false);

  const chartData = SUBJECTS.map((s) => ({ subject: s.slice(0, 4), avg: subjectAvg(student, s) }));

  async function generateRecs() {
    setRecLoading(true);
    setRecs(null);
    const sys = "You are an academic advisor AI. Respond ONLY with a JSON array of 4 short, specific, actionable recommendation strings (max 18 words each). No preamble, no markdown.";
    const prompt = `Student risk category: ${risk.category} (score ${risk.score}/100).
Attendance: ${student.attendance}%.
Weak subjects (avg %): ${weak.map(w => `${w.subject}: ${w.avg}%`).join(", ") || "none"}.
Coding accuracy: ${student.coding.accuracy}%, problems solved: ${student.coding.problemsSolved}.
Give 4 personalized, practical recommendations to improve.`;
    const result = await askClaude(sys, prompt, { json: true });
    setRecs(Array.isArray(result) ? result : ["Could not generate recommendations right now. Try again."]);
    setRecLoading(false);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <select value={selectedId} onChange={(e) => setSelectedId(Number(e.target.value))}
                style={{ fontSize: 20, fontWeight: 700, color: C.ink, border: "none", background: "transparent", marginBottom: 4, cursor: "pointer" }}>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div style={{ color: C.inkSoft, fontSize: 13 }}>Student dashboard · Grade 11</div>
              <div style={{ marginTop: 10 }}>
                <Badge text={`${risk.category} risk`} color={riskColor(risk.category)} soft={riskSoft(risk.category)} />
              </div>
            </div>
            <RiskGauge score={risk.score} category={risk.category} />
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, color: C.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <BookOpen size={16} color={C.primary} /> Subject performance
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 12, fill: C.inkSoft }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: C.inkSoft }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.avg < 60 ? C.high : d.avg < 75 ? C.med : C.low} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, color: C.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldAlert size={16} color={C.primary} /> Weak-subject detection
          </div>
          {weak.length === 0 ? (
            <div style={{ color: C.low, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={16} /> No significantly weak subjects detected.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {weak.map((w) => {
                const t = trendOf(student, w.subject);
                return (
                  <div key={w.subject} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: C.bg, borderRadius: 8 }}>
                    <span style={{ fontSize: 13.5, color: C.ink, fontWeight: 500 }}>{w.subject}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 12, color: C.inkSoft }}>{w.avg}% avg</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, color: t >= 0 ? C.low : C.high }}>
                        {t >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {Math.abs(t)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} color={C.primary} /> Personalized recommendations
            </div>
          </div>
          {!recs && !recLoading && (
            <button onClick={generateRecs} style={{
              width: "100%", padding: "10px", borderRadius: 8, border: `1px solid ${C.primary}`,
              background: C.primarySoft, color: C.primary, fontWeight: 600, fontSize: 13.5, cursor: "pointer"
            }}>Generate with AI</button>
          )}
          {recLoading && <div style={{ color: C.inkFaint, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Loader2 size={14} /> Analyzing performance…</div>}
          {recs && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recs.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: C.ink, lineHeight: 1.5 }}>
                  <ChevronRight size={15} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} />
                  {r}
                </div>
              ))}
              <button onClick={generateRecs} style={{ marginTop: 4, alignSelf: "flex-start", fontSize: 12, color: C.inkFaint, background: "none", border: "none", cursor: "pointer" }}>regenerate</button>
            </div>
          )}
        </Card>

        <Card>
          <div style={{ fontWeight: 700, color: C.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Code2 size={16} color={C.primary} /> Coding + activity
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              ["Attendance", student.attendance + "%"],
              ["Coding accuracy", student.coding.accuracy + "%"],
              ["Problems solved", student.coding.problemsSolved],
            ].map(([label, val]) => (
              <div key={label} style={{ background: C.bg, borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>{val}</div>
                <div style={{ fontSize: 10.5, color: C.inkSoft, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </Card>

        <DoubtChatbot />
      </div>
    </div>
  );
}

/* ---------------- Teacher view ---------------- */
function TeacherView({ students }) {
  const rows = useMemo(() => students.map((s) => ({ ...s, risk: computeRisk(s) })).sort((a, b) => b.risk.score - a.risk.score), [students]);
  const counts = { High: 0, Medium: 0, Low: 0 };
  rows.forEach((r) => counts[r.risk.category]++);
  const classAvgRisk = Math.round(rows.reduce((a, r) => a + r.risk.score, 0) / rows.length);

  const subjectClassAvg = SUBJECTS.map((s) => ({
    subject: s.slice(0, 4),
    avg: Math.round(students.reduce((a, st) => a + subjectAvg(st, s), 0) / students.length),
  }));

  const weakestSubjectCounts = {};
  students.forEach((s) => weakSubjects(s).forEach((w) => {
    weakestSubjectCounts[w.subject] = (weakestSubjectCounts[w.subject] || 0) + 1;
  }));
  const topWeak = Object.entries(weakestSubjectCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const [insight, setInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);

  async function generateInsight() {
    setInsightLoading(true);
    setInsight(null);
    const sys = "You are an AI teaching assistant summarizing class performance for a teacher. Respond ONLY with JSON: {\"summary\": string (max 60 words), \"actions\": [3 short action items, max 14 words each]}. No markdown.";
    const atRisk = rows.filter((r) => r.risk.category === "High").map((r) => r.name).join(", ") || "none";
    const prompt = `Class of ${students.length} students. Average risk score: ${classAvgRisk}/100.
Risk distribution: ${counts.High} high, ${counts.Medium} medium, ${counts.Low} low.
High-risk students: ${atRisk}.
Most common weak subjects across class: ${topWeak.map(([s, c]) => `${s} (${c} students)`).join(", ")}.
Give the teacher a short summary and 3 concrete action items.`;
    const result = await askClaude(sys, prompt, { json: true });
    setInsight(result);
    setInsightLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 12, color: C.inkSoft }}>Class average risk</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}>{classAvgRisk}</div>
        </Card>
        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 12, color: C.inkSoft }}>High risk</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.high, fontFamily: "'JetBrains Mono', monospace" }}>{counts.High}</div>
        </Card>
        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 12, color: C.inkSoft }}>Medium risk</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.med, fontFamily: "'JetBrains Mono', monospace" }}>{counts.Medium}</div>
        </Card>
        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 12, color: C.inkSoft }}>Low risk</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.low, fontFamily: "'JetBrains Mono', monospace" }}>{counts.Low}</div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <div style={{ fontWeight: 700, color: C.ink, marginBottom: 12 }}>Class average by subject</div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectClassAvg}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 12, fill: C.inkSoft }} axisLine={{ stroke: C.border }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: C.inkSoft }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="avg" radius={[6, 6, 0, 0]} fill={C.primary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} color={C.primary} /> AI class insights
            </div>
          </div>
          {!insight && !insightLoading && (
            <button onClick={generateInsight} style={{
              width: "100%", padding: "10px", borderRadius: 8, border: `1px solid ${C.primary}`,
              background: C.primarySoft, color: C.primary, fontWeight: 600, fontSize: 13.5, cursor: "pointer"
            }}>Generate class summary</button>
          )}
          {insightLoading && <div style={{ color: C.inkFaint, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Loader2 size={14} /> Analyzing class data…</div>}
          {insight && (
            <div>
              <p style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.6, marginTop: 0 }}>{insight.summary}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(insight.actions || []).map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: C.ink }}>
                    <ChevronRight size={15} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} /> {a}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", fontWeight: 700, color: C.ink, borderBottom: `1px solid ${C.border}` }}>
          Students — sorted by risk
        </div>
        <div style={{ maxHeight: 420, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ position: "sticky", top: 0, background: C.surface }}>
                {["Student", "Risk", "Attendance", "Marks avg", "Weak subjects", "Coding acc."].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 20px", color: C.inkSoft, fontWeight: 600, fontSize: 11.5, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const weak = weakSubjects(r);
                return (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 20px", fontWeight: 500, color: C.ink }}>{r.name}</td>
                    <td style={{ padding: "10px 20px" }}>
                      <Badge text={`${r.risk.category} · ${r.risk.score}`} color={riskColor(r.risk.category)} soft={riskSoft(r.risk.category)} />
                    </td>
                    <td style={{ padding: "10px 20px", color: C.inkSoft }}>{r.attendance}%</td>
                    <td style={{ padding: "10px 20px", color: C.inkSoft }}>{Math.round(overallMarksAvg(r))}%</td>
                    <td style={{ padding: "10px 20px", color: C.inkSoft }}>{weak.length ? weak.map((w) => w.subject).join(", ") : "—"}</td>
                    <td style={{ padding: "10px 20px", color: C.inkSoft }}>{r.coding.accuracy}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- App ---------------- */
export default function App() {
  const [view, setView] = useState("student");
  const [selectedId, setSelectedId] = useState(STUDENTS[2].id);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: "'Inter', system-ui, sans-serif",
      color: C.ink, padding: "24px 28px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@600;700&display=swap');
        select, input, button { font-family: 'Inter', system-ui, sans-serif; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #D4D6E4; border-radius: 8px; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>AI Intelligence</div>
            <div style={{ fontSize: 11.5, color: C.inkFaint }}>Student performance & risk platform</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 4 }}>
          <button onClick={() => setView("student")} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
            background: view === "student" ? C.primary : "transparent", color: view === "student" ? "#fff" : C.inkSoft, fontWeight: 600, fontSize: 13
          }}><LayoutDashboard size={15} /> Student view</button>
          <button onClick={() => setView("teacher")} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
            background: view === "teacher" ? C.primary : "transparent", color: view === "teacher" ? "#fff" : C.inkSoft, fontWeight: 600, fontSize: 13
          }}><Users size={15} /> Teacher view</button>
        </div>
      </div>

      {view === "student"
        ? <StudentView students={STUDENTS} selectedId={selectedId} setSelectedId={setSelectedId} />
        : <TeacherView students={STUDENTS} />}
    </div>
  );
}
