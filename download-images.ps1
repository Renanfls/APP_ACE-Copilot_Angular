# Create the directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "src/assets/premios"

# Image URLs
$images = @{
    "tv-43" = "https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg"
    "tv-50" = "https://images.pexels.com/photos/6976101/pexels-photo-6976101.jpeg"
    "tv-65" = "https://images.unsplash.com/photo-1593784991095-a205069470b6"
    "tv-75" = "https://images.unsplash.com/photo-1593784991095-a205069470b6"
    "fone" = "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg"
    "airfryer" = "https://images.pexels.com/photos/6996168/pexels-photo-6996168.jpeg"
    "notebook" = "https://images.pexels.com/photos/18105/pexels-photo.jpg"
    "macbook" = "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg"
    "ipad" = "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg"
    "smartphone" = "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg"
    "iphone" = "https://images.pexels.com/photos/1294886/pexels-photo-1294886.jpeg"
    "ps5" = "https://images.pexels.com/photos/12719133/pexels-photo-12719133.jpeg"
}

# Download each image
foreach ($key in $images.Keys) {
    $url = $images[$key]
    $output = "src/assets/premios/$key.webp"
    Write-Host "Downloading $key..."
    Invoke-WebRequest -Uri $url -OutFile $output
} 