module.exports = (req, res) => {
    res.send(
        '<html>\n' +
        '    <head>\n' +
        '        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">\n' +
        '        <link rel="icon" type="image/png" href="https://app.singlelink.co/favicon.ico">\n' +
        '        <title>Status Page | Singlelink</title>\n' +
        '    </head>\n' +
        '    <body class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100">\n' +
        '        <section class="flex flex-col mt-auto bg-white rounded shadow p-6 w-11/12 max-w-lg border-8 border-l-0 border-r-0 border-b-0 border-indigo-600">\n' +
        '            <h1 class="text-2xl font-semibold text-gray-800 mb-2">Status Page</h1>\n' +
        '            <p class="text-base text-gray-600 mb-4">Welcome to the Singlelink status page, view the status and downtime of various application infrastructure below.</p>\n' +
        '            <div class="flex flex-row justify-apart items-center p-3 cursor-pointer hover:bg-gray-100 rounded">\n' +
        '               <div style="width:8px;height:8px;box-shadow: 0 0 0 3px rgba(104,211,145,.4);" class="mr-4 bg-green-400 rounded-full"></div>' +
        '               <p class="mr-2 text-gray-600 font-medium text-sm">Singlelink API</p>' +
        '               <p class="ml-auto text-gray-500 text-sm">99.9% Uptime</p>' +
        '            </div>\n' +
        '            <div class="flex flex-row justify-apart items-center p-3 cursor-pointer hover:bg-gray-100 rounded">\n' +
        '               <div style="width:8px;height:8px;box-shadow: 0 0 0 3px rgba(104,211,145,.4);" class="mr-4 bg-green-400 rounded-full"></div>' +
        '               <p class="mr-2 text-gray-600 font-medium text-sm">Singlelink Client</p>' +
        '               <p class="ml-auto text-gray-500 text-sm">99.9% Uptime</p>' +
        '            </div>\n' +
        '            <div class="flex flex-row justify-apart items-center p-3 cursor-pointer hover:bg-gray-100 rounded">\n' +
        '               <div style="width:8px;height:8px;box-shadow: 0 0 0 3px rgba(104,211,145,.4);" class="mr-4 bg-green-400 rounded-full"></div>' +
        '               <p class="mr-2 text-gray-600 font-medium text-sm">Singlelink Database</p>' +
        '               <p class="ml-auto text-gray-500 text-sm">99.9% Uptime</p>' +
        '            </div>\n' +
        '            <div class="flex flex-row justify-apart items-center p-3 cursor-pointer hover:bg-gray-100 rounded">\n' +
        '               <div style="width:8px;height:8px;box-shadow: 0 0 0 3px rgba(104,211,145,.4);" class="mr-4 bg-green-400 rounded-full"></div>' +
        '               <p class="mr-2 text-gray-600 font-medium text-sm">Community Support</p>' +
        '               <p class="ml-auto text-gray-500 text-sm">100% Uptime</p>' +
        '            </div>\n' +
        '        </section>\n' +
        '       <section class="flex text-center text-gray-600 text-sm mt-auto mb-4">All rights reserved.</br>Copyright ©2020 Neutron Creative Inc.</section>\n' +
        '    </body>\n' +
        '</html>\n'
    );
};
/*
<html>
    <head>
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="flex flex-row items-center justify-center w-screen min-h-screen bg-gray-100">
        <section class="flex flex-col bg-white rounded shadow p-6">
            <h1 class="text-xl font-semibold text-gray-800">Singlelink API</h1>
        </section>
    </body>
</html>
*/