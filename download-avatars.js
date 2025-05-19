const https = require('https');
const fs = require('fs');
const path = require('path');

// Get the root project directory
const projectRoot = path.resolve(__dirname, '..');
console.log('Project root:', projectRoot);

// Create directories if they don't exist
const dirs = [
  path.join(projectRoot, 'src', 'assets', 'avatars'),
  path.join(projectRoot, 'src', 'assets', 'avatars', 'premium'),
  path.join(projectRoot, 'src', 'assets', 'avatars', 'custom')
];

console.log('Creating directories:', dirs);

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log('Creating directory:', dir);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Avatar configuration
const avatarConfig = {
  free: [
    { id: 'm1', gender: 'male', seed: 'male-1' },
    { id: 'f1', gender: 'female', seed: 'female-1' },
    { id: 'n1', gender: 'neutral', seed: 'neutral-1' }
  ],
  premium: [
    { id: 'm2', gender: 'male', seed: 'male-2' },
    { id: 'm3', gender: 'male', seed: 'male-3' },
    { id: 'm4', gender: 'male', seed: 'male-4' },
    { id: 'f2', gender: 'female', seed: 'female-2' },
    { id: 'f3', gender: 'female', seed: 'female-3' },
    { id: 'f4', gender: 'female', seed: 'female-4' },
    { id: 'n2', gender: 'neutral', seed: 'neutral-2' },
    { id: 'n3', gender: 'neutral', seed: 'neutral-3' },
    { id: 'n4', gender: 'neutral', seed: 'neutral-4' }
  ],
  custom: [
    { id: 'cm1', gender: 'male', seed: 'custom-male-1' },
    { id: 'cm2', gender: 'male', seed: 'custom-male-2' },
    { id: 'cf1', gender: 'female', seed: 'custom-female-1' },
    { id: 'cf2', gender: 'female', seed: 'custom-female-2' },
    { id: 'cn1', gender: 'neutral', seed: 'custom-neutral-1' },
    { id: 'cn2', gender: 'neutral', seed: 'custom-neutral-2' }
  ]
};

// Track downloads
let totalDownloads = 0;
let completedDownloads = 0;
let failedDownloads = [];

// Function to check if all downloads are complete
function checkCompletion() {
  if (completedDownloads === totalDownloads) {
    console.log('\nDownload Summary:');
    console.log(`Total avatars: ${totalDownloads}`);
    console.log(`Successfully downloaded: ${completedDownloads - failedDownloads.length}`);
    if (failedDownloads.length > 0) {
      console.log('\nFailed downloads:');
      failedDownloads.forEach(id => console.log(`- ${id}`));
    }
  }
}

// Function to download avatar
function downloadAvatar(id, gender, type, seed) {
  totalDownloads++;
  const style = 'adventurer';
  
  // Base URL with common options
  let url = `https://api.dicebear.com/7.x/${style}/svg`;
  
  // Common options for all avatars
  const commonOptions = {
    seed: seed,
    eyes: 'variant01,variant02,variant03',
    eyebrows: 'variant01,variant02,variant03',
    mouth: 'variant01,variant02',
    skinColor: 'f2d3b1,ecad80,d08b5b,ae5d29,694d3d',
    radius: 0
  };

  // Gender-specific options
  const genderOptions = {
    male: {
      hair: 'short03,short04,short05,short06,short07',
      hairColor: '0e0e0e,3a3a3a,6a4e35,977157',
      accessories: type === 'free' ? 'variant01' : 'variant01,variant02,variant03',
      accessoriesProbability: type === 'free' ? 30 : 100,
      accessoriesColor: '0e0e0e,3a3a3a',
      beard: 'variant01,variant02',
      beardProbability: 20,
      beardColor: '0e0e0e,3a3a3a,6a4e35'
    },
    female: {
      hair: 'long01,long02,long03,long08,long09',
      hairColor: '0e0e0e,3a3a3a,6a4e35,977157',
      accessories: type === 'free' ? 'variant03' : 'variant01,variant02,variant03',
      accessoriesProbability: type === 'free' ? 30 : 100,
      accessoriesColor: '0e0e0e,3a3a3a'
    },
    neutral: {
      hair: 'short03,short04,long01,long02',
      hairColor: '0e0e0e,3a3a3a,6a4e35,977157',
      accessories: type === 'free' ? 'variant01' : 'variant01,variant02,variant03',
      accessoriesProbability: type === 'free' ? 30 : 100,
      accessoriesColor: '0e0e0e,3a3a3a'
    }
  };

  // Combine options
  const options = {
    ...commonOptions,
    ...genderOptions[gender]
  };

  // Convert options to URL parameters
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(options)) {
    params.append(key, value.toString());
  }

  url += `?${params.toString()}`;
  
  // Determine file path based on type
  const dir = type === 'free' ? '' : `${type}/`;
  const filePath = path.join(projectRoot, 'src', 'assets', 'avatars', dir, `adventurer-avatar-${id}.svg`);
  console.log('Saving avatar to:', filePath);
  
  // Create write stream
  const file = fs.createWriteStream(filePath);
  
  // Download the avatar with retry logic
  const maxRetries = 3;
  let retryCount = 0;

  const downloadWithRetry = () => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${filePath}`);
          completedDownloads++;
          checkCompletion();
        });
      } else {
        console.error(`Error downloading ${id}: Status ${response.statusCode}`);
        file.close();
        fs.unlink(filePath, () => {});
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying download for ${id} (Attempt ${retryCount}/${maxRetries})`);
          setTimeout(downloadWithRetry, 1000);
        } else {
          failedDownloads.push(id);
          completedDownloads++;
          checkCompletion();
        }
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      console.error(`Error downloading ${id}: ${err.message}`);
      
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying download for ${id} (Attempt ${retryCount}/${maxRetries})`);
        setTimeout(downloadWithRetry, 1000);
      } else {
        failedDownloads.push(id);
        completedDownloads++;
        checkCompletion();
      }
    });
  };

  downloadWithRetry();
}

// Download all avatars
console.log('Starting avatar downloads...\n');

Object.entries(avatarConfig).forEach(([type, avatars]) => {
  avatars.forEach(avatar => {
    downloadAvatar(avatar.id, avatar.gender, type, avatar.seed);
  });
}); 