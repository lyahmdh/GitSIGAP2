<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>SIGAP - React Preview</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/react.jsx'])
</head>
<body class="min-h-screen bg-stone-100">
    <div id="react-root"></div>
</body>
</html>
