import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ProductInfo from "../components/ProductInfo";
import RatingBox from "../components/RatingBox";
import styles from "../styles/Home.module.css";
import StatsDisplay from "./StatsDisplay";
import Feature2 from "./Feature2";

export default function Layout({
  featuresToShow,
}: {
  featuresToShow: ("Feature2" | "ProductInfo" | "RatingBox")[];
}) {
  const router = useRouter();
  const name = router.pathname.split("/")[0];
  return (
    <div className={styles.container}>
      <Head>
        <title>Cache Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <h1 className={styles.title}>{name} Cache Test</h1>
          <h2>Features</h2>
          {featuresToShow.includes("Feature2") && <Feature2 />}
          {!featuresToShow.includes("Feature2") && <div>--</div>}

          {featuresToShow.includes("ProductInfo") && <ProductInfo />}
          {!featuresToShow.includes("ProductInfo") && <div>--</div>}

          {featuresToShow.includes("RatingBox") && <RatingBox />}
          {!featuresToShow.includes("RatingBox") && <div>--</div>}

          <h2>Reload Links</h2>
          <a href="/" data-testid="reload-index">
            Index
          </a>
          <br />
          <a href="/overfetch" data-testid="reload-overfetch">
            Overfetch
          </a>
          <br />
          <a href="/underfetch" data-testid="reload-underfetch">
            Underfetch
          </a>
          <br />
          <h2>Next Links</h2>
          <Link href="/">
            <a data-testid="next-index">Index</a>
          </Link>
          <br />
          <Link href="/overfetch">
            <a data-testid="next-overfetch">Overfetch</a>
          </Link>
          <br />
          <Link href="/underfetch">
            <a data-testid="next-underfetch">Underfetch</a>
          </Link>
          <h2>Client Stats</h2>
          <StatsDisplay />
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
