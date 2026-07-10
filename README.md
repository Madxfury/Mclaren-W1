# 🏎️ McLaren W1 

<p align="center">
  <img src="https://github.com/user-attachments/assets/2b4b6919-9efe-4b9e-bf60-06e3adbcaad2" alt="System Architecture" width="150">
</p>

A modern full-stack web experience inspired by the **McLaren W1**, built with **Next.js**, **React**, **TypeScript**, and **Gemini AI**. It features an immersive landing page, a RAG-powered AI assistant, an interactive showroom locator, and a lead management dashboard, showcasing production-ready web development practices.

---

## 🚀 Key Features

- 🎬 **Interactive 3D Experience** – Scroll-driven animations with an 81-frame vehicle showcase and dynamic aero effects.
- 🤖 **MARVIN AI Assistant** – AI-powered race engineer using Gemini with local RAG for technical questions and interactive navigation.
- 📊 **Admin Dashboard** – Manage customer inquiries with search, filters, analytics, and lead management tools.
- ⚡ **Offline AI Fallback** – Local knowledge base ensures the chatbot works even without an API connection.
- 🗺️ **Showroom Locator** – Interactive dealership map built with Leaflet.
- 🚀 **Deployment Ready** – Optimized for Vercel with serverless API routes and production-compatible data handling.

---

## 📸 Visual Previews

### 🏎️ Home Page
<img width="1298" height="735" alt="2026-07-10_16-15-52" src="https://github.com/user-attachments/assets/3133a9c7-ed14-4755-8d60-e2995919a1df" />


### 🤖 MARVIN AI Race Engineer
<img width="1321" height="757" alt="image" src="https://github.com/user-attachments/assets/65a91636-1ac4-40ed-bc72-dd04eed036b8" />


### 📊 Showroom Leads Portal
<img width="1289" height="516" alt="image" src="https://github.com/user-attachments/assets/79f00604-fbc6-4e9d-ade2-4bcf5e27efae" />

---

## 🛠️ Technology Stack

<table align="center">
  <tr>
    <th>Category</th>
    <th>Technologies Used</th>
  </tr>
  <tr>
    <td><strong>Frontend Framework</strong></td>
    <td>React 19, Next.js 16 (App Router), TypeScript</td>
  </tr>
  <tr>
    <td><strong>Animations / Motion</strong></td>
    <td>Framer Motion (Scroll Scrubbing, Telemetry Transitions)</td>
  </tr>
  <tr>
    <td><strong>Styling</strong></td>
    <td>CSS Variables (Carbon Theme), Tailwind CSS</td>
  </tr>
  <tr>
    <td><strong>AI / NLP</strong></td>
    <td>Google Gemini API, Local Document Vector Search (RAG Pipeline)</td>
  </tr>
  <tr>
    <td><strong>Backend / API</strong></td>
    <td>Next.js Serverless Route Handlers (GET, POST, DELETE)</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>Persistent JSON Database Store (Dynamic <code>/tmp</code> routing for Serverless)</td>
  </tr>
  <tr>
    <td><strong>Maps</strong></td>
    <td>Leaflet.js, React Leaflet (Showroom Geospatial Mapping)</td>
  </tr>
</table>

---

## 📂 System Architecture

### 1. MARVIN AI RAG Pipeline
*   **Documents Store**: [marvinKnowledgeBase.ts](file:///Users/sanskarparab/McLaren%20W1%20Website/data/marvinKnowledgeBase.ts) contains technical specifications of the McLaren W1 split into contextual text chunks.
*   **Retrieval Route**: [route.ts](file:///Users/sanskarparab/McLaren%20W1%20Website/app/api/chat/route.ts) scans query content against document keywords.
*   **Augmentation**: Injects the best matching technical block directly into the system context under a `RETRIEVED DATA CONTEXT (RAG):` node before querying the LLM.
*   **HUD Command Parsing**: Returns structured data commands instructing the UI client to update aero properties (e.g. `aeroAngle: 25`, `telemetryState: "TRACK_READY"`) and scrolls the browser to corresponding detail page cards.

### 2. Lead Management DB
*   **Modal Form**: [InquireModal.tsx](file:///Users/sanskarparab/McLaren%20W1%20Website/components/InquireModal.tsx) collects purchasing name, email, contact codes, message text, and showroom dealer metadata.
*   **API Handlers**: [route.ts](file:///Users/sanskarparab/McLaren%20W1%20Website/app/api/inquire/route.ts) implements leads queries and deletes.
*   **Vercel / Production Bypass**: Checks environment tags; swaps local file pathing out for `/tmp/inquiries.json` under production builds, completely bypassing the Vercel read-only filesystem limit.

---

## ⚙️ Installation & Running Locally

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/sanskarparab/mclaren-w1-website.git
cd mclaren-w1-website
```

### 2. Install Dependencies
```bash
npm install
```
### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the homepage.

---

## 📊 Accessing the Admin Leads Portal

1. Open the homepage, click the **INQUIRE** button in the header, and fill out a lead entry form.
2. Navigate directly to **[http://localhost:3000/dashboard](http://localhost:3000/dashboard)** or click the **Leads Portal** button in the top navbar.
3. The dashboard will load the persistent database logs, calculate summary cards, and allow you to filter entries or purge records.

---

## 🛡️ License & Credits

*   **Designed & Developed by**: [Sanskar Parab](https://www.linkedin.com/in/sanskarparab/)
*   **Media & Specifications**: Inspired by official McLaren W1 materials. All assets are property of McLaren Automotive.
