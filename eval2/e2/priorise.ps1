# Script de priorisation manuelle des process
# Execution : clic droit sur le .ps1 -> Executer avec PowerShell
# (ou ouvrir PowerShell et lancer : .\prioriser.ps1)

# Process serveur/calcul -> High
$processHigh = @("node", "mysqld", "java", "javaw", "httpd", "apache")

# Process interactifs UI -> AboveNormal (boost leger, garde le systeme stable)
$processAboveNormal = @("chrome", "Code", "postman", "Postman")

function Set-Priority {
    param($names, $priority)
    foreach ($name in $names) {
        $procs = Get-Process -Name $name -ErrorAction SilentlyContinue
        if ($procs) {
            foreach ($p in $procs) {
                try {
                    $p.PriorityClass = $priority
                    Write-Output "[$priority] $($p.ProcessName) (PID: $($p.Id))"
                } catch {
                    Write-Output "Erreur sur $($p.ProcessName): $_"
                }
            }
        } else {
            Write-Output "$name non trouve (pas lance ?)"
        }
    }
}

Set-Priority -names $processHigh -priority "High"
Set-Priority -names $processAboveNormal -priority "AboveNormal"

Write-Output ""
Write-Output "Termine. Appuyez sur une touche pour fermer..."
[void][System.Console]::ReadKey($true)
