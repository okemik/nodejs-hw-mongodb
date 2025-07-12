const express = require('express');
const router = express.Router();
const Contact = require('../models/contact'); // mongoose Contact modeli

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
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ status: 'error', code: 500, message: 'Sunucu hatası' });
  }
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
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ status: 'error', code: 404, message: 'Kontak bulunamadı' });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ status: 'error', code: 500, message: 'Sunucu hatası' });
  }
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
 *         description: Eksik veya hatalı veri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ status: 'error', code: 400, message: 'Name ve email alanları zorunludur' });
  }

  try {
    const newContact = await Contact.create({ name, email, phone });
    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ status: 'error', code: 500, message: 'Sunucu hatası' });
  }
});

module.exports = router;
