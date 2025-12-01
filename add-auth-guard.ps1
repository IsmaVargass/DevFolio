# Script para aplicar todos los cambios necesarios
$htmlFiles = @(
    "e:\xampp\htdocs\DevFolio\html\dashboard.html",
    "e:\xampp\htdocs\DevFolio\html\profile.html",
    "e:\xampp\htdocs\DevFolio\html\skills.html",
    "e:\xampp\htdocs\DevFolio\html\experience.html",
    "e:\xampp\htdocs\DevFolio\html\messages.html",
    "e:\xampp\htdocs\DevFolio\html\communities.html",
    "e:\xampp\htdocs\DevFolio\html\portfolio_builder.html",
    "e:\xampp\htdocs\DevFolio\html\customer_support.html",
    "e:\xampp\htdocs\DevFolio\html\admin_panel.html"
)

foreach ($file in $htmlFiles) {
    $content = Get-Content $file -Raw
    
    # Add auth-guard script if not present
    if ($content -notmatch 'auth-guard.js') {
        $content = $content -replace '(\s*</body>)', "`n    <script src=`"../js/auth-guard.js`"></script>`$1"
        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "Added auth-guard to $file"
    }
}

Write-Host "Auth guard added to all protected pages"
