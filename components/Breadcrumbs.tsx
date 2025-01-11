import Link from "next/link";

interface Breadcrumb {
  label: string;
  href: string;
}

const Breadcrumbs = ({ items }: { items: Breadcrumb[] }) => {
  return (
    <nav className="mb-4">
      <ol className="list-reset flex text-grey-dark">
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.href} className="text-blue-600 hover:underline">
              {item.label}
            </Link>
            {index < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 