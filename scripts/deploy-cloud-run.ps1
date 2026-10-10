param(
  [Parameter(Mandatory=$true)][string]$Image,
  [string]$RevisionName = ('viet-y-runtime-' + (Get-Date).ToUniversalTime().ToString('yyyyMMddHHmmss')),
  [switch]$Preview,
  [switch]$UseVertexAI,
  [string]$VittyStorageBucket
)
$ErrorActionPreference = 'Stop'
if ($Image -notmatch '^asia-southeast1-docker\.pkg\.dev/c3-app-162/viet-y/app(?:@sha256:[a-f0-9]{64}|:[a-zA-Z0-9._-]+)$') {
  throw 'Unexpected image path; refusing to deploy outside Viet-Y registry.'
}
if ($RevisionName -notmatch '^viet-y-[a-z0-9-]+$') { throw 'Invalid Viet-Y revision name.' }
$runtimeSdk = 'C:/Users/DELL/AppData/Local/Google/Cloud SDK/google-cloud-sdk/bin/gcloud.ps1'
$runtimeAuthToken = & $runtimeSdk auth print-access-token --quiet
if ($LASTEXITCODE -ne 0) { throw 'Could not obtain deployment credentials.' }
try {
  $runtimeHeaders = @{ Authorization = ('Bearer ' + $runtimeAuthToken) }
  $runtimeUrl = 'https://asia-southeast1-run.googleapis.com/apis/serving.knative.dev/v1/namespaces/c3-app-162/services/viet-y'
  $runtimeService = Invoke-RestMethod -Method Get -Uri $runtimeUrl -Headers $runtimeHeaders
  if ($runtimeService.metadata.name -ne 'viet-y' -or $runtimeService.spec.template.spec.containers.Count -ne 1) {
    throw 'Unexpected target service or container count.'
  }
  $runtimeContainer = $runtimeService.spec.template.spec.containers[0]
  $runtimeContainer.image = $Image
  $runtimeContainer.command = @('node')
  $runtimeContainer.args = @('server.js')
  if ($UseVertexAI) {
    $vertexSettings = @{
      GOOGLE_GENAI_USE_VERTEXAI = 'true'
      GOOGLE_CLOUD_PROJECT = 'c3-app-162'
      GOOGLE_CLOUD_LOCATION = 'global'
    }
    $runtimeContainer.env = @($runtimeContainer.env | Where-Object { -not $vertexSettings.ContainsKey($_.name) }) + @(
      $vertexSettings.GetEnumerator() | ForEach-Object { [PSCustomObject]@{ name = $_.Key; value = $_.Value } }
    )
  }
  if ($VittyStorageBucket) {
    if ($VittyStorageBucket -ne 'c3-app-162-vitty-history') { throw 'Unexpected Vitty storage bucket.' }
    $runtimeContainer.env = @($runtimeContainer.env | Where-Object { $_.name -notin @('VITTY_STORAGE_BUCKET','VITTY_ALLOWED_ORIGINS') }) + @(
      [PSCustomObject]@{ name = 'VITTY_STORAGE_BUCKET'; value = $VittyStorageBucket },
      [PSCustomObject]@{ name = 'VITTY_ALLOWED_ORIGINS'; value = 'https://ais-dev-o3rrywly7slgnm7urzsfge-823055115091.asia-southeast1.run.app,https://viet-y.ai.studio' }
    )
  }
  # Replace AI Studio prebuilt-source config with the verified production image.
  foreach ($annotation in @('run.googleapis.com/sources', 'run.googleapis.com/base-images')) {
    $runtimeService.spec.template.metadata.annotations.PSObject.Properties.Remove($annotation)
  }
  $runtimeService.spec.template.spec.PSObject.Properties.Remove('runtimeClassName')
  $runtimeService.spec.template.metadata | Add-Member -NotePropertyName name -NotePropertyValue $RevisionName -Force
  foreach ($annotation in @('run.googleapis.com/operation-id', 'run.googleapis.com/urls', 'run.googleapis.com/ingress-status', 'serving.knative.dev/creator', 'serving.knative.dev/lastModifier')) {
    $runtimeService.metadata.annotations.PSObject.Properties.Remove($annotation)
  }
  if ($Preview) {
    # Pin existing traffic to resolved revisions: latestRevision must not move it to this preview.
    $liveTraffic = @($runtimeService.status.traffic | Where-Object { $_.percent -gt 0 })
    if (($liveTraffic | Measure-Object -Property percent -Sum).Sum -ne 100) { throw 'Could not resolve current production traffic.' }
    $runtimeService.spec.traffic = @($liveTraffic | ForEach-Object {
      [PSCustomObject]@{ revisionName = $_.revisionName; percent = $_.percent }
    }) + @([PSCustomObject]@{ revisionName = $RevisionName; percent = 0; tag = 'ux-preview' })
  } else {
    $runtimeService.spec.traffic = @([PSCustomObject]@{ latestRevision = $true; percent = 100 })
  }
  # Existing env values stay in memory and are preserved, never logged or saved.
  $runtimeBody = [ordered]@{
    apiVersion = 'serving.knative.dev/v1'
    kind = 'Service'
    metadata = [ordered]@{
      name = $runtimeService.metadata.name
      namespace = $runtimeService.metadata.namespace
      resourceVersion = $runtimeService.metadata.resourceVersion
      labels = $runtimeService.metadata.labels
      annotations = $runtimeService.metadata.annotations
    }
    spec = $runtimeService.spec
  }
  $runtimeResponse = Invoke-RestMethod -Method Put -Uri $runtimeUrl -Headers $runtimeHeaders -ContentType 'application/json' -Body ($runtimeBody | ConvertTo-Json -Depth 40 -Compress)
  [PSCustomObject]@{
    service = $runtimeResponse.metadata.name
    generation = $runtimeResponse.metadata.generation
    requestedRevision = $RevisionName
    image = $Image
    preview = [bool]$Preview
    envNamesPreserved = @($runtimeContainer.env | ForEach-Object { $_.name })
  } | ConvertTo-Json -Depth 4
} finally {
  $runtimeAuthToken = $null
  $runtimeHeaders = $null
  $runtimeBody = $null
  $runtimeService = $null
}
