import Link from "next/link";

export default function Logo() {
  return (
    <div>
      <Link href="/" passHref className="link-custom">
        <figure className="logo">
          <p>Rafa Bach</p>
          <span>Nails</span>
        </figure>
      </Link>
    </div>
  );
}
