export default function Navlists({ children, className = "" }) {
  return <ul className={`flex text-white ` + className}>{children}</ul>;
}
