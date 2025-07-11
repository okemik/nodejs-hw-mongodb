const express = require('express');
const router = express.Router();

let contacts = [
  { id: '1', name: 'Ömer Ferkan', email: 'omer@example.com', phone: '+905551112233' },
];

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: İletişim işlemleri
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Tüm kontakları getir
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Kontak listesi
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
 * /api/contacts/{id}:
 *   get:
 *     summary: ID'ye göre kontak getir
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Kontak ID'si
 *     responses:
 *       200:
 *         description: Kontak bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Kontak bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', (req, res) => {
  const contact = contacts.find((c) => c.id === req.params.id);
  if (!contact) {
    return res.status(404).json({ status: 'error', code: 404, message: 'Kontak bulunamadı' });
  }
  res.json(contact);
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
 *         description: Geçersiz veri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ status: 'error', code: 400, message: 'Eksik alanlar var' });
  }
  const newContact = { id: (contacts.length + 1).toString(), name, email, phone };
  contacts.push(newContact);
  res.status(201).json(newContact);
});

module.exports = router;
