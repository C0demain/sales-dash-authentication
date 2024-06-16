import swaggerUI from 'swagger-ui-express'
import swaggerFile from '../swagger.json'
import BaseRoutes from "./BaseRouter";


class ProductsRouter extends BaseRoutes{ 
    routes(): void {
        this.router.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerFile) /* #swagger.tags = ['info'] */)
        this.router.get("/docsFile", (req, res) => {
            // #swagger.ignore = true
            return res.status(200).send(swaggerFile)
        })
    }  
}

export default new ProductsRouter().router;