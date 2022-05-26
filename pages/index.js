import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Next Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Link href="/">
          <button>Home</button>
        </Link>
        <Link href="/serversiderendered">
          <button>Server Side Rendered Page</button>
        </Link>
        <Link href="/clientsiderendered">
          <button>Client Side Rendered Page</button>
        </Link>
      </main>
    </div>
  );
}
