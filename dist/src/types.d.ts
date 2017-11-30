export declare namespace Config {
    interface Component {
        cwd?: string;
        host?: string;
        port?: number;
        sequence?: any;
    }
    interface Method {
        PROTO_NAME: string;
        PROTO_PACKAGE: string;
        SERVICE_NAME: string;
        METHOD_NAME: string;
        REQUEST_STREAM: boolean;
        RESPONSE_STREAM: boolean;
    }
}
