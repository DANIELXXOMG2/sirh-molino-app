// Fun cartoon-style avatars using DiceBear API
// These avatars are generated using the free DiceBear Avatars API
// Documentation: https://www.dicebear.com/

export const FUN_AVATARS = [
  // Avataaars style - Fun cartoon avatars
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
  
  // Bottts style - Cute robot avatars
  'https://api.dicebear.com/7.x/bottts/svg?seed=Fluffy',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Cuddles',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Snickers',
  
  // Adventurer style - Cartoon adventurer characters
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Princess',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Cooper',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe',
  
  // Big Smile style - Happy face avatars
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Happy',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Sunshine',
  
  // Lorelei style - Cute illustrated avatars
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Whiskers',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Mittens',
];

/**
 * Get a random avatar URL from the FUN_AVATARS array
 * @returns {string} A random avatar URL
 */
export const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * FUN_AVATARS.length);
  return FUN_AVATARS[randomIndex];
};

/**
 * Get an avatar based on user email (deterministic)
 * This ensures the same email always gets the same avatar if needed
 * @param {string} email - User's email address
 * @returns {string} Avatar URL
 */
export const getAvatarByEmail = (email) => {
  // Simple hash function to get consistent index from email
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % FUN_AVATARS.length;
  return FUN_AVATARS[index];
};
