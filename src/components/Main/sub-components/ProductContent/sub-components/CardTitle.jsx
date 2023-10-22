export default function CardTitle({ children, className }) {
  return <h2 className={"text-medium font-semibold text-lg md:text-xl line-clamp-2 " + className}>{children}</h2>;
}
