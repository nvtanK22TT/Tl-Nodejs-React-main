$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot "..\frontend\public\images"

function New-Canvas($path, $bg1, $bg2, $title, $mode) {
    $w = 900
    $h = 520
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.ColorTranslator]::FromHtml($bg1), [System.Drawing.ColorTranslator]::FromHtml($bg2), 35)
    $g.FillRectangle($brush, $rect)

    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(238, 255, 255, 255))
    $green = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#38a34a"))
    $dark = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#1f2933"))
    $orange = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#f59e0b"))
    $red = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#ef4444"))
    $yellow = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#facc15"))
    $soil = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#8b5a2b"))
    $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 255, 255, 255), 3)

    $titleFont = New-Object System.Drawing.Font("Arial", 34, [System.Drawing.FontStyle]::Bold)
    $smallFont = New-Object System.Drawing.Font("Arial", 18, [System.Drawing.FontStyle]::Bold)
    $g.DrawString($title, $titleFont, $dark, 44, 34)

    if ($mode -eq "vegetables") {
        for ($i = 0; $i -lt 9; $i++) {
            $x = 70 + ($i * 85)
            $y = 210 + (($i % 3) * 22)
            $g.FillEllipse($green, $x, $y, 82, 58)
            $g.FillEllipse($red, $x + 30, $y + 72, 55, 55)
            $g.FillEllipse($orange, $x + 5, $y + 135, 70, 30)
        }
        $g.FillRectangle($soil, 0, 430, $w, 90)
    }
    elseif ($mode -eq "fruit") {
        for ($i = 0; $i -lt 11; $i++) {
            $x = 80 + (($i % 6) * 118)
            $y = 205 + ([Math]::Floor($i / 6) * 95)
            $b = @($orange, $red, $yellow, $green)[$i % 4]
            $g.FillEllipse($b, $x, $y, 82, 82)
            $g.DrawArc($linePen, $x + 18, $y + 10, 44, 26, 200, 120)
        }
        $g.FillPie($soil, 110, 335, 660, 170, 0, 180)
    }
    elseif ($mode -eq "rice") {
        $g.FillRectangle($soil, 0, 360, $w, 160)
        for ($i = 0; $i -lt 18; $i++) {
            $x = 20 + $i * 52
            $g.DrawLine((New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#4ade80"), 5)), $x, 375, $x + 24, 230)
            $g.FillEllipse($yellow, $x + 14, 220, 34, 18)
            $g.FillEllipse($yellow, $x + 2, 250, 34, 18)
        }
        $g.FillEllipse($white, 315, 270, 270, 110)
    }
    elseif ($mode -eq "farmqr") {
        $g.FillRectangle($green, 0, 335, $w, 185)
        $g.FillPolygon($soil, @(
            (New-Object System.Drawing.Point(90, 335)),
            (New-Object System.Drawing.Point(230, 210)),
            (New-Object System.Drawing.Point(370, 335))
        ))
        $g.FillRectangle($white, 585, 145, 205, 205)
        Draw-QR $g 610 170 16
        $g.DrawString("QR TRACE", $smallFont, $dark, 580, 380)
    }
    elseif ($mode -eq "digital") {
        $g.FillRectangle($white, 72, 160, 310, 220)
        $g.FillRectangle($green, 105, 205, 240, 30)
        $g.FillRectangle($green, 105, 260, 180, 30)
        $g.FillRectangle($green, 105, 315, 220, 30)
        $g.FillEllipse($orange, 535, 205, 110, 110)
        $g.FillEllipse($red, 665, 250, 90, 90)
        Draw-QR $g 560 335 12
    }
    elseif ($mode -eq "watermelon") {
        for ($i = 0; $i -lt 7; $i++) {
            $x = 40 + ($i * 118)
            $y = 245 + (($i % 2) * 44)
            $g.FillEllipse($green, $x, $y, 150, 100)
            $stripePen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#166534"), 8)
            $g.DrawArc($stripePen, $x + 18, $y + 8, 115, 86, 190, 145)
            $g.DrawArc($stripePen, $x + 54, $y + 8, 80, 86, 185, 150)
        }
        $g.FillPie($red, 220, 165, 330, 300, 195, 150)
        $g.DrawArc((New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#f7f7d8"), 14)), 220, 165, 330, 300, 195, 150)
        for ($i = 0; $i -lt 12; $i++) {
            $g.FillEllipse($dark, 310 + (($i % 4) * 42), 245 + ([Math]::Floor($i / 4) * 36), 12, 18)
        }
    }
    elseif ($mode -eq "passion") {
        for ($i = 0; $i -lt 9; $i++) {
            $x = 80 + (($i % 5) * 135)
            $y = 190 + ([Math]::Floor($i / 5) * 115)
            $purple = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#8b3a62"))
            $g.FillEllipse($purple, $x, $y, 95, 85)
        }
        $g.FillPie($yellow, 385, 245, 210, 180, 10, 340)
        $g.FillEllipse((New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#fff7bf"))), 425, 280, 125, 95)
        for ($i = 0; $i -lt 22; $i++) {
            $g.FillEllipse($dark, 438 + (($i % 7) * 14), 298 + ([Math]::Floor($i / 7) * 18), 7, 7)
        }
        $leafPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#166534"), 8)
        $g.DrawLine($leafPen, 95, 185, 145, 145)
        $g.DrawLine($leafPen, 630, 190, 700, 145)
    }
    else {
        $g.FillRectangle($green, 0, 360, $w, 160)
        for ($i = 0; $i -lt 5; $i++) {
            $x = 105 + $i * 145
            $g.FillEllipse($white, $x, 170, 90, 90)
            $g.FillRectangle($soil, $x + 38, 258, 18, 88)
            $g.DrawLine((New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#1f7a35"), 8)), $x + 47, 300, $x - 18, 248)
            $g.DrawLine((New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#1f7a35"), 8)), $x + 47, 300, $x + 118, 248)
        }
    }

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

function Draw-QR($g, $x, $y, $cell) {
    $black = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#111827"))
    $pattern = @(
        "1111111010111",
        "1000001010001",
        "1011101011101",
        "1011101000101",
        "1011101110101",
        "1000001000001",
        "1111111011111",
        "0000100010010",
        "1110111110111",
        "1010001000001",
        "1011101111101",
        "1000100000101",
        "1110111011111"
    )
    for ($r = 0; $r -lt $pattern.Count; $r++) {
        for ($c = 0; $c -lt $pattern[$r].Length; $c++) {
            if ($pattern[$r][$c] -eq "1") {
                $g.FillRectangle($black, $x + $c * $cell, $y + $r * $cell, $cell - 2, $cell - 2)
            }
        }
    }
}

New-Canvas (Join-Path $outDir "trace-vegetables.png") "#f2fff4" "#b7eec2" "Local Vegetables" "vegetables"
New-Canvas (Join-Path $outDir "trace-fruit.png") "#fff7e6" "#c8f2cd" "Local Fruit" "fruit"
New-Canvas (Join-Path $outDir "trace-rice.png") "#f7ffe8" "#d9b06b" "Traceable Rice" "rice"
New-Canvas (Join-Path $outDir "trace-hero.png") "#f4fbf5" "#b8e3c1" "QR Origin Traceability" "farmqr"
New-Canvas (Join-Path $outDir "trace-digital.png") "#eef6ff" "#c9efd2" "Digital Farm Records" "digital"
New-Canvas (Join-Path $outDir "trace-farm.png") "#eef9f0" "#abdcb5" "Local Agriculture" "farm"
New-Canvas (Join-Path $outDir "trace-watermelon.png") "#f1fff4" "#a7e7b4" "Watermelon QR Batch" "watermelon"
New-Canvas (Join-Path $outDir "trace-passionfruit.png") "#fff5fb" "#d9f6c8" "Passion Fruit Trace" "passion"

Write-Host "Generated QR agriculture images in $outDir"
