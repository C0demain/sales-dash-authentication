import { NextFunction } from "express";

export const userFilter = (req: any, res: any, next: NextFunction): any => {
    const { userId } = req.query
    let filters = req.filters || {}
    if (userId) {
        filters = { ...filters, userId: userId }
        req.filters = filters
    }
    return next()
}

export const productFilter = (req: any, res: any, next: NextFunction): any => {
    const { productId } = req.query
    let filters = req.filters || {}
    if (productId) {
        filters = { ...filters, productId: productId }
        req.filters = filters
    }
    return next()
}

export const clientFilter = (req: any, res: any, next: NextFunction): any => {
    const { clientId } = req.query
    let filters = req.filters || {}
    if (clientId) {
        filters = { ...filters, clientId: clientId }
        req.filters = filters
    }
    return next()
}