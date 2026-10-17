import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Lawyer } from "../models/Lawyer.js";
import { Category } from "../models/Category.js";
import { Article } from "../models/Article.js";
import { Review } from "../models/Review.js";
import { Consultation } from "../models/Consultation.js";
import { slugify } from "../utils/slugify.js";
import { categories, lawyers, articles } from "./data.js";

await connectDB();

await Promise.all([User, Lawyer, Category, Article, Review, Consultation].map((m) => m.deleteMany({})));

const passwordHash = await User.hashPassword("Password123!");

await Category.insertMany(categories.map((c) => ({ ...c, slug: slugify(c.name) })));
await Article.insertMany(articles.map((a, i) => ({ ...a, slug: slugify(a.title), publishedAt: new Date(Date.now() - i * 864e5) })));

await User.create({ name: "Site Admin", email: "admin@lawyerdex.test", passwordHash, role: "admin" });
await User.create({ name: "Demo Client", email: "client@lawyerdex.test", passwordHash, role: "client" });

for (const [i, l] of lawyers.entries()) {
  const user = await User.create({
    name: l.name,
    email: `${slugify(l.name)}@lawyerdex.test`,
    passwordHash,
    role: "lawyer",
  });
  await Lawyer.create({
    user: user._id,
    name: l.name,
    slug: slugify(l.name),
    headline: l.headline,
    bio: l.bio,
    practiceAreas: l.areas,
    city: l.city,
    state: l.state,
    barNumber: `DEMO-${1000 + i}`, // placeholder values for demo data only
    experienceYears: l.years,
    hourlyRate: l.rate,
    freeConsultation: l.free,
    rating: l.rating,
    reviewCount: l.reviews,
    verificationStatus: "approved",
    verifiedAt: new Date(),
  });
}

console.log("Seed complete.");
console.log("  admin  : admin@lawyerdex.test  / Password123!");
console.log("  client : client@lawyerdex.test / Password123!");
console.log("  lawyer : amelia-hartwell@lawyerdex.test / Password123!");

await disconnectDB();
