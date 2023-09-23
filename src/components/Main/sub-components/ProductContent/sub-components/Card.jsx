export default function Card({ children, className }) {
  return <div className={"p-4 hover:bg-secondary/40  rounded-md transition-all flex flex-col bg-primary " + className}>{children}</div>;
}
