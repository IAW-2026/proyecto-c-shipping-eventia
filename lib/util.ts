import { currentUser } from "@clerk/nextjs/server";

export function generarIdEntrada(): bigint {

    const EPOCH = 1767225600000; // 2025-01-01T00:00:00.000Z

    const timestamp = BigInt(Date.now() - EPOCH);
    const random = BigInt(Math.floor(Math.random() * 1000));
    const id = (timestamp * BigInt(1000)) + random;
   
    return id;
}


export function validarApiKey(request: Request, expectedKey: string | undefined): boolean {
    if (!expectedKey) {
        return false;
    }
    const apiKeyProporcionada = request.headers.get('x-api-key');
    return apiKeyProporcionada === expectedKey;
}

export async function isAdmin(){
    const user = await currentUser();
    if (!user) {
        return false;
    }
    const rolesAdmin = (user?.publicMetadata?.rolesAdmin as string[]) || [];
    return rolesAdmin.includes('adminShipping');
}
