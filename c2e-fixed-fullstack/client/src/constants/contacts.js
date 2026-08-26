// ======================================================================
// CONNECT2EDTECH CONTACT DETAILS
// ======================================================================
//
// Keep all contact information in this file so the Footer, Contact page,
// WhatsApp button, Mentor section and other components use one source
// of truth.
//
// ======================================================================

export const CONTACT = {
  whatsappNumber: "917019436720",

  whatsappMessage:
    "Hi, I'd like to know more about Connect2EdTech courses and programs.",

  email: "shmilind2000@gmail.com",

  phone: "+91 7019436720",
};


// ======================================================================
// SOCIAL LINKS
// ======================================================================

export const SOCIAL = {
  instagram:
    "https://www.instagram.com/the_c2f_/",

  linkedin:
    "https://www.linkedin.com/company/connect2future/",

  // Add the real GitHub profile when available.
  github: null,

  googleMaps:
    "https://www.google.com/maps/place/connect2future/@12.3097425,76.6060931,17z/data=!4m10!1m2!2m1!1sconnect2future!3m6!1s0x8d5f4a2084adbec9:0xf4fcf3522495b959!8m2!3d12.309769!4d76.608718!15sCg5jb25uZWN0MmZ1dHVyZVoQIg5jb25uZWN0MmZ1dHVyZZIBHmJ1c2luZXNzX21hbmFnZW1lbnRfY29uc3VsdGFudOABAA!16s/g/11xw0lf7hj",
};


// ======================================================================
// WHATSAPP URL
// ======================================================================

export const whatsappUrl = (
  message = CONTACT.whatsappMessage
) => {
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodedMessage}`;
};


// ======================================================================
// OPTIONAL MAIL / PHONE HELPERS
// ======================================================================

export const emailUrl = (
  email = CONTACT.email
) => {
  return `mailto:${email}`;
};

export const gmailTrainerUrl = (
  email = CONTACT.email,
  subject = "Become a Trainer - Connect2EdTech",
  body = "Hello, I'm interested in becoming a trainer with Connect2EdTech. Please find my details below."
) => {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${email}?${params.toString()}`;
};


export const phoneUrl = (
  phone = CONTACT.phone
) => {
  return `tel:${phone.replace(/\s+/g, "")}`;
};