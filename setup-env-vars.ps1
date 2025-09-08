# Set environment variables for the current session
$env:VITE_API_BASE_URL = "http://localhost:8000/api"
$env:VITE_GEMINI_API_KEY = "your_gemini_api_key_here"

Write-Host "Environment variables have been set for the current session."
Write-Host "VITE_API_BASE_URL: $($env:VITE_API_BASE_URL)"
Write-Host "VITE_GEMINI_API_KEY: $($env:VITE_GEMINI_API_KEY)"

# Create .env.local file if it doesn't exist
$envLocalPath = ".env.local"
if (-not (Test-Path $envLocalPath)) {
    @"
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
"@ | Out-File -FilePath $envLocalPath -Encoding utf8
    Write-Host "Created .env.local file with default values. Please update with your actual API key."
} else {
    Write-Host ".env.local already exists. Please ensure it contains the required environment variables."
}
