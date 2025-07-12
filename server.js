import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Contact modeli
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
});
const Contact = mongoose.model("Contact", contactSchema);

// Basit kimlik doğrulama middleware (demo amaçlı)
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== "valid-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// GET /contacts
app.get("/contacts", authenticate, async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const skip = (page - 1) * limit;
  const filter = search
    ? {
        $or: [
          { name: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
        ],
      }
    : {};

  try {
    const contacts = await Contact.find(filter).skip(skip).limit(Number(limit));
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /contacts/:contactId
app.get("/contacts/:contactId", authenticate, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: "Invalid contact ID" });
  }
});

// POST /contacts
app.post("/contacts", authenticate, async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }
  try {
    const newContact = await Contact.create({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /contacts/:contactId
app.patch("/contacts/:contactId", authenticate, async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.contactId,
      { $set: { name, email, phone } },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Contact not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Invalid contact ID or data" });
  }
});

// DELETE /contacts/:contactId
app.delete("/contacts/:contactId", authenticate, async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.contactId);
    if (!deleted) return res.status(404).json({ message: "Contact not found" });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: "Invalid contact ID" });
  }
});

// Swagger UI
const swaggerFilePath = path.resolve("./docs/swagger.json");
let swaggerDocument = {};
try {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath));
} catch {
  console.warn("⚠️ Swagger JSON not found. Run build-docs first.");
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sunucu başlat
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectMongo();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger at http://localhost:${PORT}/api-docs`);
});
