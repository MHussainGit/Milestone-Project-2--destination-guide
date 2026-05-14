/*jslint node, devel */
/*property
    DEPLOY_URL, appendChild, allowFullscreen, catch, className,
    createElement, cursor, display, encodeURIComponent, env, error,
    exitCode, fetchPage, filter, get, getAttribute, has, hasOwnProperty,
    hostname, innerHTML, join, json, length, line, local, log, margin,
    max, maxWidth, message, ok, on, pathname, pop, preventDefault, push,
    querySelectorAll, readFileSync, remote, removeAttribute, replace,
    resume, scrollIntoView, setAttribute, setEncoding, showCityResults,
    split, statusCode, style, textContent, textDecoration, then,
    toLowerCase, toggle, trim, type, value, warn
*/

(function () {
    "use strict";

    const fs = require("fs");
    const https = require("https");
    const path = require("path");

    const BASE_URL = (
        process.env.DEPLOY_URL || (
            "https://mhussaingit.github.io/" +
            "Milestone-Project-2--destination-guide/"
        )
    );

    const resources = [
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
        return new Promise(function (resolve, reject) {
            https.get(url, function (res) {
                const status = res.statusCode;
                if (status !== 200) {
                    reject(new Error(url + " returned HTTP " + status));
                    res.resume();
                    return;
                }

                let body = "";
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
        return html.replace(
            /\r\n/g,
            "\n"
        ).replace(
            />\s+</g,
            "><"
        ).replace(
            /\s+$/gm,
            ""
        ).trim();
    }

    function normalizeText(text) {
        return text.replace(
            /\r\n/g,
            "\n"
        ).replace(
            /\s+$/gm,
            ""
        ).trim();
    }

    function findFirstDifference(localLines, remoteLines) {
        const maxLength = Math.max(localLines.length, remoteLines.length);
        let i = 0;
        let result = null;

        while (i < maxLength) {
            if (localLines[i] !== remoteLines[i]) {
                result = {
                    line: i + 1,
                    local: localLines[i] || "",
                    remote: remoteLines[i] || ""
                };
                break;
            }
            i += 1;
        }
        return result;
    }

    (async function main() {
        console.log(
            "Comparing local source files with: " + BASE_URL
        );

        let failed = false;
        let i = 0;

        while (i < resources.length) {
            const resource = resources[i];
            const localPath = path.join(__dirname, resource.local);
            const localContent = fs.readFileSync(localPath, "utf8");
            const remoteContent = await fetchPage(BASE_URL + resource.remote);

            const localNormalized = (
                resource.type === "html"
                ? normalizeHtml(localContent)
                : normalizeText(localContent)
            );
            const remoteNormalized = (
                resource.type === "html"
                ? normalizeHtml(remoteContent)
                : normalizeText(remoteContent)
            );

            if (localNormalized === remoteNormalized) {
                console.log("✅ " + resource.local + " matches");
            } else {
                failed = true;
                console.error("❌ " + resource.local + " mismatch");

                const localLines = localNormalized.split("\n");
                const remoteLines = remoteNormalized.split("\n");
                const diff = findFirstDifference(localLines, remoteLines);

                if (diff) {
                    console.error("  Line " + diff.line + ":");
                    console.error("    local : " + diff.local);
                    console.error("    remote: " + diff.remote);
                }
            }
            i += 1;
        }

        if (failed) {
            console.error("\nDeployment comparison failed.");
            process.exitCode = 1;
        } else {
            console.log("\nAll files match.");
        }
    }()).catch(function (error) {
        console.error("Error: " + error.message);
        process.exitCode = 1;
    });
}());
