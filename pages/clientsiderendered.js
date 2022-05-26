import useSWR from "swr";
import Link from "next/link";

var startTime = performance.now();

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const min = 47144;
const max = 48143;

const randNumber = Math.floor(Math.random() * (max - min + 1) + min);

export function ClientsideFetch() {
  const { data, error } = useSWR(
    `https://personal-mongo.herokuapp.com/quotes/${randNumber}`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <p>{data.quote}</p>
      <p>
        <strong>{data.author}</strong>
      </p>
    </div>
  );
}

export default function clientsiderendered() {
  var endTime = performance.now();
  const time = Math.round(endTime - startTime);
  return (
    <div>
      <Link href="/">
        <button>Home</button>
      </Link>

      <h3>This is Client Side Rendered Section</h3>
      <ClientsideFetch />
      <p suppressHydrationWarning>Completed in {time} milliseconds</p>
    </div>
  );
}
