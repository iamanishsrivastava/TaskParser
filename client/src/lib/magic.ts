import { Magic } from "magic-sdk";

const magic = new Magic(import.meta.env.VITE_MAGIC_PUBLISHABLE_API_KEY);
export default magic;
