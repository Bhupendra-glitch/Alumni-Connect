# PowerShell script to fix Material-UI Grid components for v7 compatibility
# This script updates the old Grid API to the new size-based API

Write-Host "Fixing Grid components for Material-UI v7 compatibility..."

# Get all TypeScript React files
$files = Get-ChildItem -Path "src" -Recurse -Filter "*.tsx"

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw
    
    # Replace various Grid patterns
    $content = $content -replace 'Grid item xs=\{([^}]*)\} sm=\{([^}]*)\} md=\{([^}]*)\}', 'Grid size={{ xs: $1, sm: $2, md: $3 }}'
    $content = $content -replace 'Grid item xs=\{([^}]*)\} md=\{([^}]*)\}', 'Grid size={{ xs: $1, md: $2 }}'
    $content = $content -replace 'Grid item xs=\{([^}]*)\} sm=\{([^}]*)\}', 'Grid size={{ xs: $1, sm: $2 }}'
    $content = $content -replace 'Grid item xs=\{([^}]*)\}', 'Grid size={{ xs: $1 }}'
    
    # Write the updated content back
    Set-Content $file.FullName -Value $content
}

Write-Host "Grid component fixes completed!"
Write-Host "You can now run 'npm start' to test the application."
