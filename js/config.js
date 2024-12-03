// WEB

const HTML = searchElement('html', 'query');
const project_dir = `${location.protocol}//${location.host}/ltools/`;

function popupConfig(height = 800, width = 500) {
    return Object.entries({
        height: height,
        width: width,
        top: (screen.height - height) / 2,
        left: (screen.width - width) / 2,
        resizable: 'no',
        scrollbars: 'no',
        status: 'no',
        toolbar: 'no',
        location: 'no',
        menubar: 'no'
    }).map(([key, value]) => `${key}=${value}`).join(',')
}

const popup = new Popup('popup.php', popupConfig(800, 500));