import React from "react";

class Main extends React.Component {
  render() {
    return (
      <div className="w-screen h-screen flex flex-col justify-evenly items-center max-[430px]:justify-self-auto">
        <div className="w-full h-auto flex flex-col justify-center items-center max-[430px]:p-12">
          <img
            src="https://www.svgrepo.com/show/69948/rat-looking-right.svg"
            alt="ratIcon"
            className="w-12 h-12"
          />
          <h1 className="text-6xl max-[430px]:text-3xl">Web Fetcher</h1>
          <p className=" text-lg max-[430px]:text-sm">
            Utility tool for everyone!
          </p>
        </div>
        <div className="w-full h-auto flex flex-row justify-center gap-60 max-[430px]:flex-wrap">
          <div className="bg-white w-60 h-80 rounded-xl shadow-md flex justify-center items-evenly max-[430px]:-mb-48">
            <p>Your url input.</p>
          </div>
          <div className="bg-white w-60 h-80 rounded-xl shadow-md flex justify-center items-evenly">
            <p>Your result.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
