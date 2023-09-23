export default function CardCaption({ children, className }) {
  return (
    <div className={"text-center font-light text-sm " + className}>
      <p>{children}</p>
    </div>
  );
}
