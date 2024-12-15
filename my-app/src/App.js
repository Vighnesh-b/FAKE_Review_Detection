import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // URL validation
    if (!url || !/^https?:\/\/[^\s]+$/.test(url)) {
      alert("Please enter a valid URL.");
      return;
    }

    setLoading(true); // Start loading spinner

    try {
      const response = await fetch("http://localhost:5000/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();

      if (data.reviews && Array.isArray(data.reviews)) {
        setResult(data.reviews); // Set scraped reviews
      } else {
        setResult([{ title: "Error", content: "No reviews found." }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setResult([{ title: "Error", content: "Failed to fetch data." }]);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #A9D8E9, #F4F9FB)", // Light blue to snow white gradient
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "600px",
          padding: "40px",
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Slight transparency for smooth feel
          borderRadius: "15px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)", // Soft shadow
        }}
      >
        <h1 style={{ color: "#333" }}>Web Scraper</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              padding: "15px",
              width: "350px",
              margin: "10px 0",
              borderRadius: "10px",
              border: "1px solid #C8E0E9", // Subtle border color
              fontSize: "16px",
              outline: "none",
              transition: "0.3s ease-in-out",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft inner shadow
            }}
            onFocus={(e) => e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"} // Focus effect
            onBlur={(e) => e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"} // Blur effect
          />
          <button
            type="submit"
            style={{
              padding: "12px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
              marginLeft: "10px",
              transition: "background-color 0.3s ease", // Button hover effect
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#45a049"} // Hover effect
            onMouseLeave={(e) => e.target.style.backgroundColor = "#4CAF50"} // Reset effect
          >
            Submit
          </button>
        </form>

        {/* Loading Spinner */}
        {loading && <div>Loading...</div>}

        {result && result.length > 0 && (
          <div style={{ marginTop: "20px", textAlign: "left", display: "inline-block", width: "100%" }}>
            <h3 style={{ color: "#333" }}>Scraped Reviews:</h3>
            {result.map((review, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h4 style={{ margin: 0, color: "#444" }}>{review.title}</h4>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  <strong>Rating:</strong> {review.rating || "N/A"}
                </p>
                <p style={{ color: "#555" }}>{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
