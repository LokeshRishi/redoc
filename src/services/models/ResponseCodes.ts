
export interface ResponseCodes {
    errors: { [key: string]: ResponseCodeMetadata };
}

export interface ResponseCodeMetadata {
    domain: string;
    category: string;
    description: string;
}
