import React from "react";

class FetchedContent extends React.Component {
  render() {
    const { isVisible, content, onClose } = this.props;

    if (!isVisible) {
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white w-[30rem] p-5 rounded-md border-2 border-[#323232] shadow-[4px_4px_#323232]">
          <h2 className="text-center mb-4 font-semibold">Fetched Content</h2>
          <div className="overflow-auto max-h-96">
            {content ? (
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(content, null, 2)}
              </pre>
            ) : (
              <div className="text-center text-balance">
                <p>No data available.</p>
                <p>Please enter a URL to fetch data.</p>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="mt-4 p-2.5 bg-black text-white font-semibold shadow-[1.5px_1.5px_#5C5C5C] w-full"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}

export default FetchedContent;
