import Head from 'next/head';
import styles from '../styles/Home.module.css';
import PageTransition from "../components/PageTransition";
import Link from 'next/link';
import Image from 'next/image';

type IndexPageProps = {};
type IndexPageRef = React.ForwardedRef<HTMLDivElement>;

export default function IndexPage(props: IndexPageProps, ref: IndexPageRef) {

  return (
    <div className={styles.container}>

      <PageTransition ref={ref}>
        <Head>
          <title>CLOVER.</title>
          <link rel="icon" href="/61532173-four-leaf-clover-icon.jpg" />
        </Head>

        <main>

          <div className="IndexPage">
            <Link href="./cloverindex">
              <Image
                src="/UMGJwOh.gif"
                layout="fill"
                objectFit="cover"
                alt="tet"
              />
            </Link>
          </div>
        </main>

        <style jsx>{`
          main {
            padding: 0;
            margin: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
          }

          .IndexPage {
            position: relative;
            width: 100%;
            height: 100%;
            z-index: 1;
          }

          .IndexPage :global(img) {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}</style>

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
      </PageTransition>
    </div>
  );
}
