function toQueryString(obj: any, prefix: any): string {
    const str = [];
    let k, v;
    for(const p in obj) {
        // if (!obj.hasOwnProperty(p)) {continue;} // skip things from the prototype
        if (~p.indexOf('[')) {
            k = prefix ? prefix + "[" + p.substring(0, p.indexOf('[')) + "]" + p.substring(p.indexOf('[')) : p;
            // only put whatever is before the bracket into new brackets; append the rest
        } else {
            k = prefix ? prefix + "[" + p + "]" : p;
        }
        v = obj[p];
        str.push(typeof v == "object" ?
            toQueryString(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
    return str.join("&");
}

function query(params: { [key: string]: any }): string {
    if (!("view" in params)) {
        params["view"] = "compact"
    }
    return toQueryString(params, null);
}

function composeAnswerSearchUrl(base: string, metric: string, params: { [key: string]: any }): string {
    return base + "/" + metric + "+Answer.json" + "?" + query(params);}


export default function composeEndpointUrl(base: string, metric: string, searchParams: { [key: string]: any }) {
    return searchParams.map((params: object) => composeAnswerSearchUrl(base, metric, params))
}