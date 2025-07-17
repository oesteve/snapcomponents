declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.css";
interface Window {
    __snapComponents?: {
        baseUrl: string;
        token: string;
    };
}
