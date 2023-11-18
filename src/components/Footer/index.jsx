function Footer() {
  return (
    <div className="w-full  flex items-center justify-center bg-back mt-20">
      <div className="md:w-2/3 w-full px-10 text-white flex flex-col">
        <div className="flex flex-col">
          <hr className="border-gray-600" />
          <p className="w-full text-center my-5 text-gray-600">Copyright © {new Date().getFullYear()} Losiento Supply</p>
        </div>
      </div>
    </div>
  )
}

export default Footer
