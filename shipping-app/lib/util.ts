export function generarIdEntrada(): bigint {

    const EPOCH = 1767225600000; // 2025-01-01T00:00:00.000Z

    const timestamp = BigInt(Date.now() - EPOCH);
    const random = BigInt(Math.floor(Math.random() * 1000));
    const id = (timestamp * BigInt(1000)) + random;
   
    return id;
}