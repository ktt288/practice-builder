"use client";
import { useState } from "react";

const DRILL_LIBRARY = [
  // ウォームアップ
  {
    id: 1, name: "ジョギング", category: "ウォームアップ", duration: 5, players: "全員", icon: "🏃",
    desc: "グラウンド2周、徐々にペースアップ",
    theme: "体を温め、練習への集中力を高める",
    rules: "ペースは指示に従う。追い越し禁止。最後の1周はペースアップ。",
    howTo: "①全員でグラウンドの外周に集合 ②コーチの合図でゆっくりスタート ③1周目は会話できる程度のペース ④2周目で少しペースアップ ⑤最後の直線は軽くスプリント",
    coaching: ["声を出してコミュニケーションを取ろう", "前の選手についていく意識を持つ", "息が上がっても諦めずに走りきる"],
    teaching: ["かかとから着地せずつま先〜中足部で着地する", "腕をコンパクトに振る", "体幹を真っ直ぐ保つ"],
  },
  {
    id: 2, name: "動的ストレッチ", category: "ウォームアップ", duration: 5, players: "全員", icon: "🤸",
    desc: "股関節・膝・足首をほぐす",
    theme: "可動域を広げてケガを予防する",
    rules: "反動をつけず、各動作を丁寧に行う。痛みを感じたら無理しない。",
    howTo: "①レッグスイング（前後・横）各10回 ②ランジウォーク10歩 ③カリオカステップ10m往復 ④ハイニー10歩 ⑤バットキック10歩",
    coaching: ["動作の目的を意識して丁寧に行う", "仲間と合わせてリズムよく動く", "痛みや違和感があればすぐに申告する"],
    teaching: ["股関節を大きく回す意識", "体重移動をスムーズに", "バランスを崩さないよう体幹を使う"],
  },
  {
    id: 3, name: "鬼ごっこ", category: "ウォームアップ", duration: 8, players: "全員", icon: "😈",
    desc: "ボールなしで動きを活性化",
    theme: "素早い方向転換と判断力を養う",
    rules: "20m×20mのエリア内で行う。エリア外に出たら自動的に鬼になる。タッチされたら鬼交代。",
    howTo: "①エリアをマーカーで設定 ②最初の鬼を1〜2人決める ③笛の合図でスタート ④タッチされたら鬼を交代 ⑤最後に鬼になった人は罰ゲーム（腕立て5回など）",
    coaching: ["常に周りを見て逃げるルートを探す", "鬼は追い込む動きを仲間と連携して行う", "全力で取り組む"],
    teaching: ["低い重心で素早い方向転換", "フェイントを使って相手を惑わす", "加速・減速のメリハリをつける"],
  },

  // パス
  {
    id: 4, name: "2人組パス", category: "パス", duration: 10, players: "2人1組", icon: "✅",
    desc: "10mの距離でインサイドパスの確認",
    theme: "正確なインサイドパスの基礎習得",
    rules: "フリータッチ。インサイドのみ使用。ボールが止まった場合は相手に渡す。",
    howTo: "①10mの距離にマーカーを置く ②片方がパスしたら動いて受け直す ③2分ごとに役割（動く側・止まる側）を交代 ④慣れたら距離を15mに広げる",
    coaching: ["パスを出した後に動く習慣をつける", "アイコンタクトで意思疎通する", "受け手は体を開いてボールを迎える"],
    teaching: ["足首を固定してインサイドの面でしっかり蹴る", "軸足をボールの横に置く", "フォロースルーを意識する"],
  },
  {
    id: 5, name: "三角パス", category: "パス", duration: 12, players: "3人1組", icon: "🔺",
    desc: "ワンタッチ・ツータッチを切り替え",
    theme: "素早いボール回しとサポートの動き",
    rules: "マーカーを三角形に配置（各辺8〜10m）。コーチの指示でワンタッチ・ツータッチを切り替える。",
    howTo: "①三角形にマーカーを設置し各頂点に選手を配置 ②時計回りでパス回し ③2分でワンタッチ、2分でツータッチ ④慣れたら反時計回りも行う ⑤ファーストタッチで次のパスの方向を準備する",
    coaching: ["常にボールを受ける準備をする", "パスコースを切られる前に素早く動く", "声でコミュニケーションを取る"],
    teaching: ["ファーストタッチを次のプレーの方向に置く", "体の向きを意識してオープンに受ける", "パスのタイミングと強さを合わせる"],
  },
  {
    id: 6, name: "菱形パス回し", category: "パス", duration: 15, players: "4人1組", icon: "♦️",
    desc: "ダイヤモンド形にコーンを置きパス&ムーブ",
    theme: "パスアンドムーブとポジショニング",
    rules: "ダイヤモンド（菱形）に4つのマーカーを設置（各辺10m）。パスを出したら必ず動く。中央に1人サーバーを置いてもよい。",
    howTo: "①菱形にマーカーを設置 ②各頂点に選手を1人配置 ③右回りでパスしたら次の頂点へ走る ④3分ごとに方向を逆にする ⑤発展：中央の選手を経由するパターンを追加",
    coaching: ["パスの後に次のポジションへ積極的に動く", "受け手は常にボールに向かって動きながら受ける", "全体のリズムを合わせる"],
    teaching: ["パスと同時に走り出す（ワンツーの原理）", "受ける角度を工夫して相手に取られにくい体の向きを作る", "距離と強さを正確に合わせたパス"],
  },
  {
    id: 7, name: "リターンパス", category: "パス", duration: 10, players: "2人1組", icon: "↩️",
    desc: "壁パス（ワンツー）の連続練習",
    theme: "ワンツーパスによる突破の習得",
    rules: "1対0で行う。Aがパスを出しBがリターン。Aはリターンを受けてゴールへ向かう（またはマーカーを通過）。",
    howTo: "①AとBを7〜8m離れて配置 ②AがドリブルでアプローチしながらBへパス ③Bはワンタッチでリターン ④Aはリターンを受けてスペースへ抜ける ⑤2分で役割交代",
    coaching: ["パスを出すタイミングを早くする", "リターンを受けた後の動き出しを素早く", "声でワンツーを要求する"],
    teaching: ["斜め方向にパスしてリターンは裏へ", "ファーストタッチで相手を剥がす", "体の向きを意識してリターンを受ける"],
  },

  // ドリブル
  {
    id: 8, name: "コーンドリブル", category: "ドリブル", duration: 10, players: "個人", icon: "🔥",
    desc: "5本のコーンをジグザグドリブル",
    theme: "ボールタッチとボールコントロールの向上",
    rules: "2m間隔でコーンを5本直線に並べる。ジグザグにドリブルして往復。足のどの部分を使ってもよい。",
    howTo: "①2m間隔でコーンを5本設置 ②ボールを足元に置いてスタート ③ジグザグにコーンを交わしながらドリブル ④折り返してスタート地点に戻る ⑤インサイド、アウトサイド、インステップなど使う部位を変えてチャレンジ",
    coaching: ["コーンに当てても気にせず続ける", "スピードより正確さを優先する", "ドリブルしながら顔を上げる意識を持つ"],
    teaching: ["ボールを体の近くに置く（ボールを離さない）", "細かいタッチで方向を変える", "軸足でしっかり踏み込んでから方向転換"],
  },
  {
    id: 9, name: "1対1", category: "ドリブル", duration: 15, players: "2人1組", icon: "⚔️",
    desc: "5m×10mのエリアで1対1突破",
    theme: "ドリブル突破とディフェンスの対人技術",
    rules: "5m×10mのエリアを設定。攻撃側は相手を抜いてエンドラインを通過すれば得点。制限時間は30秒。攻守を交代して行う。",
    howTo: "①マーカーでエリアを設定 ②攻撃側がボールを持ってスタート ③ディフェンスはエンドラインを守る ④30秒で攻守交代 ⑤3本ずつ行い成功数を競う",
    coaching: ["攻撃：積極的に仕掛ける ②ディフェンス：簡単に抜かれない粘り強さ", "コンタクトを恐れずにチャレンジする", "失敗を恐れず積極的にフェイントを使う"],
    teaching: ["攻撃：体重移動を使ったフェイント、コース取り", "ディフェンス：半身の姿勢、間合いの取り方", "ボールを足元に置きすぎず、少し前に出す"],
  },
  {
    id: 10, name: "ドリブルリレー", category: "ドリブル", duration: 10, players: "チーム", icon: "🏅",
    desc: "チームに分かれてドリブルリレー競争",
    theme: "ボールコントロールとチームの一体感",
    rules: "2〜3チームに分かれる。折り返し地点まで20mのドリブルリレー。ボールをコントロールしながら素早く往復する。",
    howTo: "①チームに分かれて1列に並ぶ ②先頭がドリブルでスタート ③折り返し地点（20m先）でUターン ④スタート地点に戻ったら次の選手に手渡し ⑤全員が終わったチームの勝ち",
    coaching: ["チームメイトを大きな声で応援する", "勝敗よりも正確なドリブルを意識する", "ルールを守って公正に競う"],
    teaching: ["切り返しをスムーズに行うためのステップワーク", "スピードに乗ったときのボールの置き場所", "加速時は大きなタッチ、減速・転換時は細かいタッチ"],
  },

  // シュート
  {
    id: 11, name: "シュート練習", category: "シュート", duration: 15, players: "全員", icon: "⚽",
    desc: "GKなしでコーナーにコーンゴール",
    theme: "シュートの精度と枠内シュート率の向上",
    rules: "ペナルティエリア付近からシュート。コーンゴール（コーンを2本立てて幅2mのゴール）を狙う。1人3本ずつ。",
    howTo: "①ゴールの4隅にコーンゴールを設置 ②ペナルティエリア付近にボールを置く ③コーチが「右コーナー」などコースを指示 ④選手はシュートを打つ ⑤3本打ったら後ろに並ぶ",
    coaching: ["シュートのコースを考えてから打つ", "外しても気にしないでどんどん打つ", "GKがいると思ってコースを狙う"],
    teaching: ["インステップキックの正しい当て方（甲の部分）", "軸足の位置（ボールの横、少し後ろ）", "フォロースルーで高さをコントロール"],
  },
  {
    id: 12, name: "GKありシュート", category: "シュート", duration: 15, players: "全員", icon: "🥅",
    desc: "ペナルティエリアからのシュート",
    theme: "GKを意識したシュートの判断力と決定力",
    rules: "GK付きで実施。シューターはペナルティエリア内からシュート。GKは通常のルールに従う。1人2本ずつ。",
    howTo: "①GKをゴールに配置 ②シューターがペナルティエリア外からドリブルで入る ③GKの動きを見てシュートコースを選択 ④インサイドまたはインステップでシュート ⑤全員が2本打ったら次のラウンドへ",
    coaching: ["GKをよく見てからシュートを打つ", "コースが消えていたら無理に打たない勇気も大切", "GKは積極的に前に出てシュートコースを消す"],
    teaching: ["GKの立ち位置を確認するタイミング", "フェイントを入れてGKを動かしてからシュート", "GKの手が届かない場所（ニア下・ファー）を狙う"],
  },
  {
    id: 13, name: "クロス&シュート", category: "シュート", duration: 15, players: "全員", icon: "🎯",
    desc: "サイドからのクロスに合わせてシュート",
    theme: "クロスボールへの合わせ方とタイミング",
    rules: "クロスを上げる選手とシュートを打つ選手に分かれる。クロスはファーサイドを目標に上げる。シューターはペナルティエリア内に走り込む。",
    howTo: "①サイドにクロス要員、中央にシューター要員が並ぶ ②クロス要員がサイドを突破してクロス ③シューター要員は走り込みのタイミングを合わせる ④シュート後はポジションを入れ替える ⑤左右両サイドから行う",
    coaching: ["クロスを上げる選手と呼吸を合わせる", "ゴール前への積極的な走り込みを習慣にする", "シュートを打てなくても動き続ける"],
    teaching: ["走り込みのタイミング（クロスが出る前に動き出す）", "クロスボールへのヘディングとボレーの技術", "ニアとファーの使い分け"],
  },

  // ゲーム形式
  {
    id: 14, name: "3対3", category: "ゲーム", duration: 20, players: "6人", icon: "🟢",
    desc: "小さいゴールで素早い判断を養う",
    theme: "少人数での素早い判断とコンビネーション",
    rules: "20m×20mのエリア。ミニゴール（またはコーンゴール）を使用。GKなし。オフサイドなし。出た場合は投げ入れまたはキックイン。",
    howTo: "①エリアとゴールを設置 ②3対3で試合開始 ③ゴールが決まったらGKエリアからリスタート ④5分ゲームを2セット行う ⑤得点が多いチームの勝ち",
    coaching: ["ボールを持っていない時の動きを意識する", "プレッシャーに動じず冷静にプレーする", "チームで声を掛け合う"],
    teaching: ["数的優位を作るポジショニング", "プレスのかけ方と連動した守備", "狭いスペースでのターン・反転技術"],
  },
  {
    id: 15, name: "4対4", category: "ゲーム", duration: 20, players: "8人", icon: "🔵",
    desc: "ポゼッションを意識した形式",
    theme: "ボール保持とポジションバランスの意識",
    rules: "30m×25mのエリア。フルゴール（またはコーンゴール）2つ。GKなし。ボールがエリア外に出たらキックイン。",
    howTo: "①エリアとゴールを設置 ②4対4で試合開始 ③ポゼッション率を意識してゲームを行う ④7分ゲームを2セット ⑤コーチは動きの改善点を随時フィードバック",
    coaching: ["ボールを奪われたらすぐにプレスバック", "ボールを持ったら落ち着いてプレーする", "チームとしての約束事を守る"],
    teaching: ["ビルドアップ時のポジショニング（三角形を作る）", "プレスをかけるタイミングと方法", "サポートの距離と角度"],
  },
  {
    id: 16, name: "紅白戦", category: "ゲーム", duration: 30, players: "全員", icon: "🏆",
    desc: "実戦形式。今日の練習テーマを意識して",
    theme: "今日の練習テーマを試合で実践する",
    rules: "通常のサッカールールに従う。ハンドは取らない（小学生対象の場合）。スローインあり。オフサイドは状況に応じて判断。",
    howTo: "①チームを均等に分ける ②コーチが今日のテーマを再確認 ③15分ハーフで試合 ④ハーフタイムにコーチから修正点を伝える ⑤試合後に振り返り",
    coaching: ["試合中でも声を出し続ける", "ミスを引きずらず次のプレーに集中する", "チームとして戦う意識を持つ"],
    teaching: ["今日練習したスキルを実戦で使う勇気", "状況に応じた判断（ドリブルかパスか）", "ゲームの流れを読む力"],
  },

  // クールダウン
  {
    id: 17, name: "静的ストレッチ", category: "クールダウン", duration: 8, players: "全員", icon: "🧘",
    desc: "主要筋群を30秒ずつじっくり伸ばす",
    theme: "疲労回復とケガ予防のためのクールダウン",
    rules: "反動をつけない。痛気持ちいい程度でキープ。呼吸を止めない。",
    howTo: "①大腿四頭筋（前もも）左右30秒 ②ハムストリング（裏もも）左右30秒 ③ふくらはぎ左右30秒 ④股関節（鳩のポーズ）左右30秒 ⑤体幹・背中のストレッチ30秒",
    coaching: ["急いでやらず、しっかりキープする", "ストレッチの重要性を理解して取り組む", "痛みを感じたら無理せず報告する"],
    teaching: ["各筋群の場所と役割を理解する", "正しいフォームでストレッチする", "呼吸に合わせて筋肉をリラックスさせる"],
  },
  {
    id: 18, name: "振り返りミーティング", category: "クールダウン", duration: 5, players: "全員", icon: "💬",
    desc: "今日の良かった点・改善点を共有",
    theme: "自己評価と次回への意識づけ",
    rules: "全員が輪になって座る。コーチが進行。選手は積極的に発言する。批判はしない（改善提案はOK）。",
    howTo: "①輪になって座る ②コーチ：今日のテーマへの取り組みを振り返る ③コーチが良かった点を2〜3つ挙げる ④選手に「今日できたこと」を1人1言発表させる ⑤次回の練習への目標を1つ設定して終了",
    coaching: ["発言を恐れず、積極的に意見を言う", "仲間の発言をしっかり聞く", "目標は具体的に設定する"],
    teaching: ["自己評価の方法（良かった点・改善点）", "目標設定の仕方（具体的・測定可能）", "振り返りが上達に繋がる理由"],
  },
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

function DetailSection({ icon, label, content }) {
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

export default function App() {
  const [menu, setMenu] = useState([]);
  const [selectedCat, setSelectedCat] = useState("ウォームアップ");
  const [view, setView] = useState("build"); // build | preview | saved
  const [menuTitle, setMenuTitle] = useState("今日の練習メニュー");
  const [editingId, setEditingId] = useState(null);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [savedMenus, setSavedMenus] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("practice_menus_v1") ?? "[]");
    } catch {
      return [];
    }
  });
  const [saveFlash, setSaveFlash] = useState(false);

  const filteredDrills = DRILL_LIBRARY.filter(d => d.category === selectedCat);
  const totalTime = menu.reduce((sum, d) => sum + d.duration, 0);

  const persistMenus = (next) => {
    setSavedMenus(next);
    localStorage.setItem("practice_menus_v1", JSON.stringify(next));
  };

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

  const saveMenu = () => {
    if (menu.length === 0) return;
    const newMenu = {
      id: Date.now(),
      title: menuTitle,
      savedAt: new Date().toISOString(),
      totalTime,
      items: menu,
    };
    persistMenus([newMenu, ...savedMenus]);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  const loadMenu = (sm) => {
    setMenu(sm.items);
    setMenuTitle(sm.title);
    setView("build");
  };

  const deleteMenu = (id) => {
    persistMenus(savedMenus.filter(m => m.id !== id));
  };

  const openDetail = (drillId) => {
    const drill = DRILL_LIBRARY.find(d => d.id === drillId);
    if (drill) setSelectedDrill(drill);
  };

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
          {[
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
                      <button onClick={() => openDetail(drill.id)} style={{ background: "#f0f4f8", border: "1px solid #dde8f0", borderRadius: 6, padding: "5px 7px", cursor: "pointer", fontSize: 11, fontWeight: 700, color: "#6b8fa8" }}>詳細</button>
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
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                        <button onClick={() => addDrill(drill)} style={{
                          background: `linear-gradient(135deg, ${c.dark}, ${c.dark}cc)`,
                          border: "none", borderRadius: 10,
                          color: "#fff", fontWeight: 700, fontSize: 20,
                          width: 36, height: 36,
                          cursor: "pointer", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: `0 2px 8px ${c.dark}44`,
                        }}>
                          +
                        </button>
                        <button onClick={() => setSelectedDrill(drill)} style={{
                          background: "#f0f4f8", border: "1px solid #dde8f0", borderRadius: 8,
                          fontSize: 10, fontWeight: 700, color: "#6b8fa8",
                          padding: "3px 10px", cursor: "pointer", whiteSpace: "nowrap",
                        }}>
                          詳細
                        </button>
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
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#1a2a3a", flex: 1 }}>{drill.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: c.text, background: c.bg, borderRadius: 6, padding: "2px 8px" }}>
                        {drill.duration}分
                      </div>
                      <button onClick={() => openDetail(drill.id)} style={{ background: "#f0f4f8", border: "1px solid #dde8f0", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#6b8fa8" }}>詳細</button>
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
            <>
              <div style={{ marginTop: 8, background: "linear-gradient(135deg, #1a3a2a, #0f2d1f)", borderRadius: 14, padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#4caf50", fontWeight: 700, marginBottom: 4 }}>🏁 練習終了</div>
                <div style={{ fontSize: 12, color: "#ffffff88" }}>お疲れさまでした！合計 {totalTime}分</div>
              </div>

              {/* Save button */}
              <button onClick={saveMenu} style={{
                marginTop: 12,
                width: "100%",
                padding: "14px",
                background: saveFlash ? "#43a047" : "linear-gradient(135deg, #2e7d32, #1b5e20)",
                border: "none",
                borderRadius: 14,
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.3s",
                boxShadow: "0 2px 12px #2e7d3244",
              }}>
                {saveFlash ? "✅ 保存しました！" : "💾 このメニューを保存する"}
              </button>
            </>
          )}
        </div>
      )}

      {/* SAVED VIEW */}
      {view === "saved" && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: "#6b8fa8", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            保存済みメニュー ({savedMenus.length}件)
          </div>

          {savedMenus.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 14, border: "2px dashed #c8d8e8", color: "#a0b8cc", fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
              まだ保存済みメニューがありません<br />
              <span style={{ fontSize: 12 }}>確認タブでメニューを保存しましょう</span>
            </div>
          )}

          {savedMenus.map(sm => (
            <div key={sm.id} style={{ background: "#fff", borderRadius: 14, marginBottom: 12, border: "1px solid #dde8f0", overflow: "hidden", boxShadow: "0 1px 4px #0001" }}>
              {/* Saved menu header */}
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
                    <button onClick={() => loadMenu(sm)} style={{
                      background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
                      border: "none", borderRadius: 8, color: "#fff",
                      fontSize: 11, fontWeight: 700, padding: "5px 10px", cursor: "pointer",
                    }}>
                      読み込む
                    </button>
                    <button onClick={() => deleteMenu(sm.id)} style={{
                      background: "#fce4ec", border: "none", borderRadius: 8,
                      color: "#c62828", fontSize: 11, fontWeight: 700, padding: "5px 10px", cursor: "pointer",
                    }}>
                      削除
                    </button>
                  </div>
                </div>
              </div>

              {/* Saved menu items */}
              {sm.items.map((item, i) => {
                const c = CAT_COLOR[item.category];
                const libraryDrill = DRILL_LIBRARY.find(d => d.id === item.id);
                return (
                  <div key={item.uid} style={{ display: "flex", alignItems: "center", padding: "8px 14px", borderBottom: i < sm.items.length - 1 ? `1px solid ${c.border}22` : "none", gap: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: c.text, background: c.bg, borderRadius: 4, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1a2a3a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: "#8aa" }}>{item.category} · {item.duration}分</div>
                    </div>
                    {libraryDrill && (
                      <button onClick={() => setSelectedDrill(libraryDrill)} style={{
                        background: "#f0f4f8", border: "1px solid #dde8f0",
                        borderRadius: 6, fontSize: 10, fontWeight: 700,
                        color: "#6b8fa8", padding: "3px 8px", cursor: "pointer", flexShrink: 0,
                      }}>
                        詳細
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* DRILL DETAIL MODAL */}
      {selectedDrill && (
        <div
          onClick={() => setSelectedDrill(null)}
          style={{
            position: "fixed", inset: 0, background: "#000000aa", zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460,
              maxHeight: "85vh", overflowY: "auto",
              boxShadow: "0 8px 40px #0006",
            }}
          >
            {/* Modal header */}
            <div style={{ background: CAT_COLOR[selectedDrill.category].dark, padding: "18px 20px 16px", borderRadius: "20px 20px 0 0", position: "sticky", top: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{selectedDrill.icon}</div>
                  <div style={{ fontSize: 19, fontWeight: 900, color: "#fff" }}>{selectedDrill.name}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: "#ffffff99", background: "#ffffff22", borderRadius: 6, padding: "2px 8px" }}>{selectedDrill.category}</span>
                    <span style={{ fontSize: 11, color: "#ffffff99", background: "#ffffff22", borderRadius: 6, padding: "2px 8px" }}>⏱ {selectedDrill.duration}分</span>
                    <span style={{ fontSize: 11, color: "#ffffff99", background: "#ffffff22", borderRadius: 6, padding: "2px 8px" }}>👥 {selectedDrill.players}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDrill(null)}
                  style={{ background: "#ffffff33", border: "none", borderRadius: 8, color: "#fff", fontSize: 16, padding: "6px 12px", cursor: "pointer", flexShrink: 0 }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal body */}
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
    </div>
  );
}
