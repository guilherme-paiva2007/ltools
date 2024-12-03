<?php include './php/setup.php' ?>
<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <?php include './html/head.php' ?>
    </head>
    <body>
        <label for="">Set Test:</label><br>
        <input type="text" id="test"><br><hr><br>
        <script>
            searchElement('test').addEventListener('input', event => {
                if (Popup.IncomingStorage) {
                    Popup.IncomingStorage.test = event.target.value;
                }
            })
        </script>
        <label for="">Print in opener console</label><br>
        <input type="text" id="opener-console-input"><br>
        <button id="opener-console">Print</button><br><hr><br>
        <script>
            searchElement('opener-console').addEventListener('click', () => {
                const input =searchElement('opener-console-input');

                opener.console.log(input.value);
            })
        </script>
    </body>
</html>