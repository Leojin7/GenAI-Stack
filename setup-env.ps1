# Create .env.local file if it doesn't exist
$envPath = Join-Path $PSScriptRoot ".env.local"
$envExamplePath = Join-Path $PSScriptRoot ".env.example"

if (-not (Test-Path $envPath)) {
    Write-Host "Creating .env.local file..."
    Copy-Item -Path $envExamplePath -Destination $envPath
    Write-Host "Please edit .env.local and add your API keys"
} else {
    Write-Host ".env.local already exists"
}

# Install dependencies
Write-Host "Installing dependencies..."
npm install

Write-Host "Setup complete. Run 'npm run dev' to start the development server"
