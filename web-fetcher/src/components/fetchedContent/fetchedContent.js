import React from "react";

class FetchedContent extends React.Component {
  render() {
    const { isVisible, content, onClose } = this.props;

    if (!isVisible) {
      return null;
    }

    const isImageUrl = (url) => {
      return /\.(jpg|jpeg|png|gif|svg)$/.test(url);
    };

    const getImageUrls = (data) => {
      if (!data) return [];
      if (typeof data === "object" && Array.isArray(data.imgUrls)) {
        return data.imgUrls.filter(isImageUrl);
      }
      return [];
    };

    const imageUrls = getImageUrls(content);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white w-[30rem] p-5 rounded-md border-2 border-[#323232] shadow-[4px_4px_#323232]">
          <h2 className="text-center mb-4 font-semibold">Fetched Content</h2>
          <div className="overflow-auto max-h-96">
            {imageUrls.length > 0 ? (
              imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Fetched content ${index}`}
                  className="max-w-full h-auto mb-2"
                />
              ))
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
