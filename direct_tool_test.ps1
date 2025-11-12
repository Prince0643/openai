# PowerShell script to test direct tool call
Write-Host "Direct tool call test" -ForegroundColor Green

# You'll need to set your BACKEND_API_KEY environment variable
# For testing purposes, you can hardcode it here (but don't commit it!)
$apiKey = $env:BACKEND_API_KEY

if (-not $apiKey) {
    Write-Host "Warning: BACKEND_API_KEY environment variable not set" -ForegroundColor Yellow
    Write-Host "You can set it with: `$env:BACKEND_API_KEY = 'your_api_key_here'" -ForegroundColor Gray
    # For testing, you can uncomment the line below and add your key
    # $apiKey = "your_api_key_here"
}

$toolBody = @{
    tool_name = "get_schedule_public"
    tool_args = @{
        date_from = (Get-Date).ToString("yyyy-MM-dd")
    }
} | ConvertTo-Json

Write-Host "Sending direct tool call: $($toolBody)" -ForegroundColor Gray

$headers = @{
    "Content-Type" = "application/json"
}

if ($apiKey) {
    $headers["Authorization"] = "Bearer $apiKey"
    Write-Host "Using API key for authentication" -ForegroundColor Green
} else {
    Write-Host "No API key provided - request may fail with 401" -ForegroundColor Red
}

try {
    $toolResponse = Invoke-RestMethod -Uri "https://openai-o3ba.onrender.com/tool-call" `
        -Method POST `
        -Headers $headers `
        -Body $toolBody
        
    Write-Host "`nDirect tool response:" -ForegroundColor Cyan
    $toolResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    }
}