function CardResponse(props) {
  return (
    <div className="bg-white w-72 h-80 rounded-md border-2 border-[#323232] shadow-[4px_4px_#323232] font-semibold flex flex-col justify-evenly items-center">
      <p>Your result.</p>
      <h1 className="text-center text-pretty">
        {props.data ? props.data.message : "Please enter a url to fetch data."}
      </h1>
    </div>
  );
}

export default CardResponse;
