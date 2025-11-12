# PowerShell script to test the webhook endpoint
Write-Host "Testing webhook endpoint with PowerShell Invoke-RestMethod" -ForegroundColor Green

# Create the JSON body
$body = @{
    message = "what are the classes this week?"
    userId = "test_user_123"
    platform = "manychat"
} | ConvertTo-Json

Write-Host "Sending request with body:" -ForegroundColor Yellow
Write-Host $body -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "https://openai-o3ba.onrender.com/make/webhook" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $body
        
    Write-Host "`nResponse:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    }
}