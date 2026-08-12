require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const HUBSPOT_API_BASE = "https://api.hubapi.com";
const ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.HUBSPOT_CUSTOM_OBJECT_TYPE;
const CUSTOM_OBJECT_LABEL = process.env.HUBSPOT_CUSTOM_OBJECT_LABEL || "Books";

const PROPERTY_NAMES = ["name", "author", "genre"];

app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const hubspot = axios.create({
  baseURL: HUBSPOT_API_BASE,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  },
  timeout: 10000
});

function configurationError() {
  const missing = [];
  if (!ACCESS_TOKEN) missing.push("HUBSPOT_ACCESS_TOKEN");
  if (!CUSTOM_OBJECT_TYPE) missing.push("HUBSPOT_CUSTOM_OBJECT_TYPE");

  return missing.length
    ? `Missing environment variable(s): ${missing.join(", ")}`
    : null;
}

// Homepage: retrieve custom-object records and render them.
app.get("/", async (req, res) => {
  const configError = configurationError();

  if (configError) {
    return res.render("homepage", {
      title: "HubSpot Custom Objects | Integrating With HubSpot I Practicum",
      objectLabel: CUSTOM_OBJECT_LABEL,
      records: [],
      error: configError
    });
  }

  try {
    const response = await hubspot.get(
      `/crm/objects/2026-03/${encodeURIComponent(CUSTOM_OBJECT_TYPE)}`,
      {
        params: {
          limit: 100,
          properties: PROPERTY_NAMES.join(",")
        }
      }
    );

    res.render("homepage", {
      title: "HubSpot Custom Objects | Integrating With HubSpot I Practicum",
      objectLabel: CUSTOM_OBJECT_LABEL,
      records: response.data.results || [],
      error: null
    });
  } catch (error) {
    console.error(
      "HubSpot GET error:",
      error.response?.data || error.message
    );

    res.status(502).render("homepage", {
      title: "HubSpot Custom Objects | Integrating With HubSpot I Practicum",
      objectLabel: CUSTOM_OBJECT_LABEL,
      records: [],
      error:
        error.response?.data?.message ||
        "Unable to retrieve records from HubSpot."
    });
  }
});

// Form: render the Pug form.
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
    objectLabel: CUSTOM_OBJECT_LABEL,
    error: null,
    values: {}
  });
});

// Form submission: create a new custom-object record.
app.post("/update-cobj", async (req, res) => {
  const configError = configurationError();

  if (configError) {
    return res.status(500).render("updates", {
      title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
      objectLabel: CUSTOM_OBJECT_LABEL,
      error: configError,
      values: req.body
    });
  }

  const properties = {
    name: (req.body.name || "").trim(),
    author: (req.body.author || "").trim(),
    genre: (req.body.genre || "").trim()
  };

  if (!properties.name || !properties.author || !properties.genre) {
    return res.status(400).render("updates", {
      title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
      objectLabel: CUSTOM_OBJECT_LABEL,
      error: "Please complete all three fields.",
      values: req.body
    });
  }

  try {
    await hubspot.post(
      `/crm/objects/2026-03/${encodeURIComponent(CUSTOM_OBJECT_TYPE)}`,
      { properties }
    );

    res.redirect("/");
  } catch (error) {
    console.error(
      "HubSpot POST error:",
      error.response?.data || error.message
    );

    res.status(502).render("updates", {
      title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
      objectLabel: CUSTOM_OBJECT_LABEL,
      error:
        error.response?.data?.message ||
        "Unable to create the record in HubSpot.",
      values: req.body
    });
  }
});

app.listen(PORT, () => {
  console.log(`Practicum app running at http://localhost:${PORT}`);
});
