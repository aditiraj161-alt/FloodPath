# FloodPath - Flood Vulnerability Assessment

**FloodPath** is an interactive web-based tool designed to assess and calculate flood risk scores for urban and rural planning. By analyzing key environmental and demographic factors, it provides users with a data-driven vulnerability score to assist in disaster management and infrastructure development.

## 🚀 Overview

Flood vulnerability is a critical concern in modern urban planning. This project provides a simplified yet effective way to calculate risks based on:

  - **Elevation:** Lower altitudes are at higher risk.
  - **Water Proximity:** Distance to rivers, lakes, or coastlines.
  - **Population Density:** Higher density increases the impact of a flood event.
  - **Drainage Quality:** The efficiency of local infrastructure in handling excess water.
  - **Region Factors:** Specific environmental characteristics unique to the area.

## 📁 Project Structure

The repository consists of the following files:

  * **`FloodRiskScorer.java`**: The core backend logic (or standalone utility) that handles the mathematical calculations for the risk scoring algorithm.
  * **`index.html`**: The main user interface of the web tool, providing a clean layout for data entry and results display.
  * **`style.css`**: Contains the visual styling, ensuring a modern, responsive, and user-friendly experience.
  * **`script.js`**: Handles the front-end interactivity, capturing user input and communicating with the logic to display real-time results.

## 🛠️ Features

  - **Multi-Factor Analysis:** Goes beyond simple elevation to include population and infrastructure data.
  - **Real-time Scoring:** Instantly calculates the vulnerability index upon entering data.
  - **Urban & Rural Mode:** Adjusted logic for different planning environments.
  - **Responsive Design:** Works across desktops, tablets, and mobile devices.

## 💻 Technical Stack

  - **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
  - **Backend/Logic:** Java (Core Logic)

## ⚙️ Installation & Usage

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aditiraj161-alt/FloodPath.git
    ```
2.  **Running the Web Interface:**
      - Open `index.html` in any modern web browser to use the calculator.
3.  **Running the Java Logic:**
      - Ensure you have JDK installed.
      - Compile: `javac FloodRiskScorer.java`
      - Run: `java FloodRiskScorer`

## 📊 How the Score is Calculated

The tool uses a weighted formula where each factor (Elevation, Proximity, etc.) is assigned a weight based on its impact on flood severity.

  - **High Risk:** Low elevation + High population + Poor drainage.
  - **Low Risk:** High elevation + Low population + Excellent drainage.

## 🤝 Contributing

Contributions are welcome\! If you have ideas to improve the algorithm or UI:

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

-----

*Developed by [aditiraj161-alt](https://www.google.com/search?q=https://github.com/aditiraj161-alt)*
