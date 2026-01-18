// src/freelance-persona/utils/licenseUtils.ts

export const LICENSE_URLS: Record<string, string> = {
    // Creative Commons
    "CC0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
    "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
    "CC BY-NC 4.0": "https://creativecommons.org/licenses/by-nc/4.0/",
    "CC BY-NC-SA 4.0": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    "CC BY-ND 4.0": "https://creativecommons.org/licenses/by-nd/4.0/",
    "CC BY-NC-ND 4.0": "https://creativecommons.org/licenses/by-nc-nd/4.0/",

    // Unversioned Defaults
    "CC BY-SA": "https://creativecommons.org/licenses/by-sa/4.0/",

    // Versions 3.0
    "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
    "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",

    // Open Source
    "MIT": "https://opensource.org/licenses/MIT",
    "Apache 2.0": "https://www.apache.org/licenses/LICENSE-2.0",
    "0BSD": "https://opensource.org/license/0bsd",
    "GPL 3.0": "https://www.gnu.org/licenses/gpl-3.0.html",

    // No Link needed
    "All Rights Reserved": "",
    "Public Domain": "",
};

export function getLicenseLink(license: string | { license: string; url: string } | "hidden" | undefined): { license: string; url?: string } | null {
    if (!license || license === "hidden") return null;

    if (typeof license === "object") {
        return { license: license.license, url: license.url };
    }

    const knownUrl = LICENSE_URLS[license];
    // If knownUrl is empty string (""), it means valid license but no link (e.g. All Rights Reserved)
    // If knownUrl is undefined, it's an unknown license string -> return name only

    return {
        license: license,
        url: knownUrl || undefined
    };
}
