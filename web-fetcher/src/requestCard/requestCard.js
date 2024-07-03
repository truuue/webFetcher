import React from "react";
import axios from "axios";

class CardRequest extends React.Component {
  state = {
    url: "",
  };

  handleInputChange = (event) => {
    this.setState({ url: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const backendUrl = "http://localhost:5001";
    axios
      .get(`${backendUrl}/fetch`, {
        params: {
          url: this.state.url,
        },
      })
      .then((response) => {
        this.props.onDataChange(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className="bg-white w-72 h-80 rounded-md border-2 border-[#323232] shadow-[4px_4px_#323232] font-semibold flex flex-col justify-evenly items-center max-[430px]:-mb-48"
      >
        <p>Your url input.</p>
        <input
          onChange={this.handleInputChange}
          value={this.state.url}
          className="w-[200px] h-[40px] rounded-md border-2 border-[#323232] bg-white shadow-[2px_2px_#323232] text-[15px] font-semibold text-[#323232] px-[10px] py-[5px] outline-none placeholder-[#666] placeholder-opacity-80 focus:border-[#2d8cf0]"
          placeholder="URL"
        />
        <button
          type="submit"
          className=" p-2.5 bg-black text-white shadow-[1.5px_1.5px_#5C5C5C]"
        >
          Submit
        </button>
      </form>
    );
  }
}

export default CardRequest;
