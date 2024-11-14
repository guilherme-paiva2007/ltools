<?php include './php/setup.php' ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <?php include './html/head.php' ?>
    <style>
        table {
            border-collapse: collapse;
        }

        tr, th, td {
            border: 1px solid black;
        }

        thead, tbody {
            border: 2px solid black;
        }
    </style>
</head>
<body>
    <table>
        <caption>
            <?php echo $_SERVER['REQUEST_METHOD'] ?>
        </caption>
        <thead>
            <tr>
                <th>key</th>
                <th>value</th>
            </tr>
        </thead>
        <tbody>
    <?php
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'POST':
                foreach ($_POST as $key => $value) {
                    echo "<tr>";

                    echo "<td>";
                    echo $key;
                    echo "</td>";

                    echo "<td>";
                    echo $value;
                    echo "</td>";

                    echo "</tr>";
                }
                break;
            case 'GET':
                foreach ($_GET as $key => $value) {
                    echo "<tr>";

                    echo "<td>";
                    echo $key;
                    echo "</td>";

                    echo "<td>";
                    echo $value;
                    echo "</td>";

                    echo "</tr>";
                }
                break;
        }
    ?>
        </tbody>
    </table>
</body>
</html>