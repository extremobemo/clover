// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        <meta property="og:title" content="CLOVER NYC" />
        <meta property="og:image" content="https://res.cloudinary.com/ddlip2prr/image/upload/v1739345817/WEBGRAPH.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:type" content="website" />
          {/* Other head elements */}
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id="modal-root"></div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
