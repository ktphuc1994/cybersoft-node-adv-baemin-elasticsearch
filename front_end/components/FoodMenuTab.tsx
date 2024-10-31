import Link from 'next/link';

type Props = {
  isActive?: boolean;
  href?: string;
  label?: string;
};

const FoodMenuTab = ({ isActive, href = '#', label }: Props) => {
  const activeClassName = isActive ? 'bg-[#959595] text-white' : '';

  return (
    <li className={`cursor-pointer w-fit px-1 ${activeClassName}`}>
      <Link href={href}>{label}</Link>
    </li>
  );
};

export { FoodMenuTab };
