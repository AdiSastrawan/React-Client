export default function CardTitle({ children, className }) {
  return (
    <div className={"text-medium font-semibold text-lg md:text-xl " + className}>
      <h2>{children}</h2>
    </div>
  );
}
