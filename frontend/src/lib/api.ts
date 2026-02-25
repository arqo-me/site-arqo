import qs from 'qs';

export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
    try {
        const mergedOptions = {
            next: { revalidate: 10 },
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        };

        const queryString = qs.stringify(
            { ...urlParamsObject },
            { encodeValuesOnly: true }
        );

        const requestUrl = `http://127.0.0.1:1337/api${path}${queryString ? `?${queryString}` : ''}`;

        console.log(`Fetching from: ${requestUrl}`);

        const response = await fetch(requestUrl, mergedOptions);

        if (!response.ok) {
            console.error(response.statusText);
            throw new Error(`Strapi returned an error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch API Error:", error);
        throw new Error(`Failed to fetch API from Strapi.`);
    }
}
