import ReactDOM from "react-dom"
export default function Modal({ children, setIsOpen }) {
  const close = () => {
    setIsOpen(() => {
      return false
    })
    document.body.className = ""
  }
  return ReactDOM.createPortal(
    <>
      <div onClick={close} className="cursor-pointer bg-back/75 fixed top-0 right-0 left-0 bottom-0"></div>
      <div className="z-50 w-[90vw] sm:w-3/4  fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2   text-white">{children}</div>
    </>,
    document.getElementById("portal")
  )
}
