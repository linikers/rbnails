import Link from "next/link";

export default function Logo() {
  return (
    <div>
      <Link href="/">
        <a style={{ textDecoration: "none" }}>
          <figure className="logo">
            <p>Rafa Bach</p>
            <span> Nail&apos;s</span>
          </figure>
        </a>
      </Link>
    </div>
  );
}
