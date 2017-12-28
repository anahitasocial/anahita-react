export const constructURLSearchParams = (urlParams) => {
    var params = new URLSearchParams()
    for (var prop in urlParams) {
        params.append(prop, urlParams[prop])
    }
    return params;
};
