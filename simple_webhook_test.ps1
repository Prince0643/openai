# Simple webhook test
Write-Host "Testing webhook endpoint..." -ForegroundColor Green

$body = @{
    message = "what are the classes this week?"
    userId = "test_user_123"
    platform = "manychat"
} | ConvertTo-Json

Write-Host "Sending request..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "https://openai-o3ba.onrender.com/make/webhook" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $body
    
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host $response.Content -ForegroundColor White
} catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to read the error response if available
    try {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorText = $reader.ReadToEnd()
        Write-Host "Error Response: $errorText" -ForegroundColor Red
    } catch {
        Write-Host "Could not read error response" -ForegroundColor Red
    }
}