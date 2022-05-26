import Link from "next/link";

var startTime = performance.now();

export async function getServerSideProps() {
  const min = 47144;
  const max = 48143;

  const randNumber = Math.floor(Math.random() * (max - min + 1) + min);

  const res = await fetch(
    `https://personal-mongo.herokuapp.com/quotes/${randNumber}`
  );

  const data = await res.json();

  return { props: { data } };
}

export function ServerSide({ data }) {
  var endTime = performance.now();

  const time = Math.round(endTime - startTime);
  return (
    <div>
      <Link href="/">
        <button>Home</button>
      </Link>
      <h3>This is Server Side Rendered Section</h3>
      <p>{data.quote}</p>
      <p>
        <strong>{data.author}</strong>
      </p>
      <p suppressHydrationWarning>Completed in {time} milliseconds</p>
    </div>
  );
}

export default ServerSide;
