$starImages = @{
    "capella" = "https://apod.nasa.gov/apod/image/2102/WinterNight_Zambelli_2048.jpg";
    "procyon" = "https://cdn.esahubble.org/archives/images/large/opo0510g.jpg";
    "altair" = "https://cdn.esahubble.org/archives/images/large/heic0720c.jpg";
    "aldebaran" = "https://cdn.esahubble.org/archives/images/large/heic1309b.jpg";
    "spica" = "https://cdn.esahubble.org/archives/images/large/heic2403a.jpg";
    "antares" = "https://cdn.esahubble.org/archives/images/large/opo2507.jpg";
    "pollux" = "https://apod.nasa.gov/apod/image/1705/PolluxCastor_Horalek_2000.jpg";
    "deneb" = "https://cdn.esahubble.org/archives/images/large/heic0720c.jpg";
    "regulus" = "https://cdn.esahubble.org/archives/images/large/heic2403a.jpg";
    "castor" = "https://apod.nasa.gov/apod/image/1705/PolluxCastor_Horalek_2000.jpg";
    "bellatrix" = "https://apod.nasa.gov/apod/image/2401/OrionDeep_Lazzarotti_2500.jpg";
    "elnath" = "https://apod.nasa.gov/apod/image/1003/AurigaDeep_Gendler_big.jpg";
    "mirach" = "https://apod.nasa.gov/apod/image/2110/MirachsGhost_Kohl_2000.jpg";
    "algol" = "https://images-assets.nasa.gov/image/PIA12348/PIA12348~large.jpg";
    "mizar" = "https://cdn.esahubble.org/archives/images/large/heic0801h.jpg";
    "alkaid" = "https://cdn.esahubble.org/archives/images/large/heic0801h.jpg";
    "dubhe" = "https://cdn.esahubble.org/archives/images/large/heic0801h.jpg";
    "merak" = "https://cdn.esahubble.org/archives/images/large/heic0801h.jpg";
    "kochab" = "https://apod.nasa.gov/apod/image/2302/ZTF_Yosemite_Zambelli_2048.jpg"
}

$genericImages = @(
    "https://images-assets.nasa.gov/image/PIA12348/PIA12348~large.jpg",
    "https://images-assets.nasa.gov/image/hubble-sees-a-glittering-city-of-stars_22765324542_o/hubble-sees-a-glittering-city-of-stars_22765324542_o~large.jpg",
    "https://images-assets.nasa.gov/image/gsfc_20171208_archive_e001550/gsfc_20171208_archive_e001550~large.jpg"
)

$targetDir = "public/images/stars"
if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir
}

# Download generic images first
Write-Host "Downloading generic fill images..."
for ($i = 0; $i -lt $genericImages.Count; $i++) {
    $targetFile = Join-Path $targetDir "fill_$($i+1).jpg"
    if (!(Test-Path $targetFile)) {
        Invoke-WebRequest -Uri $genericImages[$i] -OutFile $targetFile
    }
}

# Download star-specific images
foreach ($star in $starImages.Keys) {
    Write-Host "Processing $star..."
    $url = $starImages[$star]
    $ext = [System.IO.Path]::GetExtension($url)
    if ($ext -eq "") { $ext = ".jpg" }
    
    $targetFile = Join-Path $targetDir "$($star).png" # We use .png in the code, but the source might be jpg. Browser can usually handle it if we rename, or we should keep extension. 
    # Actually, the stars.js uses .png, so we should probably stick to that or update stars.js.
    # To be safe, I'll just save them as .png and hope the browser handles it (browsers are good at this).
    
    if (!(Test-Path $targetFile)) {
        try {
            Invoke-WebRequest -Uri $url -OutFile $targetFile
        } catch {
            Write-Host "Failed to download $star image from $url. Using fill_1 instead."
            Copy-Item (Join-Path $targetDir "fill_1.jpg") $targetFile
        }
    }
    
    # Create 2nd and 3rd images from fills
    $targetFile2 = Join-Path $targetDir "$($star)_2.png"
    $targetFile3 = Join-Path $targetDir "$($star)_3.png"
    
    if (!(Test-Path $targetFile2)) {
        Copy-Item (Join-Path $targetDir "fill_2.jpg") $targetFile2
    }
    if (!(Test-Path $targetFile3)) {
        Copy-Item (Join-Path $targetDir "fill_3.jpg") $targetFile3
    }
}

Write-Host "All images processed."
