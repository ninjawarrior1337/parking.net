export type LoginRequest = {
    username: string,
    password: string
}

export type LoginResponse = {
    success: boolean,
    message: string,
    token: string
}

export type LotDto = {
    lotId: string,
    spacesCount: number
}

export type LotMeasurementDto = {
    timestamp: string,
    availableSpaces: number
}