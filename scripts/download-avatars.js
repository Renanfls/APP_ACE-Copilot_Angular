const https = require('https');
const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const dirs = [
  'public/assets/avatars',
  'public/assets/avatars/premium',
  'public/assets/avatars/custom'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Avatar configuration
const avatarConfig = {
  free: [
    { id: 'm1', gender: 'male' },
    { id: 'f1', gender: 'female' },
    { id: 'n1', gender: 'neutral' }
  ],
  premium: [
    { id: 'm2', gender: 'male' },
    { id: 'm3', gender: 'male' },
    { id: 'm4', gender: 'male' },
    { id: 'f2', gender: 'female' },
    { id: 'f3', gender: 'female' },
    { id: 'f4', gender: 'female' },
    { id: 'n2', gender: 'neutral' },
    { id: 'n3', gender: 'neutral' },
    { id: 'n4', gender: 'neutral' }
  ],
  custom: [
    { id: 'cm1', gender: 'male' },
    { id: 'cm2', gender: 'male' },
    { id: 'cf1', gender: 'female' },
    { id: 'cf2', gender: 'female' },
    { id: 'cn1', gender: 'neutral' },
    { id: 'cn2', gender: 'neutral' }
  ]
};

// Function to download avatar
function downloadAvatar(id, gender, type) {
  const seed = `${id}-${Date.now()}`; // Use timestamp to ensure uniqueness
  const style = 'adventurer';
  
  // Construct URL based on gender
  const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
  
  // Determine file path based on type
  const dir = type === 'free' ? '' : `${type}/`;
  const filePath = path.join('public', 'assets', 'avatars', dir, `adventurer-avatar-${id}.svg`);
  
  // Create write stream
  const file = fs.createWriteStream(filePath);
  
  // Download the avatar
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filePath}`);
    });
  }).on('error', (err) => {
    fs.unlink(filePath, () => {}); // Delete the file if there was an error
    console.error(`Error downloading ${id}: ${err.message}`);
  });
}

// Download all avatars
Object.entries(avatarConfig).forEach(([type, avatars]) => {
  avatars.forEach(avatar => {
    downloadAvatar(avatar.id, avatar.gender, type);
  });
});
