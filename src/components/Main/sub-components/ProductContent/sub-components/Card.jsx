export default function Card({ children, className = "", onClick = {} }) {
  return (
    <div onClick={onClick} className={"p-4   rounded-md transition-all flex flex-col  " + className}>
      {children}
    </div>
  );
}
