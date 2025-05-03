export default function waitUntilInDev(delay: number): Promise<void> {
    if(import.meta.env.DEV) {
        return new Promise(res => setTimeout(res, delay))
    }

    return Promise.resolve()
}