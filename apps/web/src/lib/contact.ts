import type { Profile } from "@garden/content-schema";

export function contactLinks(profile: Profile) {
  const { callNumber, whatsappNumber } = profile.collaboration;
  const message =
    "Hi Salman, I’d like to discuss a remote full-stack opportunity with you.";
  return {
    call: `tel:+${callNumber.replace(/\D/g, "")}`,
    // WhatsApp click-to-chat uses international digits without the + or spaces.
    whatsapp: `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`,
    email: `mailto:${profile.email}`,
  };
}
