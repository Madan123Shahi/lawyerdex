import Contact from "../models/Contact.js";
import { asyncHandler } from "../utils/appError.js";

export const submitContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({
    success: true,
    message:
      "Your message has been received. We will get back to you within 24 hours.",
    data: { id: contact._id },
  });
});
