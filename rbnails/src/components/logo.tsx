import Link from "next/link";

export default function Logo() {
  return (
    <div>
      <Link href="/">
        <figure className="logo">
          <p>Rafa Bach</p>
          <span> Nail&apos;s</span>
        </figure>
      </Link>
    </div>
  );
}
