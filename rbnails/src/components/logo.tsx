import Link from "next/link";

export default function Logo() {
  return (
    <div>
      <Link href="/" passHref className="link-custom">
        <figure className="logo">
          <p>Nails</p>
          <span>House</span>
        </figure>
      </Link>
    </div>
  );
}
