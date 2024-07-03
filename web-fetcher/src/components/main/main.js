import React from "react";
import CardResponse from "../responseCard/responseCard";
import CardRequest from "../../requestCard/requestCard";

class Main extends React.Component {
  state = {
    data: null,
  };

  handleDataChange = (data) => {
    this.setState({ data });
  };

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
          <CardRequest onDataChange={this.handleDataChange} />
          <CardResponse data={this.state.data} />
        </div>
      </div>
    );
  }
}

export default Main;
