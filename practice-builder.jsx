"use client";
import { useState, useEffect } from "react";
import {
  getDrills, createDrill, updateDrill, deleteDrill,
  getSavedMenus, createSavedMenu, deleteSavedMenu,
  getPhilosophyItems, createPhilosophyItem, updatePhilosophyItem, deletePhilosophyItem,
} from "./app/actions";

const CATEGORIES = ["ウォームアップ", "パス", "ドリブル", "シュート", "ゲーム", "クールダウン"];

const CAT_COLOR = {
  "ウォームアップ": { bg: "#fff3e0", border: "#ff9800", text: "#e65100", dark: "#ff9800" },
  "パス":         { bg: "#e3f2fd", border: "#2196f3", text: "#0d47a1", dark: "#2196f3" },
  "ドリブル":     { bg: "#fce4ec", border: "#e91e63", text: "#880e4f", dark: "#e91e63" },
  "シュート":     { bg: "#e8f5e9", border: "#4caf50", text: "#1b5e20", dark: "#4caf50" },
  "ゲーム":       { bg: "#ede7f6", border: "#7c4dff", text: "#4a148c", dark: "#7c4dff" },
  "クールダウン": { bg: "#e0f7fa", border: "#00bcd4", text: "#006064", dark: "#00bcd4" },
};

const EMPTY_FORM = {
  name: "", category: "ウォームアップ", duration: 10,
  players: "全員", icon: "⚽",
  desc: "", theme: "", rules: "", howTo: "",
  coaching: ["", "", ""],
  teaching: ["", "", ""],
};

const PHIL_TYPES = {
  vision:    { label: "チームビジョン",  icon: "🎯", color: "#2e7d32", bg: "#e8f5e9", desc: "チームとして目指す姿・方向性" },
  trait:     { label: "目指す選手像",    icon: "⭐", color: "#1565c0", bg: "#e3f2fd", desc: "選手に身につけてほしい資質・能力" },
  milestone: { label: "成長の目安",      icon: "📈", color: "#e65100", bg: "#fff3e0", desc: "年次・カテゴリ別の到達目標" },
  phrase:    { label: "チームの言葉",    icon: "💬", color: "#4a148c", bg: "#ede7f6", desc: "コーチが繰り返し伝える文化・精神" },
};

// DB row → component shape
function normalizeDrill(row) {
  return { ...row, desc: row.description, howTo: row.how_to };
}

function normalizePhilItem(row) {
  return { ...row, yearLabel: row.year_label };
}

function normalizeSavedMenu(row) {
  return { ...row, totalTime: row.total_time, savedAt: row.saved_at };
}

function drillToForm(drill) {
  return {
    name:     drill.name,
    category: drill.category,
    duration: drill.duration,
    players:  drill.players,
    icon:     drill.icon,
    desc:     drill.desc,
    theme:    drill.theme    || "",
    rules:    drill.rules    || "",
    howTo:    drill.howTo    || "",
    coaching: drill.coaching?.length ? [...drill.coaching] : ["", "", ""],
    teaching: drill.teaching?.length ? [...drill.teaching] : ["", "", ""],
  };
}

// ---- Sub-components ----

function DetailSection({ icon, label, content }) {
  if (!content) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#6b8fa8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 13, color: "#1a2a3a", lineHeight: 1.7, background: "#f8fafc", borderRadius: 8, padding: "10px 12px" }}>
        {content}
      </div>
    </div>
  );
}

function DetailListSection({ icon, label, items, color }) {
  if (!items?.length) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#6b8fa8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
        {icon} {label}
      </div>
      <div style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 12px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: i < items.length - 1 ? 8 : 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: color.dark, flexShrink: 0, marginTop: 5 }} />
            <div style={{ fontSize: 13, color: "#1a2a3a", lineHeight: 1.6 }}>{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#6b8fa8", marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  border: "1px solid #dde8f0", fontSize: 13, color: "#1a2a3a",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  background: "#fafcff",
};

// ---- Main App ----

export default function App() {
  const [menu, setMenu] = useState([]);
  const [selectedCat, setSelectedCat] = useState("ウォームアップ");
  const [view, setView] = useState("shishin");
  const [menuTitle, setMenuTitle] = useState("今日の練習メニュー");
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Supabase data
  const [drills, setDrills] = useState([]);
  const [savedMenus, setSavedMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detail modal
  const [selectedDrill, setSelectedDrill] = useState(null);

  // Drill form modal (create or edit)
  const [drillForm, setDrillForm] = useState(null); // null = closed, { mode: "create"|"edit", id?, form }
  const [drillFormError, setDrillFormError] = useState("");
  const [isSavingDrill, setIsSavingDrill] = useState(false);

  // Philosophy
  const [philosophyItems, setPhilosophyItems] = useState([]);
  const [philForm, setPhilForm] = useState(null); // null | { mode, type, id?, form }
  const [philFormError, setPhilFormError] = useState("");
  const [isSavingPhil, setIsSavingPhil] = useState(false);

  // Menu save
  const [isSavingMenu, setIsSavingMenu] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);

  useEffect(() => {
    Promise.all([getDrills(), getSavedMenus(), getPhilosophyItems()])
      .then(([d, m, p]) => {
        setDrills(d.map(normalizeDrill));
        setSavedMenus(m.map(normalizeSavedMenu));
        setPhilosophyItems(p.map(normalizePhilItem));
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDrills = drills.filter(d => d.category === selectedCat);
  const totalTime = menu.reduce((sum, d) => sum + d.duration, 0);

  // ---- Menu actions ----
  const addToMenu = (drill) => {
    setMenu(prev => [...prev, { ...drill, uid: Date.now() + Math.random(), note: "" }]);
  };

  const removeFromMenu = (uid) => setMenu(prev => prev.filter(d => d.uid !== uid));

  const moveUp = (i) => {
    if (i === 0) return;
    setMenu(prev => { const a = [...prev]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; });
  };

  const moveDown = (i) => {
    if (i === menu.length - 1) return;
    setMenu(prev => { const a = [...prev]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a; });
  };

  const updateNote = (uid, note) => {
    setMenu(prev => prev.map(d => d.uid === uid ? { ...d, note } : d));
  };

  const saveMenu = async () => {
    if (menu.length === 0) return;
    setIsSavingMenu(true);
    try {
      const row = await createSavedMenu({ title: menuTitle, totalTime, items: menu });
      setSavedMenus(prev => [normalizeSavedMenu(row), ...prev]);
      setSaveFlash(true);
      setTimeout(() => setSaveFlash(false), 2000);
    } finally {
      setIsSavingMenu(false);
    }
  };

  const loadMenu = (sm) => {
    setMenu(sm.items);
    setMenuTitle(sm.title);
    setView("build");
  };

  const handleDeleteMenu = async (id) => {
    await deleteSavedMenu(id);
    setSavedMenus(prev => prev.filter(m => m.id !== id));
  };

  // ---- Drill form ----
  const openCreateForm = () => {
    setDrillFormError("");
    setDrillForm({ mode: "create", form: { ...EMPTY_FORM, coaching: ["", "", ""], teaching: ["", "", ""] } });
  };

  const openEditForm = (drill) => {
    setDrillFormError("");
    setDrillForm({ mode: "edit", id: drill.id, form: drillToForm(drill) });
  };

  const updateFormField = (key, value) => {
    setDrillForm(prev => ({ ...prev, form: { ...prev.form, [key]: value } }));
  };

  const updateFormArray = (key, index, value) => {
    setDrillForm(prev => {
      const arr = [...prev.form[key]];
      arr[index] = value;
      return { ...prev, form: { ...prev.form, [key]: arr } };
    });
  };

  const addFormArrayItem = (key) => {
    setDrillForm(prev => ({ ...prev, form: { ...prev.form, [key]: [...prev.form[key], ""] } }));
  };

  const submitDrillForm = async () => {
    const { mode, id, form } = drillForm;
    if (!form.name.trim()) { setDrillFormError("ドリル名を入力してください"); return; }
    setIsSavingDrill(true);
    setDrillFormError("");
    try {
      const payload = {
        ...form,
        duration: Number(form.duration),
        coaching: form.coaching.filter(s => s.trim()),
        teaching: form.teaching.filter(s => s.trim()),
      };
      if (mode === "create") {
        const row = await createDrill(payload);
        const normalized = normalizeDrill(row);
        setDrills(prev => [...prev, normalized]);
        setSelectedCat(normalized.category);
      } else {
        const row = await updateDrill(id, payload);
        const normalized = normalizeDrill(row);
        setDrills(prev => prev.map(d => d.id === id ? normalized : d));
        // メニュー内の同ドリルも更新
        setMenu(prev => prev.map(d => d.id === id ? { ...normalized, uid: d.uid, note: d.note } : d));
      }
      setDrillForm(null);
    } catch (e) {
      setDrillFormError(e.message);
    } finally {
      setIsSavingDrill(false);
    }
  };

  // ---- Philosophy form ----
  const openPhilForm = (type) => {
    setPhilFormError("");
    setPhilForm({ mode: "create", type, form: { title: "", content: "", yearLabel: "" } });
  };

  const openEditPhilForm = (item) => {
    setPhilFormError("");
    setPhilForm({ mode: "edit", type: item.type, id: item.id, form: { title: item.title, content: item.content || "", yearLabel: item.yearLabel || "" } });
  };

  const submitPhilForm = async () => {
    const { mode, type, id, form } = philForm;
    if (!form.title.trim()) { setPhilFormError("タイトルを入力してください"); return; }
    setIsSavingPhil(true);
    setPhilFormError("");
    try {
      if (mode === "create") {
        const maxOrder = philosophyItems.filter(p => p.type === type).reduce((m, p) => Math.max(m, p.sort_order || 0), 0);
        const row = await createPhilosophyItem({ ...form, type, sortOrder: maxOrder + 1 });
        setPhilosophyItems(prev => [...prev, normalizePhilItem(row)]);
      } else {
        const row = await updatePhilosophyItem(id, form);
        setPhilosophyItems(prev => prev.map(p => p.id === id ? normalizePhilItem(row) : p));
      }
      setPhilForm(null);
    } catch (e) {
      setPhilFormError(e.message);
    } finally {
      setIsSavingPhil(false);
    }
  };

  const handleDeletePhilItem = async (id) => {
    await deletePhilosophyItem(id);
    setPhilosophyItems(prev => prev.filter(p => p.id !== id));
  };

  const handleDeleteDrill = async (id) => {
    await deleteDrill(id);
    setDrills(prev => prev.filter(d => d.id !== id));
    setMenu(prev => prev.filter(d => d.id !== id));
  };

  // ---- Render ----
  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", background: "#f0f4f8", minHeight: "100vh", maxWidth: 500, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a3a2a 0%, #0f2d1f 100%)", padding: "18px 20px 14px", position: "sticky", top: 0, zIndex: 20, boxShadow: "0 2px 12px #0008" }}>
        <div style={{ fontSize: 10, color: "#4caf50", letterSpacing: 3, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>101FC</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 19, fontWeight: 900, color: "#fff" }}>コーチガイド（101FCのDNA）</div>
          <div style={{ background: "#4caf5022", border: "1px solid #4caf5066", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 700, color: "#4caf50" }}>
            ⏱ {totalTime}分
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 12, background: "#ffffff18", borderRadius: 10, padding: 3, gap: 3 }}>
          {[
            { id: "shishin", label: "🧭 指針" },
            { id: "build",   label: "🔧 ビルド" },
            { id: "preview", label: "📋 確認" },
            { id: "saved",   label: "📁 保存済み" },
          ].map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{ flex: 1, padding: "7px", background: view === v.id ? "#fff" : "none", border: "none", borderRadius: 8, color: view === v.id ? "#1a3a2a" : "#ffffff88", fontWeight: view === v.id ? 700 : 400, fontSize: 11, cursor: "pointer", transition: "all 0.2s" }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== BUILD VIEW ===== */}
      {view === "build" && (
        <div>
          {/* Current menu */}
          <div style={{ padding: "14px 16px 8px" }}>
            <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
              メニュー ({menu.length}項目)
            </div>

            {menu.length === 0 && (
              <div style={{ textAlign: "center", padding: "28px 20px", background: "#fff", borderRadius: 14, border: "2px dashed #c8d8e8", color: "#a0b8cc", fontSize: 13 }}>
                ↓ 下からドリルを追加してください
              </div>
            )}

            {menu.map((drill, i) => {
              const c = CAT_COLOR[drill.category];
              return (
                <div key={drill.uid} style={{ background: "#fff", borderRadius: 12, marginBottom: 8, overflow: "hidden", border: `1px solid ${c.border}44`, boxShadow: "0 1px 4px #0001" }}>
                  <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", gap: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <button onClick={() => moveUp(i)} style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", fontSize: 12, color: i === 0 ? "#ddd" : "#6b8fa8", padding: "1px 4px", lineHeight: 1 }}>▲</button>
                      <button onClick={() => moveDown(i)} style={{ background: "none", border: "none", cursor: i === menu.length-1 ? "default" : "pointer", fontSize: 12, color: i === menu.length-1 ? "#ddd" : "#6b8fa8", padding: "1px 4px", lineHeight: 1 }}>▼</button>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: c.text, background: c.bg, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: 20, flexShrink: 0 }}>{drill.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2a3a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{drill.name}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 2, alignItems: "center" }}>
                        <span style={{ fontSize: 10, background: c.bg, color: c.text, borderRadius: 4, padding: "1px 6px", fontWeight: 600 }}>{drill.category}</span>
                        <span style={{ fontSize: 10, color: "#8aa", fontWeight: 600 }}>⏱{drill.duration}分</span>
                        <span style={{ fontSize: 10, color: "#8aa" }}>👥{drill.players}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => setSelectedDrill(drill)} style={{ background: "#f0f4f8", border: "1px solid #dde8f0", borderRadius: 6, padding: "5px 7px", cursor: "pointer", fontSize: 11, fontWeight: 700, color: "#6b8fa8" }}>詳細</button>
                      <button onClick={() => setEditingNoteId(editingNoteId === drill.uid ? null : drill.uid)} style={{ background: editingNoteId === drill.uid ? "#e3f2fd" : "#f0f4f8", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", fontSize: 12 }}>✏️</button>
                      <button onClick={() => removeFromMenu(drill.uid)} style={{ background: "#fce4ec", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", fontSize: 12 }}>✕</button>
                    </div>
                  </div>
                  {editingNoteId === drill.uid && (
                    <div style={{ padding: "0 12px 10px", borderTop: `1px solid ${c.border}22` }}>
                      <textarea
                        value={drill.note}
                        onChange={e => updateNote(drill.uid, e.target.value)}
                        placeholder="コーチメモ（ポイント・注意事項など）"
                        style={{ width: "100%", minHeight: 56, padding: "8px 10px", borderRadius: 8, border: "1px solid #c8d8e8", fontSize: 12, color: "#1a2a3a", resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginTop: 8 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ margin: "4px 16px 12px", borderTop: "1px solid #dde8f0" }} />

          {/* Drill library */}
          <div style={{ padding: "0 16px 24px" }}>
            <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>ドリルを追加</div>

            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }}>
              {CATEGORIES.map(cat => {
                const c = CAT_COLOR[cat];
                return (
                  <button key={cat} onClick={() => setSelectedCat(cat)} style={{
                    flexShrink: 0, padding: "6px 12px",
                    background: selectedCat === cat ? c.dark : "#fff",
                    border: `1.5px solid ${selectedCat === cat ? c.dark : "#dde8f0"}`,
                    borderRadius: 20, fontSize: 11, fontWeight: 700,
                    color: selectedCat === cat ? "#fff" : "#6b8fa8",
                    cursor: "pointer",
                  }}>
                    {cat}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "32px", color: "#a0b8cc", fontSize: 13 }}>読み込み中...</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredDrills.map(drill => {
                  const c = CAT_COLOR[drill.category];
                  const already = menu.filter(d => d.id === drill.id).length;
                  return (
                    <div key={drill.id} style={{ background: "#fff", borderRadius: 12, border: `1px solid ${c.border}44`, overflow: "hidden", boxShadow: "0 1px 3px #0001" }}>
                      <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", gap: 12 }}>
                        <div style={{ fontSize: 24, flexShrink: 0 }}>{drill.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a2a3a" }}>{drill.name}</div>
                          <div style={{ fontSize: 11, color: "#7a92a8", marginTop: 2, lineHeight: 1.4 }}>{drill.desc}</div>
                          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                            <span style={{ fontSize: 10, color: "#8aa", fontWeight: 600 }}>⏱ {drill.duration}分</span>
                            <span style={{ fontSize: 10, color: "#8aa" }}>👥 {drill.players}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                          <button onClick={() => addToMenu(drill)} style={{
                            background: `linear-gradient(135deg, ${c.dark}, ${c.dark}cc)`,
                            border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 20,
                            width: 36, height: 36, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: `0 2px 8px ${c.dark}44`,
                          }}>+</button>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button onClick={() => setSelectedDrill(drill)} style={{ background: "#f0f4f8", border: "1px solid #dde8f0", borderRadius: 6, fontSize: 10, fontWeight: 700, color: "#6b8fa8", padding: "3px 7px", cursor: "pointer" }}>詳細</button>
                            <button onClick={() => openEditForm(drill)} style={{ background: "#e3f2fd", border: "1px solid #bbdefb", borderRadius: 6, fontSize: 10, fontWeight: 700, color: "#1565c0", padding: "3px 7px", cursor: "pointer" }}>編集</button>
                            <button onClick={() => handleDeleteDrill(drill.id)} style={{ background: "#fce4ec", border: "none", borderRadius: 6, fontSize: 10, fontWeight: 700, color: "#c62828", padding: "3px 7px", cursor: "pointer" }}>削除</button>
                          </div>
                        </div>
                      </div>
                      {already > 0 && (
                        <div style={{ background: c.bg, padding: "3px 14px", fontSize: 10, color: c.text, fontWeight: 600 }}>
                          ✓ メニューに{already}回追加済み
                        </div>
                      )}
                    </div>
                  );
                })}

                <button onClick={openCreateForm} style={{
                  marginTop: 4, width: "100%", padding: "13px",
                  background: "#fff", border: "2px dashed #4caf5066",
                  borderRadius: 12, color: "#2e7d32", fontSize: 13,
                  fontWeight: 700, cursor: "pointer",
                }}>
                  ＋ 新しいドリルを追加
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== PREVIEW VIEW ===== */}
      {view === "preview" && (
        <div style={{ padding: 16 }}>
          <input
            value={menuTitle}
            onChange={e => setMenuTitle(e.target.value)}
            style={{ width: "100%", fontSize: 18, fontWeight: 900, color: "#1a2a3a", border: "none", borderBottom: "2px solid #4caf50", background: "transparent", padding: "6px 0", marginBottom: 16, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
          />

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ label: "合計時間", value: `${totalTime}分`, icon: "⏱" }, { label: "項目数", value: `${menu.length}個`, icon: "📋" }].map(s => (
              <div key={s.label} style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "10px 14px", textAlign: "center", border: "1px solid #dde8f0" }}>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#1a3a2a" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#8aa" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {menu.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 16, border: "1px solid #dde8f0" }}>
              <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>カテゴリ別時間</div>
              {CATEGORIES.map(cat => {
                const catTime = menu.filter(d => d.category === cat).reduce((s, d) => s + d.duration, 0);
                if (catTime === 0) return null;
                const c = CAT_COLOR[cat];
                return (
                  <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: c.text, fontWeight: 700, width: 90, flexShrink: 0 }}>{cat}</div>
                    <div style={{ flex: 1, background: "#f0f4f8", borderRadius: 4, height: 8, overflow: "hidden" }}>
                      <div style={{ width: `${(catTime / totalTime) * 100}%`, height: "100%", background: c.dark, borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: c.text, width: 36, textAlign: "right" }}>{catTime}分</div>
                  </div>
                );
              })}
            </div>
          )}

          {menu.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#a0b8cc", fontSize: 14, background: "#fff", borderRadius: 14, border: "2px dashed #c8d8e8" }}>
              ビルドタブでメニューを作成してください
            </div>
          )}

          {menu.map((drill, i) => {
            const c = CAT_COLOR[drill.category];
            return (
              <div key={drill.uid} style={{ background: "#fff", borderRadius: 14, marginBottom: 10, overflow: "hidden", border: `1px solid ${c.border}44`, boxShadow: "0 1px 4px #0001" }}>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  <div style={{ width: 5, background: c.dark, flexShrink: 0 }} />
                  <div style={{ padding: "12px 14px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: "#fff", background: c.dark, borderRadius: 6, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                      <span style={{ fontSize: 18 }}>{drill.icon}</span>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#1a2a3a", flex: 1 }}>{drill.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: c.text, background: c.bg, borderRadius: 6, padding: "2px 8px" }}>{drill.duration}分</div>
                      <button onClick={() => setSelectedDrill(drill)} style={{ background: "#f0f4f8", border: "1px solid #dde8f0", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#6b8fa8" }}>詳細</button>
                    </div>
                    <div style={{ fontSize: 12, color: "#6b8fa8", marginLeft: 32, lineHeight: 1.5 }}>{drill.desc}</div>
                    {drill.note && (
                      <div style={{ marginTop: 8, marginLeft: 32, padding: "7px 10px", background: "#fffbea", borderRadius: 8, borderLeft: "3px solid #ffc107", fontSize: 12, color: "#6b5000", lineHeight: 1.5 }}>
                        📝 {drill.note}
                      </div>
                    )}
                    <div style={{ marginTop: 6, marginLeft: 32 }}>
                      <span style={{ fontSize: 10, color: "#8aa", fontWeight: 600 }}>👥 {drill.players}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {menu.length > 0 && (
            <>
              <div style={{ marginTop: 8, background: "linear-gradient(135deg, #1a3a2a, #0f2d1f)", borderRadius: 14, padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#4caf50", fontWeight: 700, marginBottom: 4 }}>🏁 練習終了</div>
                <div style={{ fontSize: 12, color: "#ffffff88" }}>お疲れさまでした！合計 {totalTime}分</div>
              </div>
              <button onClick={saveMenu} disabled={isSavingMenu} style={{
                marginTop: 12, width: "100%", padding: "14px",
                background: saveFlash ? "#43a047" : "linear-gradient(135deg, #2e7d32, #1b5e20)",
                border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 700,
                cursor: isSavingMenu ? "default" : "pointer", opacity: isSavingMenu ? 0.7 : 1,
                boxShadow: "0 2px 12px #2e7d3244",
              }}>
                {isSavingMenu ? "保存中..." : saveFlash ? "✅ 保存しました！" : "💾 このメニューを保存する"}
              </button>
            </>
          )}
        </div>
      )}

      {/* ===== SAVED VIEW ===== */}
      {view === "saved" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            保存済みメニュー ({savedMenus.length}件)
          </div>

          {loading && <div style={{ textAlign: "center", padding: "40px", color: "#a0b8cc", fontSize: 13 }}>読み込み中...</div>}

          {!loading && savedMenus.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 14, border: "2px dashed #c8d8e8", color: "#a0b8cc", fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
              まだ保存済みメニューがありません<br />
              <span style={{ fontSize: 12 }}>確認タブでメニューを保存しましょう</span>
            </div>
          )}

          {savedMenus.map(sm => (
            <div key={sm.id} style={{ background: "#fff", borderRadius: 14, marginBottom: 12, border: "1px solid #dde8f0", overflow: "hidden", boxShadow: "0 1px 4px #0001" }}>
              <div style={{ padding: "12px 14px", borderBottom: "1px solid #f0f4f8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#1a2a3a", marginBottom: 3 }}>{sm.title}</div>
                    <div style={{ fontSize: 11, color: "#8aa" }}>
                      {new Date(sm.savedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
                      　⏱ {sm.totalTime}分　📋 {sm.items.length}項目
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => loadMenu(sm)} style={{ background: "linear-gradient(135deg, #2e7d32, #1b5e20)", border: "none", borderRadius: 8, color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 10px", cursor: "pointer" }}>読み込む</button>
                    <button onClick={() => handleDeleteMenu(sm.id)} style={{ background: "#fce4ec", border: "none", borderRadius: 8, color: "#c62828", fontSize: 11, fontWeight: 700, padding: "5px 10px", cursor: "pointer" }}>削除</button>
                  </div>
                </div>
              </div>
              {sm.items.map((item, i) => {
                const c = CAT_COLOR[item.category];
                const libraryDrill = drills.find(d => d.id === item.id);
                return (
                  <div key={item.uid} style={{ display: "flex", alignItems: "center", padding: "8px 14px", borderBottom: i < sm.items.length - 1 ? `1px solid ${c.border}22` : "none", gap: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: c.text, background: c.bg, borderRadius: 4, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1a2a3a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: "#8aa" }}>{item.category} · {item.duration}分</div>
                    </div>
                    {libraryDrill && (
                      <button onClick={() => setSelectedDrill(libraryDrill)} style={{ background: "#f0f4f8", border: "1px solid #dde8f0", borderRadius: 6, fontSize: 10, fontWeight: 700, color: "#6b8fa8", padding: "3px 8px", cursor: "pointer", flexShrink: 0 }}>詳細</button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* ===== SHISHIN VIEW ===== */}
      {view === "shishin" && (
        <div style={{ padding: "8px 0 32px" }}>
          {loading && <div style={{ textAlign: "center", padding: "40px", color: "#a0b8cc", fontSize: 13 }}>読み込み中...</div>}
          {!loading && Object.entries(PHIL_TYPES).map(([type, cfg]) => {
            const items = philosophyItems.filter(p => p.type === type);
            return (
              <div key={type} style={{ marginBottom: 8 }}>
                <div style={{ padding: "14px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: cfg.color }}>{cfg.icon} {cfg.label}</div>
                    <div style={{ fontSize: 11, color: "#8aa", marginTop: 2 }}>{cfg.desc}</div>
                  </div>
                  <button onClick={() => openPhilForm(type)} style={{ background: cfg.color, border: "none", borderRadius: 8, color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 10px", cursor: "pointer", flexShrink: 0 }}>＋ 追加</button>
                </div>
                <div style={{ padding: "0 16px" }}>
                  {items.length === 0 && (
                    <div style={{ textAlign: "center", padding: "14px", background: "#fff", borderRadius: 10, border: "2px dashed #c8d8e8", color: "#a0b8cc", fontSize: 12 }}>
                      まだ登録されていません
                    </div>
                  )}
                  {items.map(item => (
                    <div key={item.id} style={{ background: "#fff", borderRadius: 12, marginBottom: 8, overflow: "hidden", border: `1px solid ${cfg.color}33`, boxShadow: "0 1px 4px #0001" }}>
                      {type === "phrase" ? (
                        <div style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: 18, fontWeight: 900, color: cfg.color, marginBottom: 6, lineHeight: 1.4 }}>「{item.title}」</div>
                          {item.content && <div style={{ fontSize: 13, color: "#3a4a5a", lineHeight: 1.7, background: cfg.bg, borderRadius: 8, padding: "8px 12px", marginBottom: 8 }}>{item.content}</div>}
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                            <button onClick={() => openEditPhilForm(item)} style={{ background: "#e3f2fd", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#1565c0", padding: "4px 10px", cursor: "pointer" }}>編集</button>
                            <button onClick={() => handleDeletePhilItem(item.id)} style={{ background: "#fce4ec", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#c62828", padding: "4px 10px", cursor: "pointer" }}>削除</button>
                          </div>
                        </div>
                      ) : type === "milestone" ? (
                        <div style={{ display: "flex", alignItems: "stretch" }}>
                          <div style={{ width: 5, background: cfg.color, flexShrink: 0 }} />
                          <div style={{ padding: "12px 14px", flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                              {item.yearLabel && <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg, borderRadius: 6, padding: "2px 8px", flexShrink: 0 }}>{item.yearLabel}</span>}
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2a3a", flex: 1 }}>{item.title}</div>
                            </div>
                            {item.content && <div style={{ fontSize: 12, color: "#5a6a7a", lineHeight: 1.6, paddingLeft: item.yearLabel ? 0 : 0 }}>{item.content}</div>}
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 8 }}>
                              <button onClick={() => openEditPhilForm(item)} style={{ background: "#e3f2fd", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#1565c0", padding: "4px 10px", cursor: "pointer" }}>編集</button>
                              <button onClick={() => handleDeletePhilItem(item.id)} style={{ background: "#fce4ec", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#c62828", padding: "4px 10px", cursor: "pointer" }}>削除</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: "12px 14px" }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a2a3a", marginBottom: 4 }}>{item.title}</div>
                          {item.content && <div style={{ fontSize: 12, color: "#5a6a7a", lineHeight: 1.6, marginBottom: 8 }}>{item.content}</div>}
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                            <button onClick={() => openEditPhilForm(item)} style={{ background: "#e3f2fd", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#1565c0", padding: "4px 10px", cursor: "pointer" }}>編集</button>
                            <button onClick={() => handleDeletePhilItem(item.id)} style={{ background: "#fce4ec", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#c62828", padding: "4px 10px", cursor: "pointer" }}>削除</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ margin: "8px 16px 0", borderBottom: "1px solid #e8f0f8" }} />
              </div>
            );
          })}
        </div>
      )}

      {/* ===== PHIL FORM MODAL ===== */}
      {philForm && (() => {
        const cfg = PHIL_TYPES[philForm.type];
        const isPhrase = philForm.type === "phrase";
        const isMilestone = philForm.type === "milestone";
        return (
          <div onClick={() => setPhilForm(null)} style={{ position: "fixed", inset: 0, background: "#000000aa", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px #0006" }}>
              <div style={{ background: cfg.color, padding: "18px 20px", borderRadius: "20px 20px 0 0", position: "sticky", top: 0, zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>
                      {cfg.icon} {philForm.mode === "create" ? `${cfg.label}を追加` : `${cfg.label}を編集`}
                    </div>
                    <div style={{ fontSize: 11, color: "#ffffff99", marginTop: 2 }}>変更はサーバーに保存されます</div>
                  </div>
                  <button onClick={() => setPhilForm(null)} style={{ background: "#ffffff33", border: "none", borderRadius: 8, color: "#fff", fontSize: 16, padding: "6px 12px", cursor: "pointer" }}>✕</button>
                </div>
              </div>
              <div style={{ padding: "20px" }}>
                {isMilestone && (
                  <FormField label="年次・カテゴリ（例：U8、小学1年）">
                    <input value={philForm.form.yearLabel} onChange={e => setPhilForm(prev => ({ ...prev, form: { ...prev.form, yearLabel: e.target.value } }))} placeholder="U8、U10、小学1年など" style={inputStyle} />
                  </FormField>
                )}
                <FormField label={isPhrase ? "言葉・フレーズ *" : "タイトル *"}>
                  <input value={philForm.form.title} onChange={e => setPhilForm(prev => ({ ...prev, form: { ...prev.form, title: e.target.value } }))} placeholder={isPhrase ? "例：ボールは宝物" : "例：テクニカルな選手"} style={inputStyle} />
                </FormField>
                <FormField label={isPhrase ? "解説・使い方" : "詳細・説明"}>
                  <textarea value={philForm.form.content} onChange={e => setPhilForm(prev => ({ ...prev, form: { ...prev.form, content: e.target.value } }))} placeholder={isPhrase ? "どんな場面で伝えるか、なぜ大切かを記述" : "詳細な説明や具体的な行動指針"} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
                </FormField>
                {philFormError && (
                  <div style={{ background: "#fce4ec", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#c62828", marginBottom: 12 }}>{philFormError}</div>
                )}
                <button onClick={submitPhilForm} disabled={isSavingPhil} style={{
                  width: "100%", padding: "14px",
                  background: cfg.color, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: isSavingPhil ? "default" : "pointer", opacity: isSavingPhil ? 0.7 : 1,
                  boxShadow: `0 2px 12px ${cfg.color}44`,
                }}>
                  {isSavingPhil ? "保存中..." : "💾 保存する"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== DETAIL MODAL ===== */}
      {selectedDrill && (
        <div onClick={() => setSelectedDrill(null)} style={{ position: "fixed", inset: 0, background: "#000000aa", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 8px 40px #0006" }}>
            <div style={{ background: CAT_COLOR[selectedDrill.category].dark, padding: "18px 20px 16px", borderRadius: "20px 20px 0 0", position: "sticky", top: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{selectedDrill.icon}</div>
                  <div style={{ fontSize: 19, fontWeight: 900, color: "#fff" }}>{selectedDrill.name}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: "#ffffff99", background: "#ffffff22", borderRadius: 6, padding: "2px 8px" }}>{selectedDrill.category}</span>
                    <span style={{ fontSize: 11, color: "#ffffff99", background: "#ffffff22", borderRadius: 6, padding: "2px 8px" }}>⏱ {selectedDrill.duration}分</span>
                    <span style={{ fontSize: 11, color: "#ffffff99", background: "#ffffff22", borderRadius: 6, padding: "2px 8px" }}>👥 {selectedDrill.players}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => { openEditForm(selectedDrill); setSelectedDrill(null); }} style={{ background: "#ffffff33", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, padding: "6px 10px", cursor: "pointer" }}>編集</button>
                  <button onClick={() => setSelectedDrill(null)} style={{ background: "#ffffff33", border: "none", borderRadius: 8, color: "#fff", fontSize: 16, padding: "6px 12px", cursor: "pointer" }}>✕</button>
                </div>
              </div>
            </div>
            <div style={{ padding: "18px 20px 24px" }}>
              <DetailSection icon="🎯" label="テーマ" content={selectedDrill.theme} />
              <DetailSection icon="📏" label="ルール" content={selectedDrill.rules} />
              <DetailSection icon="▶️" label="進め方" content={selectedDrill.howTo} />
              <DetailListSection icon="🗣️" label="コーチングポイント" items={selectedDrill.coaching} color={CAT_COLOR[selectedDrill.category]} />
              <DetailListSection icon="📚" label="ティーチングポイント" items={selectedDrill.teaching} color={CAT_COLOR[selectedDrill.category]} />
            </div>
          </div>
        </div>
      )}

      {/* ===== DRILL FORM MODAL (create / edit) ===== */}
      {drillForm && (
        <div onClick={() => setDrillForm(null)} style={{ position: "fixed", inset: 0, background: "#000000aa", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px #0006" }}>

            <div style={{ background: "linear-gradient(135deg, #1a3a2a, #0f2d1f)", padding: "18px 20px", borderRadius: "20px 20px 0 0", position: "sticky", top: 0, zIndex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>
                    {drillForm.mode === "create" ? "新しいドリルを追加" : "ドリルを編集"}
                  </div>
                  <div style={{ fontSize: 11, color: "#ffffff66", marginTop: 2 }}>変更はサーバーに保存されます</div>
                </div>
                <button onClick={() => setDrillForm(null)} style={{ background: "#ffffff33", border: "none", borderRadius: 8, color: "#fff", fontSize: 16, padding: "6px 12px", cursor: "pointer" }}>✕</button>
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6b8fa8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>基本情報</div>

              <FormField label="ドリル名 *">
                <input value={drillForm.form.name} onChange={e => updateFormField("name", e.target.value)} placeholder="例：シャドーストライカー" style={inputStyle} />
              </FormField>

              <div style={{ display: "flex", gap: 12 }}>
                <FormField label="カテゴリ">
                  <select value={drillForm.form.category} onChange={e => updateFormField("category", e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="時間（分）">
                  <input type="number" min={1} max={120} value={drillForm.form.duration} onChange={e => updateFormField("duration", e.target.value)} style={inputStyle} />
                </FormField>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <FormField label="人数">
                  <input value={drillForm.form.players} onChange={e => updateFormField("players", e.target.value)} placeholder="全員、2人1組 など" style={inputStyle} />
                </FormField>
                <div style={{ width: 80 }}>
                  <FormField label="アイコン">
                    <input value={drillForm.form.icon} onChange={e => updateFormField("icon", e.target.value)} style={{ ...inputStyle, textAlign: "center", fontSize: 20 }} maxLength={2} />
                  </FormField>
                </div>
              </div>

              <FormField label="説明">
                <textarea value={drillForm.form.desc} onChange={e => updateFormField("desc", e.target.value)} placeholder="ドリルの概要を簡潔に" rows={2} style={{ ...inputStyle, resize: "vertical" }} />
              </FormField>

              <div style={{ margin: "16px 0 12px", borderTop: "1px solid #f0f4f8" }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6b8fa8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>詳細情報</div>

              <FormField label="テーマ">
                <input value={drillForm.form.theme} onChange={e => updateFormField("theme", e.target.value)} placeholder="例：正確なパスと素早い判断" style={inputStyle} />
              </FormField>

              <FormField label="ルール">
                <textarea value={drillForm.form.rules} onChange={e => updateFormField("rules", e.target.value)} placeholder="ルールや制限事項を記述" rows={2} style={{ ...inputStyle, resize: "vertical" }} />
              </FormField>

              <FormField label="進め方">
                <textarea value={drillForm.form.howTo} onChange={e => updateFormField("howTo", e.target.value)} placeholder="①〜 ②〜 のように手順を記述" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              </FormField>

              <FormField label="コーチングポイント">
                {drillForm.form.coaching.map((v, i) => (
                  <input key={i} value={v} onChange={e => updateFormArray("coaching", i, e.target.value)} placeholder={`ポイント ${i + 1}`} style={{ ...inputStyle, marginBottom: 6 }} />
                ))}
                <button onClick={() => addFormArrayItem("coaching")} style={{ background: "none", border: "1px dashed #c8d8e8", borderRadius: 6, fontSize: 11, color: "#6b8fa8", fontWeight: 700, padding: "4px 10px", cursor: "pointer", marginTop: 2 }}>＋ 追加</button>
              </FormField>

              <FormField label="ティーチングポイント">
                {drillForm.form.teaching.map((v, i) => (
                  <input key={i} value={v} onChange={e => updateFormArray("teaching", i, e.target.value)} placeholder={`ポイント ${i + 1}`} style={{ ...inputStyle, marginBottom: 6 }} />
                ))}
                <button onClick={() => addFormArrayItem("teaching")} style={{ background: "none", border: "1px dashed #c8d8e8", borderRadius: 6, fontSize: 11, color: "#6b8fa8", fontWeight: 700, padding: "4px 10px", cursor: "pointer", marginTop: 2 }}>＋ 追加</button>
              </FormField>

              {drillFormError && (
                <div style={{ background: "#fce4ec", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#c62828", marginBottom: 12 }}>
                  {drillFormError}
                </div>
              )}

              <button onClick={submitDrillForm} disabled={isSavingDrill} style={{
                width: "100%", padding: "14px",
                background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
                border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700,
                cursor: isSavingDrill ? "default" : "pointer", opacity: isSavingDrill ? 0.7 : 1,
                boxShadow: "0 2px 12px #2e7d3244",
              }}>
                {isSavingDrill ? "保存中..." : drillForm.mode === "create" ? "💾 ドリルを保存する" : "💾 変更を保存する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
