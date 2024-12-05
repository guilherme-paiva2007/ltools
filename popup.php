<?php include './php/setup.php' ?>
<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <?php include './html/head.php' ?>
        <script>
            if (window.opener === null) {
                window.history.back()
                window.location.href = project_dir;
            }
        </script>
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
            const openerConsole = searchElement('opener-console');
            const openerConsoleInput =searchElement('opener-console-input');
            openerConsole.addEventListener('click', () => {
                const text = openerConsoleInput.value.trim();
                if (text !== "") {
                    opener.console.log(text);
                }
                openerConsoleInput.value = "";
            });
            searchElement('opener-console-input').addEventListener('keypress', event => {
                if (event.key === "Enter") {
                    openerConsole.click();
                }
            });
        </script>
    </body>
</html>