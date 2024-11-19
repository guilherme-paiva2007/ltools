<?php include './php/setup.php' ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <?php include './html/head.php' ?>
</head>
<body>
    <label for="">Destination:</label>
    <input type="text" id="customform-destination"><br>
    <label for="">Method:</label>
    <select id="customform-method">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
    </select><br>
    <label for="">Inputs:</label>
    <input type="number" value="1" id="customform-inputs"><br>
    <label for="">Blank:</label>
    <input type="checkbox" value="true" id="customform-blank"><br>
    <hr>
    <form id="customform">
        <table>
            <thead>
                <tr>
                    <th>name</th>
                    <th>type</th>
                    <th>value</th>
                </tr>
            </thead>
            <tbody id="customform-table">
                <tr id="customform-buttonrow">
                    <th colspan="3"><button type="submit">Enviar</button></th>
                </tr>
            </tbody>
        </table>
        <div hidden>
            <select id="clone-types">
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="datetime-local">Datetime</option>
                <option value="email">Email</option>
                <option value="color">Color</option>
            </select>
        </div>
    </form>
    <script>
        const form = document.getElementById('customform');
        const destination =document.getElementById('customform-destination');
        const method =document.getElementById('customform-method');
        const inputcount =document.getElementById('customform-inputs');
        const table=document.getElementById('customform-table');
        const buttonrow =document.getElementById('customform-buttonrow');
        const blank =document.getElementById('customform-blank');

        inputcount.addEventListener('input', () => {
            let count =parseInt(inputcount.value);

            table.innerHTML = "";

            for (let i = 0; i < count; i++) {
                let row =document.createElement('tr');
                let data1 =document.createElement('td');
                let data2=document.createElement('td');
                let data3 =document.createElement('td')

                let input =document.createElement('input');
                let name =document.createElement('input');
                let type = document.getElementById('clone-types').cloneNode(true);
                type.id = "";

                name.addEventListener('input', () => {
                    input.name = name.value;
                })

                type.addEventListener('input', () => {
                    input.type = type.value;
                })

                type.dispatchEvent(new Event('input'));

                data1.append(name)
                data2.append(type)
                data3.append(input)

                row.append(data1, data2, data3)

                table.append(row)
            }

            table.append(buttonrow)
        })

        inputcount.dispatchEvent(new Event('input'))

        form.addEventListener('submit', () => {
            form.method = method.value;
            form.action =destination.value;
            form.target = Boolean(blank.value) ? "_blank" : "";
        });
    </script>
</body>
</html>