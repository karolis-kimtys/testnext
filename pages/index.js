import Head from "next/head";
import { useState, useEffect, useMemo } from "react";
import styles from "../styles/index.module.css";
import Ably from "ably/promises";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import moment from "moment";

const ably = new Ably.Realtime(process.env.NEXT_PUBLIC_ABLY);

export async function getServerSideProps() {
  const min = 1;
  const max = 48143;

  const randNumber = Math.floor(Math.random() * (max - min + 1) + min);

  const res = await fetch(
    `https://personal-mongo.herokuapp.com/quotes/${randNumber}`
  );

  const quotes = await res.json();

  return { props: { quotes } };
}

export default function Home({ quotes }) {
  const [current, setCurrent] = useState([]);
  const [price, setPrice] = useState([]);
  const [time, setTime] = useState([]);

  let times = useMemo(() => [...time], [time]);
  let prices = useMemo(() => [...price], [price]);

  const channel = ably.channels.get(
    "[product:ably-coindesk/bitcoin]bitcoin:usd"
  );

  useEffect(() => {
    async function subscribe() {
      await channel.subscribe((message) => {
        prices.length >= 300 && prices.shift();

        prices.push(message.data);
        setPrice(prices);

        times.length >= 275 && times.shift();

        times.push(moment(message.timestamp).format("h:mm:ss a"));
        setTime(times);

        setCurrent(message.data);
      });
    }

    subscribe();

    return function cleanup() {
      channel.unsubscribe();
    };
  }, [channel, prices, times]);

  const options = {
    animation: false,
    scales: {
      x: {
        update: "none",
      },
    },
  };

  const data = {
    labels: times,
    datasets: [
      {
        label: `Bitcoin Real Time Price - ${current} USD`,
        data: prices,
        fill: false,
        lineTension: 0.2,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "round",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <Head>
        <html lang="en" />
        <title>Next Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.title}>Next.js sample code</div>

        <div className={styles.ssr}>
          <h4>This is Server Side Rendered Section.</h4>

          <a href="https://nextjs.org/docs/basic-features/pages#server-side-rendering">
            Read more
          </a>
          <h5>
            Below quote has been fetched from MongoDB database from selection of
            70000 quotes. On each page refresh data is prefetched and rendered
            to DOM, thus the reason it is so fast to load. Thanks to Next.js
            server side rendering.
          </h5>
          <div className={styles.box}>
            <p>
              {quotes.quote} - <strong>{quotes.author}</strong>
            </p>
          </div>
        </div>

        <div className={styles.csr}>
          <h4>This is client side rendered section</h4>
          <h5>
            Real time Bitcoin data is fetched from Ably and displayed using
            Chart.js. Ably uses websockets to fetch data and is a real time.
          </h5>
          <div className={styles.box}>
            <Line data={data} width={500} height={400} options={options} />
          </div>
        </div>
      </main>
    </div>
  );
}
