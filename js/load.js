let storage = new WebStorageManager('test', localStorage);
storage.load();

ChromaticManager.loadJSON(project_dir + 'css/themes.json').then(json => ChromaticManager.apply('dark', 'blue'))