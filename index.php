<?php include './php/page_config.php'; ?>
<!DOCTYPE html>
<html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <?php include './html/head.php'; ?>
    </head>
    <body>
        <?php include './html/header.php' ?>
        <main>
            <h1>Index</h1>
            <?php
            foreach (scandir("./") as $dir) {
                if (str_ends_with($dir, ".php")) {
                    echo "<a href=\"{$dir}\">{$dir}</a><br>";
                }
            }
            ?>
        </main>
        <?php include './html/footer.php' ?>
    </body>
</html>