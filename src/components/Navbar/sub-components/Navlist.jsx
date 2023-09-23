import { Link } from "react-router-dom";

export default function Navlist({ to, children, className }) {
  return (
    <li>
      <Link to={to ? `${to}` : "#"} className={"pl-2 " + className}>
        {children}
      </Link>
    </li>
  );
}
