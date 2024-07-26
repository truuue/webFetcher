import React from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";

class FetchedContent extends React.Component {
  downloadImage = async (url, index) => {
    try {
      console.log(`Fetching image from URL: ${url}`);
      const response = await fetch(
        `/image-proxy?url=${encodeURIComponent(url)}`
      );
      console.log(`Received response for image ${index}:`, response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("Content-Type");
      console.log(`Content-Type: ${contentType}`);

      if (!contentType.startsWith("image/")) {
        const text = await response.text(); // Lire la réponse en texte pour le diagnostic
        console.error(`Unexpected content type: ${contentType}`);
        console.error("Response body:", text);
        throw new Error(`Unexpected content type: ${contentType}`);
      }

      const blob = await response.blob();
      console.log(`Received blob for image ${index}:`, blob);
      console.log(`Blob size: ${blob.size}`);
      console.log(`Blob type: ${blob.type}`);

      const filename = `fetched_image_${index}${this.getFileExtension(url)}`;
      saveAs(blob, filename);
    } catch (err) {
      console.error("Error fetching image:", err);
      alert("Error downloading image: " + err.message);
    }
  };

  downloadAllImages = async () => {
    const { content } = this.props;
    const imageUrls = this.getImageUrls(content);

    if (imageUrls.length === 0) {
      return;
    }

    const zip = new JSZip();

    const promises = imageUrls.map(async (url, index) => {
      try {
        const response = await fetch(
          `/image-proxy?url=${encodeURIComponent(url)}`
        );
        console.log(`Received response for image ${index}:`, response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("Content-Type");
        console.log(`Content-Type: ${contentType}`);

        if (!contentType.startsWith("image/")) {
          const text = await response.text();
          console.error(`Unexpected content type: ${contentType}`);
          console.error("Response body:", text);
          throw new Error(`Unexpected content type: ${contentType}`);
        }

        const blob = await response.blob();
        console.log(`Received blob for image ${index}:`, blob);
        console.log(`Blob size: ${blob.size}`);
        console.log(`Blob type: ${blob.type}`);

        const filename = `fetched_image_${index}${this.getFileExtension(url)}`;
        zip.file(filename, blob);
      } catch (err) {
        console.error("Error fetching image:", err);
      }
    });

    try {
      await Promise.all(promises);
      const zipContent = await zip.generateAsync({ type: "blob" });
      saveAs(zipContent, "images.zip");
    } catch (err) {
      console.error("Error creating ZIP file:", err);
    }
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
    return url.substring(url.lastIndexOf("."));
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
