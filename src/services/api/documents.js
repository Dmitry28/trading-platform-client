import Axios from 'axios';
import { SESSION_API_URL, LIMIT, DOCUMENT_IDENTIFIERS } from '../../constants';

export function getDocuments(page = 0) {
    const generateUrl = (document = {}) => {
        let url = `${SESSION_API_URL}/documents/download`;

        if (DOCUMENT_IDENTIFIERS[document.type]) {
            url += `?${DOCUMENT_IDENTIFIERS[document.type]}=${document.id}`;
        }
        return url;
    };

    return Axios.get(`${SESSION_API_URL}/documents`, {
        params: { limit: LIMIT, offset: page * LIMIT }
    }).then(response => {
        const { documents = [] } = response.data;
        response.data.documents = documents.map(d => ({ ...d, url: generateUrl(d) }));
        return response;
    });
}

export function downloadDocument(url, name) {
    return Axios.get(url, { responseType: 'blob' }).then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${name}.pdf`);
        link.click();
        window.URL.revokeObjectURL(url);
    });
}
