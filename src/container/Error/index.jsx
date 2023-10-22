function Error() {
  return (
    <div className="w-full h-screen pt-16 flex justify-center items-center flex-col space-y-2">
      <div className=" text-2xl bg-red-600 text-white rounded-full h-12 w-12 flex justify-center items-center">!</div>
      <h1 className="text-white text-4xl">505</h1>
      <h2 className="text-white">Internal Server Error</h2>
    </div>
  );
}

export default Error;
