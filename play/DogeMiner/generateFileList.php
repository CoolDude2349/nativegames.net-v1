<?php
$directory = __DIR__ . '/nativegames.net-v1/play/DogeMiner'; 
$base_url = '/nativegames.net-v1/play/DogeMiner/'; 

function listFiles($dir, $base_url) {
    $files = [];
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    
    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $relativePath = str_replace($dir, '', $file->getPathname());
            $relativePath = str_replace('\\', '/', $relativePath); 
            $files[] = $base_url . ltrim($relativePath, '/');
        }
    }
    return $files;
}

header('Content-Type: application/json');
echo json_encode(listFiles($directory, $base_url));
?>
