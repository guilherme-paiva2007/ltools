<?php include './php/setup.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <?php include './html/head.php' ?>
</head>
<body>
    <style>
        .colorDiv {
            width: 100px;
            height: 100px;
        }
    </style>
    <div class="colorDiv" style="background-color: var(--red)"></div>
    <?php
        for ($i = 1; $i < 5; $i++) {
            echo "<div class='colorDiv' style='background-color: var(--redVar$i)'></div>";
        }
    ?>
</body>
</html>