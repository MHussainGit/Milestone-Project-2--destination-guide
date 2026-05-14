/*jslint node: true */
/*property all, catch, error, env, exitCode, get, join, length, line, local,
  log, map, max, message, on, process, remote, replace, resume, setEncoding,
  split, statusCode, then, trim, type, DEPLOY_URL, readFileSync */
var fs = require("fs");
var https = require("https");
var path = require("path");

var BASE_URL = process.env.DEPLOY_URL || String(
    "https://mhussaingit.github.io/Milestone-Project-2--destination-guide/"
);
var resources = [
    {local: "index.html", remote: "index.html", type: "html"},
    {local: "destinations.html", remote: "destinations.html", type: "html"},
    {local: "404.html", remote: "404.html", type: "html"},
    {
        local: "assets/css/styles.css",
        remote: "assets/css/styles.css",
        type: "text"
    },
    {local: "assets/js/app.js", remote: "assets/js/app.js", type: "text"}
];

function fetchPage(url) {
    var body;
    var status;

    return new Promise(function (resolve, reject) {
        https.get(url, function (res) {
            status = res.statusCode;
            if (status !== 200) {
                reject(new Error(url + " returned HTTP " + status));
                res.resume();
                return;
            }

            body = "";
            res.setEncoding("utf8");
            res.on("data", function (chunk) {
                body += chunk;
            });
            res.on("end", function () {
                resolve(body);
            });
        }).on("error", reject);
    });
}

function normalizeHtml(html) {
    var normalized = html.replace(/\r\n/g, "\n");
    normalized = normalized.replace(/>\s+</g, "><");
    normalized = normalized.replace(/\s+$/gm, "");
    return normalized.trim();
}

function normalizeText(text) {
    var normalized = text.replace(/\r\n/g, "\n");
    normalized = normalized.replace(/\s+$/gm, "");
    return normalized.trim();
}

function findFirstDifference(localLines, remoteLines) {
    var i;
    var maxLength = Math.max(localLines.length, remoteLines.length);

    i = 0;
    while (i < maxLength) {
        if (localLines[i] !== remoteLines[i]) {
            return {
                line: i + 1,
                local: localLines[i] || "",
                remote: remoteLines[i] || ""
            };
        }
        i += 1;
    }
    return null;
}

(function main() {
    var failed;
    var localPath;
    var localContent;
    var localNormalized;
    var remoteNormalized;
    var localLines;
    var remoteLines;
    var diff;

    failed = false;

    console.log(
        "Comparing local source files with deployed content at: "
        + BASE_URL
    );

    function compareResource(resource) {
        localPath = path.join(__dirname, resource.local);
        localContent = fs.readFileSync(localPath, "utf8");

        return fetchPage(
            BASE_URL + resource.remote
        ).then(function (remoteContent) {
            if (resource.type === "html") {
                localNormalized = normalizeHtml(localContent);
            } else {
                localNormalized = normalizeText(localContent);
            }

            if (resource.type === "html") {
                remoteNormalized = normalizeHtml(remoteContent);
            } else {
                remoteNormalized = normalizeText(remoteContent);
            }

            if (localNormalized === remoteNormalized) {
                console.log("✅ " + resource.local + " matches deployment");
                return;
            }

            failed = true;
            console.error("❌ " + resource.local + " does not match deployment");

            localLines = localNormalized.split("\n");
            remoteLines = remoteNormalized.split("\n");
            diff = findFirstDifference(localLines, remoteLines);

            if (diff) {
                console.error("  First difference at line " + diff.line + ":");
                console.error("    local : " + diff.local);
                console.error("    remote: " + diff.remote);
            }
        });
    }

    Promise.all(resources.map(compareResource)).then(function () {
        if (failed) {
            console.error(
                "\nDeployment comparison failed. Review " +
                "the mismatched files above."
            );
            process.exitCode = 1;
            return;
        }

        console.log("\nAll compared local files match the deployed site.");
    }).catch(function (error) {
        console.error("Error: " + error.message);
        process.exitCode = 1;
    });
}());
