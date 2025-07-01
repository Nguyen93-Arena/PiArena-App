import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Đây là vị trí chính xác để nhúng SDK */}
        <script src="https://sdk.minepi.com/pi-sdk.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
