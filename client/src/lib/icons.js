import { Car, Wallet, Briefcase, Scale, Gavel, Users, Building2, ScrollText, Globe, Lightbulb, Home, Receipt } from "lucide-react";

const map = { Car, Wallet, Briefcase, Scale, Gavel, Users, Building2, ScrollText, Globe, Lightbulb, Home, Receipt };
export const iconFor = (name) => map[name] ?? Scale;
