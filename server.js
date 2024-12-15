const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Route to scrape product reviews
app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let browser;

  try {
    // Launch Puppeteer
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    );

    // Navigate to the given URL
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Scrape reviews
    const reviews = await page.evaluate(() => {
      const reviewElements = document.querySelectorAll(".review"); // Example selector, adjust based on website

      const extractedReviews = [];
      reviewElements.forEach((review) => {
        const title =
          review.querySelector(".review-title")?.innerText.trim() || "No Title";
        const rating =
          review.querySelector(".review-rating")?.innerText.trim() ||
          "No Rating";
        const content =
          review.querySelector(".review-text")?.innerText.trim() || "No Content";
        extractedReviews.push({ title, rating, content });
      });

      return extractedReviews;
    });

    // Send response back to frontend
    res.json({ reviews });
  } catch (error) {
    console.error("Error scraping data:", error.message);
    res.status(500).json({ error: "Failed to scrape data" });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
