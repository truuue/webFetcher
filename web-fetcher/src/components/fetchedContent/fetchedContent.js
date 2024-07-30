import React from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";

class FetchedContent extends React.Component {
  downloadImage = (url, index) => {
    console.log(`Fetching image from URL: ${url}`);
    fetch(`/download-image.php?url=${encodeURIComponent(url)}`)
      .then((response) => {
        console.log(`Received response for image ${index}:`, response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        console.log(`Received blob with type: ${blob.type}`);
        if (!blob.type.startsWith("image/")) {
          return blob.text().then((text) => {
            console.error("Blob type is not an image, received content:", text);
            throw new Error(`Received blob is not an image: ${blob.type}`);
          });
        }
        const filename = `fetched_image_${index}${this.getFileExtension(url)}`;
        console.log(`Saving image as: ${filename}`);
        saveAs(blob, filename);
      })
      .catch((err) => console.error("Error fetching image:", err));
  };

  downloadAllImages = () => {
    const { content } = this.props;
    const imageUrls = this.getImageUrls(content);
    const zip = new JSZip();

    const imagePromises = imageUrls.map((url, index) =>
      fetch(`/download-image.php?url=${encodeURIComponent(url)}`)
        .then((response) => response.blob())
        .then((blob) => {
          const filename = `fetched_image_${index}${this.getFileExtension(
            url
          )}`;
          zip.file(filename, blob);
        })
    );

    Promise.all(imagePromises).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "images.zip");
      });
    });
  };

  getImageUrls = (data) => {
    if (!data) return [];
    if (typeof data === "object" && Array.isArray(data.imgUrls)) {
      return data.imgUrls.filter(this.isImageUrl);
    }
    return [];
  };

  isImageUrl = (url) => {
    return /\.(jpg|jpeg|png|gif|svg)$/.test(url);
  };

  getFileExtension = (url) => {
    return url.substring(url.lastIndexOf(".")) || ".jpg";
  };

  render() {
    const { isVisible, content, onClose } = this.props;

    if (!isVisible) {
      return null;
    }

    const imageUrls = this.getImageUrls(content);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white w-[35rem] p-5 rounded-md border-2 border-[#323232] shadow-[4px_4px_#323232]">
          <h2 className="text-center mb-4 font-semibold">Fetched Content</h2>
          <div className="overflow-auto max-h-96 xl:max-h-[35rem] border-1 border-black scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
            {imageUrls.length > 0 ? (
              imageUrls.map((url, index) => (
                <div key={index} className="mb-2">
                  <img
                    src={url}
                    alt={`Fetched content ${index}`}
                    className="max-w-full h-auto mb-2"
                  />
                  <button
                    onClick={() => this.downloadImage(url, index)}
                    className="p-2.5 bg-gray-600 text-white font-semibold shadow-[1.5px_1.5px_#5C5C5C] mb-2 mx-auto block"
                  >
                    Download
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-balance">
                <p>No data available.</p>
                <p>Please enter a URL to fetch data.</p>
              </div>
            )}
          </div>
          {imageUrls.length > 0 && (
            <button
              onClick={this.downloadAllImages}
              className="mt-4 p-2.5 bg-gray-600 text-white font-semibold shadow-[1.5px_1.5px_#5C5C5C] w-full"
            >
              Download All
            </button>
          )}
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
