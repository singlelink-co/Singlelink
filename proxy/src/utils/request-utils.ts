export class RequestUtils {
    static checkPostType(body: any): boolean {
        if (body.hasOwnProperty('headers')) {
            return body.headers['content-type'] === 'application/json';
        }

        return false;
    }

    /**
     * Extracts a fully qualified domain from a full URL.
     * Ex: https://www.google.com -> www.google.com
     *
     * @param url The url to extract from
     */
    static getDomain(url: string): string {
        return url.replace(/^https?:\/\//i, "");
    }

    /**
     * Validates a domain sees if it matches with a given origin. Wildcards are supported.
     * Domains must be fully qualified and have a separator length greater than two. Ex: (example.com)
     * @param url
     * @param origin
     */
    static validateDomain(url: string, origin: string): boolean {
        let domain = this.getDomain(url);
        let domainSplit = domain.split('.');
        let originSplit = origin.split('.');

        if (originSplit.length > domainSplit.length) return false;
        let difference = domainSplit.length - originSplit.length;

        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                originSplit.unshift("");
            }
        }

        let valid: boolean = true;

        for (let i = domainSplit.length - 1; i >= 0; i--) {
            if (originSplit[i] === '*') break;

            if (domainSplit[i] !== originSplit[i]) {
                valid = false;
                break;
            }
        }

        return valid;
    }
}