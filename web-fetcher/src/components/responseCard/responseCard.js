import React from "react";

function CardResponse(props) {
  return (
    <div className="bg-white w-72 h-80 xl:w-[22rem] xl:h-[25rem] rounded-md border-2 border-[#323232] shadow-[4px_4px_#323232] font-semibold flex flex-col justify-evenly items-center max-[430px]:mb-16">
      <p>Your result.</p>
      {props.isLoading ? (
        <p>Loading...</p>
      ) : props.error ? (
        <>
          <p className="text-red-600 text-center text-pretty">{props.error}</p>
          <p className="text-red-600 text-center text-pretty">
            Please check your url
          </p>
        </>
      ) : (
        <h1 className="text-center text-pretty">
          {props.data
            ? props.data.message
            : "Please enter a URL to fetch data."}
        </h1>
      )}
      <button
        onClick={props.openPopup}
        className="p-2.5 bg-black hover:bg-gray-700 text-white shadow-[1.5px_1.5px_#5C5C5C]"
      >
        Show content
      </button>
    </div>
  );
}

export default CardResponse;
