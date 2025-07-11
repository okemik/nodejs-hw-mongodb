const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

// Swagger config
const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'hw7-swagger ödevi için API',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      schemas: {
        Contact: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            name: { type: 'string', example: 'Ömer' },
            email: { type: 'string', example: 'omer@example.com' },
            phone: { type: 'string', example: '+905551112233' },
          },
          required: ['name', 'email', 'phone'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            code: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Geçersiz istek' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Route dosyalarındaki yorumlar okunacak
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Basit veri - memory storage
let contacts = [
  { id: '1', name: 'Ömer', email: 'omer@example.com', phone: '+905551112233' },
];

// Routes
const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Kontak işlemleri
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Tüm kontakları getir
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Başarılı yanıt
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 */
router.get('/', (req, res) => {
  res.json(contacts);
});

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Yeni kontak oluştur
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Kontak oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Hatalı istek
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone)
    return res.status(400).json({ status: 'error', code: 400, message: 'Eksik alanlar' });

  const newContact = { id: (contacts.length + 1).toString(), name, email, phone };
  contacts.push(newContact);
  res.status(201).json(newContact);
});

app.use('/api/contacts', router);

app.get('/', (req, res) => {
  res.send('hw7-swagger API çalışıyor!');
});

module.exports = app;
