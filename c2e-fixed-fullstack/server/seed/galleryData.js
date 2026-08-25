/**
 * Gallery images for the About page photo gallery.
 * Consumed by seedIfEmpty() to populate the Gallery collection.
 *
 * Images are real project photos copied from client/assets/images/.
 * Each entry's `image` field maps to a file in server/uploads/gallery/.
 */

const galleryData = [
  {
    title: 'Classroom Session',
    description: 'Students actively participating in a live coding workshop.',
    image: '/uploads/gallery/IMG-20260616-WA0037.jpg',
  },
  {
    title: 'Mentor Interaction',
    description: 'One-on-one mentoring session with industry experts.',
    image: '/uploads/gallery/IMG-20260616-WA0038.jpg',
  },
  {
    title: 'Leadership Workshop',
    description: 'Students developing leadership skills through interactive exercises.',
    image: '/uploads/gallery/leadership.jpeg',
  },
  {
    title: 'Student Showcase',
    description: 'Project presentations from student teams at our demo day.',
    image: '/uploads/gallery/logo-chatgpt.png',
  },
]

module.exports = { galleryData }
