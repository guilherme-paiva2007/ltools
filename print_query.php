<?php
include './php/page_config.php';
include './php/connection.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <?php include './html/head.php' ?>
</head>
<body>
    <form action="" method="POST">
        <label>Query</label>
        <textarea name="query"></textarea>
        <button type="submit">Enviar</button>
    </form>
    <?php
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'POST':
            $query = $_POST['query'];
            break;
        
        case 'GET':
            $query = $_GET['query'];
            break;
        
        default:
            $query = "";
    }
    if ($query) {
        $result = $connection->query($query);
    }
    ?>
    <p>Query inserida: <span style="color: rgb(0, 100, 255)"><?php echo $query ?></span></p>
    <style>
        table {
            border-collapse: collapse;
        }
        thead, tbody {
            border: 2px solid black;
        }
        tr, td, th {
            border: 1px solid black;
        }
    </style>
    <table>
        <thead>
            <tr>
                <?php
                if ($query) {
                    foreach ($result->fetch_fields() as $field) {
                        echo "<th>{$field->name}</th>";
                    }
                }
                ?>
            </tr>
        </thead>
        <tbody>
            <?php
            if ($query) {
                while ($row = $result->fetch_assoc()) {
                    echo "<tr>";
                    foreach ($row as $info) {
                        echo "<td>{$info}</td>";
                    }
                    echo "</tr>";
                }
            }
            ?>
        </tbody>
    </table>
</body>
</html>