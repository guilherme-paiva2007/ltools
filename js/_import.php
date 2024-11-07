<?php
echo "// prototypes.js\n";
include './prototypes.js';
echo "\n\n\n";
echo "// script.js\n";
include './script.js';
echo "\n\n\n";
echo "// web_script.js\n";
include './web_script.js';
echo "\n\n\n";
echo "// config.js\n";
include './config.js';
echo "\n\n\n";
echo "// load.js\n";
echo "window.addEventListener('load', () => {";
include './load.js';
echo "});";