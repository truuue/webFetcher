import React from "react";
import CardResponse from "../responseCard/responseCard";
import CardRequest from "../requestCard/requestCard";
import FetchedContent from "../fetchedContent/fetchedContent";

class Main extends React.Component {
  state = {
    data: null,
    isPopupVisible: false,
    isLoading: false,
    error: null,
  };

  handleDataChange = (data) => {
    this.setState({ data, isLoading: false, error: null });
  };

  handleError = (error) => {
    this.setState({ error, isLoading: false });
  };

  handleLoading = () => {
    this.setState({ isLoading: true });
  };

  openPopup = () => {
    this.setState({ isPopupVisible: true });
  };

  closePopup = () => {
    this.setState({ isPopupVisible: false });
  };

  render() {
    return (
      <div className="w-screen h-screen flex flex-col justify-evenly items-center">
        <div className="w-full h-auto flex flex-col justify-center items-center max-[430px]:m-10">
          <img
            src="https://www.svgrepo.com/show/69948/rat-looking-right.svg"
            alt="ratIcon"
            className="w-12 h-12 max-w-full max-h-full"
          />
          <h1 className="text-6xl max-[430px]:text-3xl">Web Fetcher</h1>
          <p className=" text-lg max-[430px]:text-sm">
            Utility tool for everyone!
          </p>
        </div>
        <div className="w-full h-auto flex flex-row justify-center gap-60 max-[430px]:flex-wrap">
          <CardRequest
            onDataChange={this.handleDataChange}
            onLoading={this.handleLoading}
            onError={this.handleError}
          />
          <CardResponse
            data={this.state.data}
            isLoading={this.state.isLoading}
            error={this.state.error}
            openPopup={this.openPopup}
          />
        </div>
        <FetchedContent
          isVisible={this.state.isPopupVisible}
          content={this.state.data}
          onClose={this.closePopup}
        />
      </div>
    );
  }
}

export default Main;
