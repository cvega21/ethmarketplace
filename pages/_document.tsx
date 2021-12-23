import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link href="https://fonts.googleapis.com/css2?family=Gemunu+Libre:wght@600&display=swap" rel="stylesheet"></link>
          {/* <link href="https://fonts.googleapis.com/css2?family=Teko:wght@300&display=swap" rel="stylesheet"/> */}
        </Head>
        <body className='bg-gray-900'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument