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
        body {
            display: flex;
        }
        .colorDiv {
            width: 150px;
            height: 150px;
        }
    </style>
    <div style="background-color: var(--greyVar4); padding: 12px;">
        <div class="colorDiv" style="background-color: var(--main)"></div>
        <?php
            for ($i = 1; $i < 5; $i++) {
                echo "<div class='colorDiv' style='background-color: var(--mainVar$i)'></div>";
            }
        ?>
    </div>
    <div class="colorDiv"></div>
    <div style="background: linear-gradient(90deg, var(--reverse), var(--grey) 33%, var(--grey) 66%, var(--base) 100%); height: min-content; padding: 12px">
        <?php
            for ($i = 1; $i < 4; $i++) {
                echo "<div class='colorDiv' style='background-color: var(--mainFilter$i)'></div>";
            }
        ?>
    </div>
    <div class="colorDiv"></div>
    <div style="background-color: var(--reverse); height: min-content; padding: 12px">
        <div class="colorDiv" style="background-color: var(--base)"></div>
        <?php
            for ($i = 1; $i < 5; $i++) {
                echo "<div class='colorDiv' style='background-color: var(--baseVar$i)'></div>";
            }
        ?>
    </div>
    <div class="colorDiv"></div>
    <div style="background: linear-gradient(90deg, var(--reverse), var(--grey) 33%, var(--grey) 66%, var(--baseVar1) 100%); height: min-content; padding: 12px">
        <?php
            for ($i = 1; $i < 4; $i++) {
                echo "<div class='colorDiv' style='background-color: var(--baseFilter$i)'></div>";
            }
        ?>
    </div>
</body>
</html>