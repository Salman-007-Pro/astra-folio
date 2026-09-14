import type { Profile } from "@garden/content-schema";

export function contactLinks(profile: Profile) {
  const { callNumber, whatsappNumber } = profile.collaboration;
  const message = `Hi ${profile.name.split(" ")[0]}, I’d like to discuss a full-stack engineering opportunity with you.`;
  const whatsappContacts = profile.collaboration.whatsappContacts.length
    ? profile.collaboration.whatsappContacts
    : [{ label: "WhatsApp", number: whatsappNumber }];
  const whatsappUrl = (number: string) =>
    `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  return {
    call: `tel:+${callNumber.replace(/\D/g, "")}`,
    // WhatsApp click-to-chat uses international digits without the + or spaces.
    whatsapp: whatsappUrl(whatsappContacts[0].number),
    whatsappContacts: whatsappContacts.map((contact) => ({
      ...contact,
      href: whatsappUrl(contact.number),
    })),
    email: `mailto:${profile.email}`,
  };
}
