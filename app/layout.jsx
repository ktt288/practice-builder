export const metadata = {
  title: "練習メニュービルダー",
  description: "サッカー練習メニューを簡単に作成できるツール",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" style={{ overflowY: "scroll" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
