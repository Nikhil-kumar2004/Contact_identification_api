const express = require("express");
const app = express();
const Contact = require("../models/Contact");


app.post("/", async (req, res) => {
  try {
    let { email, phoneNumber } = req.body;

    if (!email && !phoneNumber)
      return res.status(400).json({ error: "Email or phone required" });

    let contacts = await Contact.find({
      $or: [{ email }, { phoneNumber }]
    }).sort({ createdAt: 1 });

    if (contacts.length === 0) {
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "primary"
      });

      return res.json({
        contact: {
          primaryContatctId: newContact._id,
          emails: [newContact.email],
          phoneNumbers: [newContact.phoneNumber],
          secondaryContactIds: []
        }
      });
    }

    let relatedIds = contacts.map(c => c._id);

    let allRelated = await Contact.find({
      $or: [
        { _id: { $in: relatedIds } },
        { linkedId: { $in: relatedIds } }
      ]
    }).sort({ createdAt: 1 });

    let primary = allRelated.find(c => c.linkPrecedence === "primary");

    let primaries = allRelated.filter(c => c.linkPrecedence === "primary");

    if (primaries.length > 1) {
      primary = primaries.sort((a, b) => a.createdAt - b.createdAt)[0];

      for (let p of primaries) {
        if (p._id.toString() !== primary._id.toString()) {
          await Contact.updateOne(
            { _id: p._id },
            {
              linkedId: primary._id,
              linkPrecedence: "secondary"
            }
          );
        }
      }
    }

    const exists = allRelated.some(
      c => c.email === email && c.phoneNumber === phoneNumber
    );

    if (!exists) {
      await Contact.create({
        email,
        phoneNumber,
        linkedId: primary._id,
        linkPrecedence: "secondary"
      });
    }

    const finalContacts = await Contact.find({
      $or: [{ _id: primary._id }, { linkedId: primary._id }]
    }).sort({ createdAt: 1 });

    const emails = [...new Set(finalContacts.map(c => c.email).filter(Boolean))];
    const phones = [...new Set(finalContacts.map(c => c.phoneNumber).filter(Boolean))];

    const secondaryIds = finalContacts
      .filter(c => c.linkPrecedence === "secondary")
      .map(c => c._id);

    res.json({
      contact: {
        primaryContatctId: primary._id,
        emails,
        phoneNumbers: phones,
        secondaryContactIds: secondaryIds
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = app;