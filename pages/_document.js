// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Pi SDK - Quan trọng để Pi Network hoạt động */}
        <script
          src="https://sdk.minepi.com/pi-sdk.js"
          defer
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
