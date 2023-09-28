export default function CardCaption({ children, className = "" }) {
  return <h2 className={" font-light text-sm " + className}>{children}</h2>;
}
