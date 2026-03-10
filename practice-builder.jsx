import { useState } from "react";

const DRILL_LIBRARY = [
  // ウォームアップ
  { id: 1, name: "ジョギング", category: "ウォームアップ", duration: 5, players: "全員", icon: "🏃", desc: "グラウンド2周、徐々にペースアップ" },
  { id: 2, name: "動的ストレッチ", category: "ウォームアップ", duration: 5, players: "全員", icon: "🤸", desc: "股関節・膝・足首をほぐす" },
  { id: 3, name: "鬼ごっこ", category: "ウォームアップ", duration: 8, players: "全員", icon: "😈", desc: "ボールなしで動きを活性化" },

  // パス・ボールコントロール
  { id: 4, name: "2人組パス", category: "パス", duration: 10, players: "2人1組", icon: "✅", desc: "10mの距離でインサイドパスの確認" },
  { id: 5, name: "三角パス", category: "パス", duration: 12, players: "3人1組", icon: "🔺", desc: "ワンタッチ・ツータッチを切り替え" },
  { id: 6, name: "菱形パス回し", category: "パス", duration: 15, players: "4人1組", icon: "♦️", desc: "ダイヤモンド形にコーンを置きパス&ムーブ" },
  { id: 7, name: "リターンパス", category: "パス", duration: 10, players: "2人1組", icon: "↩️", desc: "壁パス（ワンツー）の連続練習" },

  // ドリブル
  { id: 8, name: "コーンドリブル", category: "ドリブル", duration: 10, players: "個人", icon: "🔥", desc: "5本のコーンをジグザグドリブル" },
  { id: 9, name: "1対1", category: "ドリブル", duration: 15, players: "2人1組", icon: "⚔️", desc: "5m×10mのエリアで1対1突破" },
  { id: 10, name: "ドリブルリレー", category: "ドリブル", duration: 10, players: "チーム", icon: "🏅", desc: "チームに分かれてドリブルリレー競争" },

  // シュート
  { id: 11, name: "シュート練習", category: "シュート", duration: 15, players: "全員", icon: "⚽", desc: "GKなしでコーナーにコーンゴール" },
  { id: 12, name: "GKありシュート", category: "シュート", duration: 15, players: "全員", icon: "🥅", desc: "ペナルティエリアからのシュート" },
  { id: 13, name: "クロス&シュート", category: "シュート", duration: 15, players: "全員", icon: "🎯", desc: "サイドからのクロスに合わせてシュート" },

  // ゲーム形式
  { id: 14, name: "3対3", category: "ゲーム", duration: 20, players: "6人", icon: "🟢", desc: "小さいゴールで素早い判断を養う" },
  { id: 15, name: "4対4", category: "ゲーム", duration: 20, players: "8人", icon: "🔵", desc: "ポゼッションを意識した形式" },
  { id: 16, name: "紅白戦", category: "ゲーム", duration: 30, players: "全員", icon: "🏆", desc: "実戦形式。今日の練習テーマを意識して" },

  // クールダウン
  { id: 17, name: "静的ストレッチ", category: "クールダウン", duration: 8, players: "全員", icon: "🧘", desc: "主要筋群を30秒ずつじっくり伸ばす" },
  { id: 18, name: "振り返りミーティング", category: "クールダウン", duration: 5, players: "全員", icon: "💬", desc: "今日の良かった点・改善点を共有" },
];

const CATEGORIES = ["ウォームアップ", "パス", "ドリブル", "シュート", "ゲーム", "クールダウン"];

const CAT_COLOR = {
  "ウォームアップ": { bg: "#fff3e0", border: "#ff9800", text: "#e65100", dark: "#ff9800" },
  "パス":         { bg: "#e3f2fd", border: "#2196f3", text: "#0d47a1", dark: "#2196f3" },
  "ドリブル":     { bg: "#fce4ec", border: "#e91e63", text: "#880e4f", dark: "#e91e63" },
  "シュート":     { bg: "#e8f5e9", border: "#4caf50", text: "#1b5e20", dark: "#4caf50" },
  "ゲーム":       { bg: "#ede7f6", border: "#7c4dff", text: "#4a148c", dark: "#7c4dff" },
  "クールダウン": { bg: "#e0f7fa", border: "#00bcd4", text: "#006064", dark: "#00bcd4" },
};

export default function App() {
  const [menu, setMenu] = useState([]);
  const [selectedCat, setSelectedCat] = useState("ウォームアップ");
  const [view, setView] = useState("build"); // build | preview
  const [menuTitle, setMenuTitle] = useState("今日の練習メニュー");
  const [dragOver, setDragOver] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const filteredDrills = DRILL_LIBRARY.filter(d => d.category === selectedCat);

  const addDrill = (drill) => {
    setMenu(prev => [...prev, { ...drill, uid: Date.now() + Math.random(), note: "" }]);
  };

  const removeDrill = (uid) => {
    setMenu(prev => prev.filter(d => d.uid !== uid));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setMenu(prev => { const a = [...prev]; [a[index-1], a[index]] = [a[index], a[index-1]]; return a; });
  };

  const moveDown = (index) => {
    if (index === menu.length - 1) return;
    setMenu(prev => { const a = [...prev]; [a[index], a[index+1]] = [a[index+1], a[index]]; return a; });
  };

  const updateNote = (uid, note) => {
    setMenu(prev => prev.map(d => d.uid === uid ? { ...d, note } : d));
  };

  const totalTime = menu.reduce((sum, d) => sum + d.duration, 0);

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", background: "#f0f4f8", minHeight: "100vh", maxWidth: 500, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a3a2a 0%, #0f2d1f 100%)", padding: "18px 20px 14px", position: "sticky", top: 0, zIndex: 20, boxShadow: "0 2px 12px #0008" }}>
        <div style={{ fontSize: 10, color: "#4caf50", letterSpacing: 3, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Soccer Coach</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 19, fontWeight: 900, color: "#fff" }}>練習メニュービルダー</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "#4caf5022", border: "1px solid #4caf5066", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 700, color: "#4caf50" }}>
              ⏱ {totalTime}分
            </div>
          </div>
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", marginTop: 12, background: "#ffffff18", borderRadius: 10, padding: 3, gap: 3 }}>
          {[{ id: "build", label: "🔧 ビルド" }, { id: "preview", label: "📋 プレビュー" }].map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{ flex: 1, padding: "7px", background: view === v.id ? "#fff" : "none", border: "none", borderRadius: 8, color: view === v.id ? "#1a3a2a" : "#ffffff88", fontWeight: view === v.id ? 700 : 400, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* BUILD VIEW */}
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
                    {/* Order buttons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <button onClick={() => moveUp(i)} style={{ background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", fontSize: 12, color: i === 0 ? "#ddd" : "#6b8fa8", padding: "1px 4px", lineHeight: 1 }}>▲</button>
                      <button onClick={() => moveDown(i)} style={{ background: "none", border: "none", cursor: i === menu.length-1 ? "default" : "pointer", fontSize: 12, color: i === menu.length-1 ? "#ddd" : "#6b8fa8", padding: "1px 4px", lineHeight: 1 }}>▼</button>
                    </div>

                    {/* Number */}
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
                      <button onClick={() => setEditingId(editingId === drill.uid ? null : drill.uid)} style={{ background: editingId === drill.uid ? "#e3f2fd" : "#f0f4f8", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", fontSize: 12 }}>✏️</button>
                      <button onClick={() => removeDrill(drill.uid)} style={{ background: "#fce4ec", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", fontSize: 12 }}>✕</button>
                    </div>
                  </div>

                  {/* Note editor */}
                  {editingId === drill.uid && (
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

          {/* Divider */}
          <div style={{ margin: "4px 16px 12px", borderTop: "1px solid #dde8f0" }} />

          {/* Drill Library */}
          <div style={{ padding: "0 16px 24px" }}>
            <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>ドリルを追加</div>

            {/* Category tabs */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }}>
              {CATEGORIES.map(cat => {
                const c = CAT_COLOR[cat];
                return (
                  <button key={cat} onClick={() => setSelectedCat(cat)} style={{
                    flexShrink: 0,
                    padding: "6px 12px",
                    background: selectedCat === cat ? c.dark : "#fff",
                    border: `1.5px solid ${selectedCat === cat ? c.dark : "#dde8f0"}`,
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    color: selectedCat === cat ? "#fff" : "#6b8fa8",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}>
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Drill cards */}
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
                      <button onClick={() => addDrill(drill)} style={{
                        background: `linear-gradient(135deg, ${c.dark}, ${c.dark}cc)`,
                        border: "none", borderRadius: 10,
                        color: "#fff", fontWeight: 700, fontSize: 20,
                        width: 36, height: 36,
                        cursor: "pointer", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 2px 8px ${c.dark}44`,
                        transition: "transform 0.1s",
                      }}>
                        +
                      </button>
                    </div>
                    {already > 0 && (
                      <div style={{ background: c.bg, padding: "3px 14px", fontSize: 10, color: c.text, fontWeight: 600 }}>
                        ✓ メニューに{already}回追加済み
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW VIEW */}
      {view === "preview" && (
        <div style={{ padding: 16 }}>
          {/* Title */}
          <input
            value={menuTitle}
            onChange={e => setMenuTitle(e.target.value)}
            style={{ width: "100%", fontSize: 18, fontWeight: 900, color: "#1a2a3a", border: "none", borderBottom: "2px solid #4caf50", background: "transparent", padding: "6px 0", marginBottom: 16, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
          />

          {/* Summary */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { label: "合計時間", value: `${totalTime}分`, icon: "⏱" },
              { label: "項目数", value: `${menu.length}個`, icon: "📋" },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "10px 14px", textAlign: "center", border: "1px solid #dde8f0" }}>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#1a3a2a" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#8aa" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Category time breakdown */}
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
                      <div style={{ width: `${(catTime / totalTime) * 100}%`, height: "100%", background: c.dark, borderRadius: 4, transition: "width 0.5s" }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: c.text, width: 36, textAlign: "right" }}>{catTime}分</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Menu list */}
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
                      <div style={{ fontSize: 12, fontWeight: 900, color: "#fff", background: c.dark, borderRadius: 6, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: 18 }}>{drill.icon}</span>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#1a2a3a" }}>{drill.name}</div>
                      <div style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: c.text, background: c.bg, borderRadius: 6, padding: "2px 8px" }}>
                        {drill.duration}分
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#6b8fa8", marginLeft: 32, lineHeight: 1.5 }}>{drill.desc}</div>
                    {drill.note && (
                      <div style={{ marginTop: 8, marginLeft: 32, padding: "7px 10px", background: "#fffbea", borderRadius: 8, borderLeft: "3px solid #ffc107", fontSize: 12, color: "#6b5000", lineHeight: 1.5 }}>
                        📝 {drill.note}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 10, marginTop: 6, marginLeft: 32 }}>
                      <span style={{ fontSize: 10, color: "#8aa", fontWeight: 600 }}>👥 {drill.players}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {menu.length > 0 && (
            <div style={{ marginTop: 8, background: "linear-gradient(135deg, #1a3a2a, #0f2d1f)", borderRadius: 14, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#4caf50", fontWeight: 700, marginBottom: 4 }}>🏁 練習終了</div>
              <div style={{ fontSize: 12, color: "#ffffff88" }}>お疲れさまでした！合計 {totalTime}分</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
