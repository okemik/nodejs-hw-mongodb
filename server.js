import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Basit kimlik doğrulama middleware (demo amaçlı)
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  // Token doğrulama (demo, gerçek projede JWT vs. kontrol edilecek)
  if (token !== "valid-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// Örnek veriler
let contacts = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
  },
];

// GET /contacts
app.get("/contacts", authenticate, (req, res) => {
  // Basit filtreleme ve sayfalama
  const { page = 1, limit = 10, search } = req.query;
  let filtered = contacts;
  if (search) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + Number(limit));
  res.json(paged);
});

// GET /contacts/:contactId
app.get("/contacts/:contactId", authenticate, (req, res) => {
  const contact = contacts.find((c) => c.id === req.params.contactId);
  if (!contact)
    return res.status(404).json({ message: "Contact not found" });
  res.json(contact);
});

// POST /contacts
app.post("/contacts", authenticate, (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone: phone || "",
  };
  contacts.push(newContact);
  res.status(201).json(newContact);
});

// PATCH /contacts/:contactId
app.patch("/contacts/:contactId", authenticate, (req, res) => {
  const contact = contacts.find((c) => c.id === req.params.contactId);
  if (!contact)
    return res.status(404).json({ message: "Contact not found" });

  const { name, email, phone } = req.body;
  if (name !== undefined) contact.name = name;
  if (email !== undefined) contact.email = email;
  if (phone !== undefined) contact.phone = phone;

  res.json(contact);
});

// DELETE /contacts/:contactId
app.delete("/contacts/:contactId", authenticate, (req, res) => {
  const index = contacts.findIndex((c) => c.id === req.params.contactId);
  if (index === -1)
    return res.status(404).json({ message: "Contact not found" });

  contacts.splice(index, 1);
  res.status(204).send();
});

// /api-docs rotası için Swagger UI sunumu
const swaggerFilePath = path.resolve("./docs/swagger.json");
let swaggerDocument = {};
try {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath));
} catch {
  console.warn("Swagger JSON dosyası bulunamadı. Build dokümanlarını çalıştırın.");
}

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
